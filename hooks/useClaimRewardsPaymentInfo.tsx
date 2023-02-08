import { fetchIdlAccount } from '@cardinal/rewards-center'
import { useQuery } from '@tanstack/react-query'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { useTokenList } from 'hooks/useTokenList'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'

export const useClaimRewardsPaymentInfo = () => {
  const { data: rewardDistributorData } = useRewardDistributorData()
  const { connection } = useEnvironmentCtx()
  const tokenList = useTokenList()

  return useQuery(['useClaimRewardsPaymentInfo', tokenList.data], async () => {
    if (!rewardDistributorData?.parsed) return null
    const claimRewardsPaymentInfo = await fetchIdlAccount(
      connection,
      rewardDistributorData?.parsed.claimRewardsPaymentInfo,
      'paymentInfo'
    )

    if (!claimRewardsPaymentInfo?.parsed) return null
    return claimRewardsPaymentInfo
  })
}
