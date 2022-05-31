import { useStakePoolId } from './useStakePoolId'
import { useStakePoolData } from './useStakePoolData'
import { useStakeAuthorizationsForPool } from './useStakeAuthorizationsForPool'
import { AccountData } from '@cardinal/common'
import {
  StakeAuthorizationData,
  StakeEntryData,
  StakePoolData,
} from '@cardinal/staking/dist/cjs/programs/stakePool'
import { UserTokenData, useUserTokenDatas } from './useUserTokenDatas'
import { findStakeEntryIdFromMint } from '@cardinal/staking/dist/cjs/programs/stakePool/utils'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { getStakeEntries } from '@cardinal/staking/dist/cjs/programs/stakePool/accounts'
import { useQuery } from 'react-query'

export type AllowedTokenData = UserTokenData & {
  metadata?: any
  stakeEntry?: AccountData<StakeEntryData>
  amountToStake?: string
}

export const allowedTokensForPool = (
  tokenDatas: UserTokenData[],
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
  const wallet = useWallet()
  const { connection } = useEnvironmentCtx()
  const { data: stakePool } = useStakePoolData()
  const { data: stakeAuthorizations } = useStakeAuthorizationsForPool()
  const userTokenDatas = useUserTokenDatas()
  return useQuery<AllowedTokenData[] | undefined>(
    ['allowedTokenDatas', stakePoolId, showFungibleTokens],
    async () => {
      if (
        !stakePoolId ||
        !stakePool ||
        !userTokenDatas.data ||
        !wallet.publicKey
      )
        return

      await userTokenDatas.refetch()

      const allowedTokens = allowedTokensForPool(
        userTokenDatas.data,
        stakePool,
        stakeAuthorizations
      ).filter((tokenData) => showFungibleTokens === !!tokenData.tokenListData)

      const stakeEntryIds = await Promise.all(
        allowedTokens.map(
          async (allowedToken) =>
            (
              await findStakeEntryIdFromMint(
                connection,
                wallet.publicKey!,
                stakePoolId,
                new PublicKey(
                  allowedToken.tokenAccount?.account.data.parsed.info.mint
                )
              )
            )[0]
        )
      )
      const stakeEntries = await getStakeEntries(connection, stakeEntryIds)

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
      refetchInterval: 10000,
      enabled: !!stakePoolId && !!userTokenDatas.data && !!wallet.publicKey,
    }
  )
}
