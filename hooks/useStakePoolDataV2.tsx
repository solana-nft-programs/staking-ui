import type { IdlAccountData } from '@cardinal/rewards-center'
import { fetchIdlAccount } from '@cardinal/rewards-center'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useQuery } from 'react-query'

import { useStakePoolId } from './useStakePoolId'

export const useStakePoolDataV2 = () => {
  const stakePoolId = useStakePoolId()
  const { secondaryConnection } = useEnvironmentCtx()

  return useQuery<
    Pick<IdlAccountData<'stakePool'>, 'pubkey' | 'parsed'> | undefined
  >(['stakePoolDataV2', stakePoolId?.toString()], async () => {
    if (!stakePoolId) return
    try {
      return await fetchIdlAccount(
        secondaryConnection,
        stakePoolId,
        'stakePool'
      )
    } catch (e) {
      return
    }
  })
}
