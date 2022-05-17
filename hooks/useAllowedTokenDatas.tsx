import { useDataHook } from './useDataHook'
import { useStakePoolId } from './useStakePoolId'
import { useUserTokenData } from 'providers/TokenDataProvider'
import { useStakePoolData } from './useStakePoolData'
import { TokenData } from 'api/types'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useStakeAuthorizationsForPool } from './useStakeAuthorizationsForPool'

export const useAllowedTokenDatas = (showFungibleTokens: boolean) => {
  const stakePoolId = useStakePoolId()
  const { environment } = useEnvironmentCtx()
  const { data: stakePool } = useStakePoolData()
  const { data: stakeAuthorizations } = useStakeAuthorizationsForPool()
  const authorizedMints = stakeAuthorizations?.map((s) =>
    s.parsed.mint.toString()
  )
  const { tokenDatas } = useUserTokenData()
  return useDataHook<TokenData[] | undefined>(
    async () => {
      if (!stakePoolId) return

      const filteredTokens = tokenDatas.filter((token) => {
        if (
          (showFungibleTokens && !token.tokenListData) ||
          (!showFungibleTokens && token.tokenListData) ||
          !stakePool
        ) {
          return false
        }
        let isAllowed = true
        const creatorAddresses = stakePool.parsed.requiresCreators
        const collectionAddresses = stakePool.parsed.requiresCollections
        const requiresAuthorization = stakePool.parsed.requiresAuthorization
        if (token.tokenAccount?.account.data.parsed.info.state === 'frozen') {
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
                environment.label == 'devnet' ||
                (token?.metaplexData?.data?.data?.creators &&
                  (token?.metaplexData?.data?.data?.creators).some(
                    (c) => c.address === filterCreator.toString() && c.verified
                  ))
              ) {
                isAllowed = true
              }
            })
          }

          if (
            collectionAddresses &&
            collectionAddresses.length > 0 &&
            !isAllowed
          ) {
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
            authorizedMints?.includes(
              token?.tokenAccount?.account.data.parsed.info.mint
            )
          ) {
            isAllowed = true
          }
        }
        return isAllowed
      })
      return filteredTokens
    },
    [stakePool, showFungibleTokens, tokenDatas],
    { name: 'allowedTokenDatas' }
  )
}
