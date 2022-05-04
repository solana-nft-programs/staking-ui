import { useDataHook } from './useDataHook'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useStakePoolId } from './useStakePoolId'
import { useWalletId } from './useWalletId'
import { getStakeEntryDatas } from 'api/api'
import { useTokenList } from 'providers/TokenListProvider'
import { StakeEntryTokenData } from 'api/types'

export const useStakedTokenDatas = () => {
  const stakePoolId = useStakePoolId()
  const walletId = useWalletId()
  const { tokenList } = useTokenList()
  const { connection } = useEnvironmentCtx()
  return useDataHook<StakeEntryTokenData[] | undefined>(
    async () => {
      if (!stakePoolId || !walletId) return
      const tokenDatas = await getStakeEntryDatas(
        connection,
        stakePoolId,
        walletId
      )
      const hydratedTokenDatas = tokenDatas.reduce((acc, tokenData) => {
        let tokenListData
        try {
          tokenListData = tokenList.find(
            (t) =>
              t.address === tokenData.stakeEntry?.parsed.originalMint.toString()
          )
        } catch (e) {}

        if (tokenListData) {
          acc.push({
            ...tokenData,
            tokenListData: tokenListData,
          })
        } else if (tokenData.metadata) {
          acc.push({
            ...tokenData,
            tokenListData: undefined,
          })
        }
        return acc
      }, [] as StakeEntryTokenData[])

      return hydratedTokenDatas
    },
    [stakePoolId?.toString(), walletId?.toString(), tokenList],
    { name: 'stakedTokenDatas', refreshInterval: 10000 }
  )
}
