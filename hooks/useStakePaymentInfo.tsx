import { fetchIdlAccount } from '@cardinal/rewards-center'
import { formatMintNaturalAmountAsDecimal } from 'common/units'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { useRewardMintInfo } from 'hooks/useRewardMintInfo'
import { useStakePoolData } from 'hooks/useStakePoolData'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useQuery } from 'react-query'

// export type StakePoolPaymentInfo = {
//   paymentAmount: number,
// }

export const useStakePaymentInfo = () => {
  const { data: rewardDistributorData } = useRewardDistributorData()
  const { data: stakePoolData } = useStakePoolData()

  const { connection } = useEnvironmentCtx()
  const rewardMintInfo = useRewardMintInfo()

  return useQuery<
    | {
        amount: string
      }
    | undefined
  >(['useStakePaymentInfo', stakePoolData?.pubkey?.toString()], async () => {
    if (!rewardDistributorData?.parsed || !rewardMintInfo?.data) return
    const paymentInfoData = await fetchIdlAccount(
      connection,
      rewardDistributorData?.parsed.claimRewardsPaymentInfo,
      'paymentInfo'
    )

    console.log('useStakePaymentInfo 2')

    if (!paymentInfoData?.parsed) return

    console.log('useStakePaymentInfo 3')

    const formattedAmount = formatMintNaturalAmountAsDecimal(
      rewardMintInfo.data.mintInfo,
      paymentInfoData.parsed.paymentAmount,
      9
    )

    console.log('useStakePaymentInfo 4')

    return {
      amount: formattedAmount,
    }
  })
}
