import { useStakePoolId } from './useStakePoolId'
import { useStakePoolData } from './useStakePoolData'
import { useStakeAuthorizationsForPool } from './useStakeAuthorizationsForPool'
import { AccountData, getBatchedMultipleAccounts } from '@cardinal/common'
import {
  StakeAuthorizationData,
  StakeEntryData,
  StakePoolData,
} from '@cardinal/staking/dist/cjs/programs/stakePool'
import * as spl from '@solana/spl-token'
import * as metaplex from '@metaplex-foundation/mpl-token-metadata'
import { findStakeEntryIdFromMint } from '@cardinal/staking/dist/cjs/programs/stakePool/utils'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { AccountInfo, ParsedAccountData, PublicKey } from '@solana/web3.js'
import { getStakeEntries } from '@cardinal/staking/dist/cjs/programs/stakePool/accounts'
import { useQuery } from 'react-query'
import { useWalletId } from './useWalletId'
import { TokenListData, useTokenList } from './useTokenList'

export type AllowedTokenData = BaseTokenData & {
  metadata?: any
  stakeEntry?: AccountData<StakeEntryData>
  amountToStake?: string
}

export type BaseTokenData = {
  tokenAccount?: {
    pubkey: PublicKey
    account: AccountInfo<ParsedAccountData>
  }
  metaplexData?: { pubkey: PublicKey; data: metaplex.MetadataData } | null
  tokenListData?: TokenListData
}

export const allowedTokensForPool = (
  tokenDatas: BaseTokenData[],
  stakePool: AccountData<StakePoolData>,
  stakeAuthorizations?: AccountData<StakeAuthorizationData>[],
  allowFrozen?: boolean
) =>
  tokenDatas.filter((token) => {
    let isAllowed = true
    const creatorAddresses = stakePool.parsed.requiresCreators
    const collectionAddresses = stakePool.parsed.requiresCollections
    const requiresAuthorization = stakePool.parsed.requiresAuthorization
    if (
      !allowFrozen &&
      token.tokenAccount?.account.data.parsed.info.state === 'frozen'
    ) {
      return false
    }

    if (
      stakePool.parsed.requiresCreators.length > 0 ||
      stakePool.parsed.requiresCollections.length > 0 ||
      stakePool.parsed.requiresAuthorization
    ) {
      isAllowed = false
      if (creatorAddresses && creatorAddresses.length > 0) {
        creatorAddresses.forEach((filterCreator) => {
          if (
            token?.metaplexData?.data?.data?.creators &&
            (token?.metaplexData?.data?.data?.creators).some(
              (c) => c.address === filterCreator.toString() && c.verified
            )
          ) {
            isAllowed = true
          }
        })
      }

      if (collectionAddresses && collectionAddresses.length > 0 && !isAllowed) {
        collectionAddresses.forEach((collectionAddress) => {
          if (
            token.metaplexData?.data?.collection?.verified &&
            token.metaplexData?.data?.collection?.key.toString() ===
              collectionAddress.toString()
          ) {
            isAllowed = true
          }
        })
      }
      if (
        requiresAuthorization &&
        stakeAuthorizations
          ?.map((s) => s.parsed.mint.toString())
          ?.includes(token?.tokenAccount?.account.data.parsed.info.mint)
      ) {
        isAllowed = true
      }
    }
    return isAllowed
  })

export const useAllowedTokenDatas = (showFungibleTokens: boolean) => {
  const stakePoolId = useStakePoolId()
  const walletId = useWalletId()
  const { connection } = useEnvironmentCtx()
  const { data: tokenList } = useTokenList()
  const { data: stakePool } = useStakePoolData()
  const { data: stakeAuthorizations } = useStakeAuthorizationsForPool()
  return useQuery<AllowedTokenData[] | undefined>(
    ['allowedTokenDatas', stakePoolId, showFungibleTokens, tokenList?.length],
    async () => {
      if (!stakePoolId || !stakePool || !walletId) return

      const allTokenAccounts = await connection.getParsedTokenAccountsByOwner(
        walletId!,
        {
          programId: spl.TOKEN_PROGRAM_ID,
        }
      )

      const tokenAccounts = allTokenAccounts.value
        .filter(
          (tokenAccount) =>
            tokenAccount.account.data.parsed.info.tokenAmount.uiAmount > 0
        )
        .sort((a, b) => a.pubkey.toBase58().localeCompare(b.pubkey.toBase58()))

      const metaplexIds = await Promise.all(
        tokenAccounts.map(
          async (tokenAccount) =>
            (
              await metaplex.MetadataProgram.findMetadataAccount(
                new PublicKey(tokenAccount.account.data.parsed.info.mint)
              )
            )[0]
        )
      )
      const metaplexAccountInfos = await getBatchedMultipleAccounts(
        connection,
        metaplexIds
      )
      const metaplexData = metaplexAccountInfos.reduce(
        (acc, accountInfo, i) => {
          try {
            acc[tokenAccounts[i]!.pubkey.toString()] = {
              pubkey: metaplexIds[i]!,
              ...accountInfo,
              data: metaplex.MetadataData.deserialize(
                accountInfo?.data as Buffer
              ) as metaplex.MetadataData,
            }
          } catch (e) {}
          return acc
        },
        {} as {
          [tokenAccountId: string]: {
            pubkey: PublicKey
            data: metaplex.MetadataData
          }
        }
      )

      const baseTokenDatas = tokenAccounts.map((tokenAccount, i) => ({
        tokenAccount,
        metaplexData: metaplexData[tokenAccount.pubkey.toString()],
        tokenListData: tokenList?.find(
          (t) =>
            t.address === tokenAccount?.account.data.parsed.info.mint.toString()
        ),
      }))

      const allowedTokens = allowedTokensForPool(
        baseTokenDatas,
        stakePool,
        stakeAuthorizations
      ).filter((tokenData) => showFungibleTokens === !!tokenData.tokenListData)

      const stakeEntryIds = await Promise.all(
        allowedTokens.map(
          async (allowedToken) =>
            (
              await findStakeEntryIdFromMint(
                connection,
                walletId!,
                stakePoolId,
                new PublicKey(
                  allowedToken.tokenAccount?.account.data.parsed.info.mint
                )
              )
            )[0]
        )
      )
      const stakeEntries =
        stakeEntryIds.length > 0
          ? await getStakeEntries(connection, stakeEntryIds)
          : []

      const metadata = await Promise.all(
        allowedTokens.map(async (allowedToken) => {
          try {
            if (!allowedToken.metaplexData?.data.data.uri) return null
            const json = await fetch(
              allowedToken.metaplexData.data.data.uri
            ).then((r) => r.json())
            return {
              pubkey: allowedToken.metaplexData.pubkey,
              data: json,
            }
          } catch (e) {
            return null
          }
        })
      )

      return allowedTokens.map((allowedToken, i) => ({
        ...allowedToken,
        metadata: metadata.find((data) =>
          data
            ? data.pubkey.toBase58() ===
              allowedToken.metaplexData?.pubkey.toBase58()
            : undefined
        ),
        stakeEntryData: stakeEntries[i],
      }))
    },
    {
      refetchInterval: 30000,
      enabled: !!stakePoolId && !!walletId,
    }
  )
}
