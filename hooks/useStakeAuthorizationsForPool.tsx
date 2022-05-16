import { AccountData } from '@cardinal/common'
import { StakeAuthorizationData } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { getStakeAuthorizationsForPool } from '@cardinal/staking/dist/cjs/programs/stakePool/accounts'
import { useDataHook } from './useDataHook'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useStakePoolId } from './useStakePoolId'

export const useStakeAuthorizationsForPool = () => {
  const { connection } = useEnvironmentCtx()
  const stakePoolId = useStakePoolId()
  return useDataHook<AccountData<StakeAuthorizationData>[] | undefined>(
    async () => {
      if (stakePoolId) {
        return getStakeAuthorizationsForPool(connection, stakePoolId)
      }
    },
    [stakePoolId?.toString()],
    { name: 'useStakeAuthorizationsForPool' }
  )
}
