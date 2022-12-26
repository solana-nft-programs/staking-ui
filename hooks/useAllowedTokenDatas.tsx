import type { AccountData } from '@cardinal/common'
import { getBatchedMultipleAccounts } from '@cardinal/common'
import { findMintManagerId } from '@cardinal/creator-standard'
import { MintManager } from '@cardinal/creator-standard/dist/cjs/generated'
import type { IdlAccountData } from '@cardinal/rewards-center'
import * as metaplex from '@metaplex-foundation/mpl-token-metadata'
import type { AccountInfo } from '@solana/web3.js'
import { PublicKey } from '@solana/web3.js'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useQuery } from 'react-query'

import { useStakeAuthorizationsForPool } from './useStakeAuthorizationsForPool'
import { useStakePoolData } from './useStakePoolData'
import { useStakePoolId } from './useStakePoolId'
import type { ParsedTokenAccountData } from './useTokenAccounts'
import { useTokenAccounts } from './useTokenAccounts'
import type { TokenListData } from './useTokenList'
import { useTokenList } from './useTokenList'
import { useWalletId } from './useWalletId'

export const TOKEN_DATAS_KEY = 'tokenDatas'

export type AllowedTokenData = {
  tokenAccount?: AccountData<ParsedTokenAccountData>
  metaplexData?: { pubkey: PublicKey; data: metaplex.MetadataData } | null
  mintManagerData?: { pubkey: PublicKey; data: MintManager } | null
  tokenListData?: TokenListData
  amountToStake?: string
}

export const allowedTokensForPool = (
  tokenDatas: AllowedTokenData[],
  stakePool: Pick<IdlAccountData<'stakePool'>, 'pubkey' | 'parsed'>,
  stakeAuthorizations?: Pick<
    IdlAccountData<'stakeAuthorizationRecord'>,
    'pubkey' | 'parsed'
  >[],
  allowFrozen?: boolean
) =>
  tokenDatas.filter((token) => {
    let isAllowed = true
    if (!stakePool.parsed) throw 'Stake pool data are unknown'
    if (!token?.tokenAccount?.parsed) throw 'No token account found'
    const creatorAddresses = stakePool.parsed.allowedCreators
    const collectionAddresses = stakePool.parsed.allowedCollections
    const requiresAuthorization = stakePool.parsed.requiresAuthorization

    if (token.mintManagerData && token.mintManagerData.data.inUseBy) {
      return false
    }

    if (
      !token.mintManagerData &&
      !allowFrozen &&
      token.tokenAccount?.parsed.state === 'frozen'
    ) {
      return false
    }

    if (
      stakePool.parsed.allowedCreators.length > 0 ||
      stakePool.parsed.allowedCollections.length > 0 ||
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
          ?.map((s) => s.parsed?.mint.toString())
          ?.includes(token?.tokenAccount?.parsed.mint)
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
  const tokenList = useTokenList()
  const stakePool = useStakePoolData()
  const stakeAuthorizations = useStakeAuthorizationsForPool()
  const allTokenAccounts = useTokenAccounts()
  return useQuery<AllowedTokenData[] | undefined>(
    [
      TOKEN_DATAS_KEY,
      'allowedTokenDatas',
      stakePool.data?.pubkey.toString(),
      walletId?.toString(),
      showFungibleTokens,
      tokenList.data?.length,
      stakeAuthorizations.data?.length ?? 0,
    ],
    async () => {
      if (!stakePoolId || !stakePool.data || !walletId) return

      const tokenAccounts = allTokenAccounts.data ?? []
      const metaplexIds = await Promise.all(
        tokenAccounts.map(
          async (tokenAccount) =>
            (
              await metaplex.MetadataProgram.findMetadataAccount(
                new PublicKey(tokenAccount.parsed.mint)
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

      const mintManagerInfos = await getBatchedMultipleAccounts(
        connection,
        tokenAccounts.map((tk) =>
          findMintManagerId(new PublicKey(tk.parsed.mint))
        )
      )
      const mintManagerData = mintManagerInfos.reduce(
        (acc, accountInfo, i) => {
          try {
            acc[tokenAccounts[i]!.pubkey.toString()] = {
              pubkey: metaplexIds[i]!,
              ...accountInfo,
              data: MintManager.fromAccountInfo(
                accountInfo as AccountInfo<Buffer>
              )[0],
            }
          } catch (e) {}
          return acc
        },
        {} as {
          [tokenAccountId: string]: {
            pubkey: PublicKey
            data: MintManager
          }
        }
      )

      const baseTokenDatas = tokenAccounts.map((tokenAccount, i) => ({
        tokenAccount,
        metaplexData: metaplexData[tokenAccount.pubkey.toString()],
        mintManagerData: mintManagerData[tokenAccount.pubkey.toString()],
        tokenListData: tokenList.data?.find(
          (t) => t.address === tokenAccount?.parsed.mint.toString()
        ),
      }))

      const allowedTokens = allowedTokensForPool(
        baseTokenDatas,
        stakePool.data,
        stakeAuthorizations.data
      ).filter(
        (tokenData) =>
          showFungibleTokens ===
          (!!tokenData.tokenListData ||
            ((tokenData.metaplexData?.data.tokenStandard ===
              metaplex.TokenStandard.Fungible ||
              tokenData.metaplexData?.data.tokenStandard ===
                metaplex.TokenStandard.FungibleAsset) &&
              !tokenData.mintManagerData))
      )

      return allowedTokens
    },
    {
      enabled:
        tokenList.isFetched &&
        allTokenAccounts.isFetched &&
        !!stakePool.data &&
        !!walletId,
    }
  )
}
