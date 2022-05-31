import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useStakePoolId } from './useStakePoolId'
import { getStakeEntryDatas } from 'api/api'
import { useTokenList } from 'providers/TokenListProvider'
import { StakeEntryTokenData } from 'api/types'
import { useWalletIds } from './useWalletIds'
import { useQuery } from 'react-query'

export const useStakedTokenDatas = () => {
  const stakePoolId = useStakePoolId()
  const walletIds = useWalletIds()
  const { tokenList } = useTokenList()
  const { connection } = useEnvironmentCtx()
  return useQuery<StakeEntryTokenData[] | undefined>(
    [
      'stakedTokenDatas',
      stakePoolId?.toString(),
      walletIds.join(','),
      tokenList.length,
    ],
    async () => {
      if (!stakePoolId || !walletIds || walletIds.length <= 0) return
      const stakeEntryDataGroups = await Promise.all(
        walletIds.map((walletId) =>
          getStakeEntryDatas(connection, stakePoolId, walletId)
        )
      )
      const tokenDatas = stakeEntryDataGroups.flat()
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
    { refetchInterval: 10000 }
  )
}
