import type { AccountData } from '@cardinal/common'
import type { StakeAuthorizationData } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { getStakeAuthorizationsForPool } from '@cardinal/staking/dist/cjs/programs/stakePool/accounts'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useQuery } from 'react-query'

import { useStakePoolId } from './useStakePoolId'

export const useStakeAuthorizationsForPool = () => {
  const { secondaryConnection } = useEnvironmentCtx()
  const stakePoolId = useStakePoolId()
  return useQuery<AccountData<StakeAuthorizationData>[] | undefined>(
    ['useStakeAuthorizationsForPool', stakePoolId?.toString()],
    async () => {
      if (stakePoolId) {
        return getStakeAuthorizationsForPool(secondaryConnection, stakePoolId)
      }
    },
    { enabled: !!stakePoolId }
  )
}
