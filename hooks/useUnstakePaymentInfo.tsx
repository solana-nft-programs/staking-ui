import { fetchIdlAccount } from '@cardinal/rewards-center'
import { useQuery } from '@tanstack/react-query'
import { useStakePoolData } from 'hooks/useStakePoolData'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'

export const useUnstakePaymentInfo = () => {
  const { connection } = useEnvironmentCtx()
  const { data: stakePoolData } = useStakePoolData()
  return useQuery(
    ['useUnstakePaymentInfo', stakePoolData?.pubkey.toString()],
    async () => {
      if (!stakePoolData) throw 'No stake pool found'
      const paymentInfoData = await fetchIdlAccount(
        connection,
        stakePoolData.parsed.unstakePaymentInfo,
        'paymentInfo'
      )
      if (!paymentInfoData?.parsed) return
      return paymentInfoData
    }
  )
}
