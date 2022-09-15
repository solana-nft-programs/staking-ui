import type { AccountData } from '@cardinal/common'
import type { RewardDistributorData } from '@cardinal/staking/dist/cjs/programs/rewardDistributor'
import { getRewardDistributor } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/accounts'
import { findRewardDistributorId } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/pda'
import { REWARD_QUERY_KEY } from 'handlers/useHandleClaimRewards'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useQuery } from 'react-query'

import { useStakePoolId } from './useStakePoolId'

export const useRewardDistributorData = () => {
  const stakePoolId = useStakePoolId()
  const { secondaryConnection } = useEnvironmentCtx()
  return useQuery<AccountData<RewardDistributorData> | undefined>(
    [REWARD_QUERY_KEY, 'useRewardDistributorData', stakePoolId?.toString()],
    async () => {
      if (!stakePoolId) return
      const [rewardDistributorId] = await findRewardDistributorId(stakePoolId)
      return await getRewardDistributor(
        secondaryConnection,
        rewardDistributorId
      )
    },
    { enabled: !!stakePoolId }
  )
}
