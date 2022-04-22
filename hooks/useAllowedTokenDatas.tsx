import { useDataHook } from './useDataHook'
import { useStakePoolId } from './useStakePoolId'
import { useUserTokenData } from 'providers/TokenDataProvider'
import { useStakePoolData } from './useStakePoolData'
import { TokenData } from 'api/types'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'

export const useAllowedTokenDatas = (showFungibleTokens: boolean) => {
  const stakePoolId = useStakePoolId()
  const { environment } = useEnvironmentCtx()
  const { data: stakePool } = useStakePoolData()
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
        if (token.tokenAccount?.account.data.parsed.info.state === 'frozen') {
          return false
        }

        if (creatorAddresses && creatorAddresses.length > 0) {
          isAllowed = false
          creatorAddresses.forEach((filterCreator) => {
            if (
              token?.metaplexData?.data?.data?.creators &&
              (token?.metaplexData?.data?.data?.creators).some(
                (c) =>
                  c.address === filterCreator.toString() &&
                  (c.verified || environment.label == 'devnet')
              )
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

        if (token.stakeAuthorization) {
          isAllowed = true
        }
        return isAllowed
      })

      return filteredTokens
    },
    [stakePool, showFungibleTokens],
    { name: 'allowedTokenDatas' }
  )
}
