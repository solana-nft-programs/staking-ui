import type { AccountData } from '@cardinal/common'
import { findMintMetadataId, findTokenRecordId } from '@cardinal/common'
import { findMintManagerId } from '@cardinal/creator-standard'
import { MintManager } from '@cardinal/creator-standard/dist/cjs/generated'
import type { IdlAccountData } from '@cardinal/rewards-center'
import { fetchIdlAccountDataById } from '@cardinal/rewards-center'
import * as metaplex from '@metaplex-foundation/mpl-token-metadata'
import type { AccountInfo } from '@solana/web3.js'
import { PublicKey } from '@solana/web3.js'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useQuery } from '@tanstack/react-query'

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
  metaplexData?: {
    pubkey: PublicKey
    data: metaplex.Metadata
    tokenRecord?: metaplex.TokenRecord
  } | null
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
  >[]
) =>
  tokenDatas.filter((token) => {
    let isAllowed = true
    if (!stakePool.parsed) throw 'Stake pool data are unknown'
    if (!token?.tokenAccount?.parsed) throw 'No token account found'
    const creatorAddresses = stakePool.parsed.allowedCreators
    const collectionAddresses = stakePool.parsed.allowedCollections
    const requiresAuthorization = stakePool.parsed.requiresAuthorization

    if (
      (token.metaplexData?.data.programmableConfig &&
        token.metaplexData.tokenRecord?.delegate) ||
      (token.mintManagerData && token.mintManagerData.data.inUseBy)
    ) {
      return false
    }

    if (
      !token.mintManagerData &&
      !token.metaplexData?.data.programmableConfig &&
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
              (c) =>
                c.address.toString() === filterCreator.toString() && c.verified
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
  const { data: stakePoolId } = useStakePoolId()
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
      allTokenAccounts.data?.map((tk) => JSON.stringify(tk)).join(','),
      tokenList.data?.length,
      stakeAuthorizations.data?.length ?? 0,
    ],
    async () => {
      if (!stakePoolId || !stakePool.data || !walletId) return

      const tokenAccounts = allTokenAccounts.data ?? []
      const accountDataById = await fetchIdlAccountDataById(connection, [
        ...tokenAccounts.map((tokenAccount) =>
          findMintMetadataId(new PublicKey(tokenAccount.parsed.mint))
        ),
        ...tokenAccounts.map((acc) =>
          findTokenRecordId(new PublicKey(acc.parsed.mint), acc.pubkey)
        ),
        ...tokenAccounts.map((acc) =>
          findMintManagerId(new PublicKey(acc.parsed.mint))
        ),
      ])

      const metaplexData = tokenAccounts.reduce(
        (acc, tka, i) => {
          const metadataId = findMintMetadataId(new PublicKey(tka.parsed.mint))
          const tokenRecordId = findTokenRecordId(
            new PublicKey(tka.parsed.mint),
            tka.pubkey
          )
          const metadataInfo = accountDataById[metadataId.toString()]
          const tokenRecordInfo = accountDataById[tokenRecordId.toString()]
          try {
            if (metadataInfo) {
              acc[tokenAccounts[i]!.pubkey.toString()] = {
                pubkey: metadataId,
                ...metadataInfo.data,
                data: metaplex.Metadata.deserialize(metadataInfo.data)[0],
                tokenRecord: tokenRecordInfo
                  ? metaplex.TokenRecord.fromAccountInfo(tokenRecordInfo)[0]
                  : undefined,
              }
            }
          } catch (e) {}
          return acc
        },
        {} as {
          [tokenAccountId: string]: {
            pubkey: PublicKey
            data: metaplex.Metadata
            tokenRecord?: metaplex.TokenRecord
          }
        }
      )

      const mintManagerData = tokenAccounts.reduce(
        (acc, tka, i) => {
          const mintManagerId = findMintManagerId(
            new PublicKey(tka.parsed.mint)
          )
          const mintManagerInfo = accountDataById[mintManagerId.toString()]
          try {
            acc[tokenAccounts[i]!.pubkey.toString()] = {
              pubkey: mintManagerId,
              ...mintManagerInfo?.data,
              data: MintManager.fromAccountInfo(
                mintManagerInfo as AccountInfo<Buffer>
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
