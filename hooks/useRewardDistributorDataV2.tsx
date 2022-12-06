import type { IdlAccountData } from '@cardinal/rewards-center'
import {
  fetchIdlAccount,
  findRewardDistributorId,
} from '@cardinal/rewards-center'
import { REWARD_QUERY_KEY } from 'handlers/useHandleClaimRewards'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useQuery } from 'react-query'

import { useStakePoolId } from './useStakePoolId'

export const useRewardDistributorDataV2 = () => {
  const stakePoolId = useStakePoolId()
  const { secondaryConnection } = useEnvironmentCtx()
  return useQuery<
    Pick<IdlAccountData<'rewardDistributor'>, 'pubkey' | 'parsed'> | undefined
  >(
    [REWARD_QUERY_KEY, 'useRewardDistributorDataV2', stakePoolId?.toString()],
    async () => {
      if (!stakePoolId) return
      const rewardDistributorId = findRewardDistributorId(stakePoolId)
      try {
        return await fetchIdlAccount(
          secondaryConnection,
          rewardDistributorId,
          'rewardDistributor'
        )
      } catch (e) {
        return
      }
    },
    { enabled: !!stakePoolId }
  )
}
