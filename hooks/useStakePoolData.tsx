import { AccountData } from '@cardinal/common'
import { StakePoolData } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { useDataHook } from './useDataHook'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useStakePoolId } from './useStakePoolId'
import { getStakePool } from '@cardinal/staking/dist/cjs/programs/stakePool/accounts'

export const useStakePoolData = () => {
  const stakePoolId = useStakePoolId()
  const { connection } = useEnvironmentCtx()
  return useDataHook<AccountData<StakePoolData> | undefined>(
    async () => {
      if (!stakePoolId) return
      return getStakePool(connection, stakePoolId)
    },
    [stakePoolId?.toString()],
    { name: 'stakePoolData' }
  )
}
