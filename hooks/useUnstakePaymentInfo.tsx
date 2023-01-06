import { fetchIdlAccount } from '@cardinal/rewards-center'
import type { BN } from '@project-serum/anchor'
import { formatMintNaturalAmountAsDecimal } from 'common/units'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { useRewardMintInfo } from 'hooks/useRewardMintInfo'
import { useStakePoolData } from 'hooks/useStakePoolData'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useQuery } from 'react-query'

export const useUnstakePaymentInfo = () => {
  const { data: rewardDistributorData } = useRewardDistributorData()

  const { connection } = useEnvironmentCtx()
  const rewardMintInfo = useRewardMintInfo()
  const { data: stakePoolData } = useStakePoolData()

  return useQuery<
    | {
        naturalAmount: BN
        amount: string
        formattedAmountWithSymbol: string
      }
    | undefined
  >(
    [
      'useUnstakePaymentInfo',
      rewardMintInfo?.data?.mintInfo.address.toString(),
    ],
    async () => {
      if (!rewardDistributorData?.parsed || !rewardMintInfo?.data) return
      if (!stakePoolData) throw 'No stake pool found'
      const paymentInfoData = await fetchIdlAccount(
        connection,
        stakePoolData.parsed.unstakePaymentInfo,
        'paymentInfo'
      )

      if (!paymentInfoData?.parsed) return

      const amount = formatMintNaturalAmountAsDecimal(
        rewardMintInfo.data.mintInfo,
        paymentInfoData.parsed.paymentAmount,
        rewardMintInfo.data.mintInfo.decimals
      )

      return {
        naturalAmount: paymentInfoData.parsed.paymentAmount,
        amount,
        formattedAmountWithSymbol: `${Number(amount)} ${
          rewardMintInfo.data.tokenListData?.symbol
        }`,
      }
    }
  )
}
