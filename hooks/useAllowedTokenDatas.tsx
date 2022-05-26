import { useDataHook } from './useDataHook'
import { useStakePoolId } from './useStakePoolId'
import { useUserTokenData } from 'providers/TokenDataProvider'
import { useStakePoolData } from './useStakePoolData'
import { TokenData } from 'api/types'
import { useStakeAuthorizationsForPool } from './useStakeAuthorizationsForPool'
import { AccountData } from '@cardinal/common'
import {
  StakeAuthorizationData,
  StakePoolData,
} from '@cardinal/staking/dist/cjs/programs/stakePool'

export const allowedTokensForPool = (
  tokenDatas: TokenData[],
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
  const { data: stakePool } = useStakePoolData()
  const { data: stakeAuthorizations } = useStakeAuthorizationsForPool()
  const { tokenDatas } = useUserTokenData()
  return useDataHook<TokenData[] | undefined>(
    async () => {
      if (!stakePoolId || !stakePool) return
      return allowedTokensForPool(
        tokenDatas,
        stakePool,
        stakeAuthorizations
      ).filter(
        (tokenData) => showFungibleTokens !== Boolean(tokenData.tokenListData)
      )
    },
    [stakePool, showFungibleTokens, tokenDatas],
    { name: 'allowedTokenDatas' }
  )
}
