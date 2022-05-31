import { AccountData } from '@cardinal/common'
import { StakePoolData } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useStakePoolId } from './useStakePoolId'
import { getStakePool } from '@cardinal/staking/dist/cjs/programs/stakePool/accounts'
import { useQuery } from 'react-query'

export const useStakePoolData = () => {
  const stakePoolId = useStakePoolId()
  const { connection } = useEnvironmentCtx()

  return useQuery<AccountData<StakePoolData> | undefined>(
    ['stakePoolData', stakePoolId?.toString()],
    async () => {
      if (!stakePoolId) return
      return getStakePool(connection, stakePoolId)
    },
    {
      enabled: !!stakePoolId,
    }
  )
}
