import { fetchIdlAccount } from '@cardinal/rewards-center'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { useTokenList } from 'hooks/useTokenList'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useQuery } from 'react-query'

export const useClaimRewardsPaymentInfo = () => {
  const { data: rewardDistributorData } = useRewardDistributorData()
  const { connection } = useEnvironmentCtx()
  const tokenList = useTokenList()

  return useQuery<any | undefined>(
    ['useClaimRewardsPaymentInfo', tokenList.data],
    async () => {
      if (!rewardDistributorData?.parsed) return
      const claimRewardsPaymentInfo = await fetchIdlAccount(
        connection,
        rewardDistributorData?.parsed.claimRewardsPaymentInfo,
        'paymentInfo'
      )

      if (!claimRewardsPaymentInfo?.parsed) return

      return claimRewardsPaymentInfo
    }
  )
}
