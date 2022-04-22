import { useDataHook } from './useDataHook'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useStakePoolId } from './useStakePoolId'
import { findRewardDistributorId } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/pda'
import { getRewardDistributor } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/accounts'
import { AccountData } from '@cardinal/common'
import { RewardDistributorData } from '@cardinal/staking/dist/cjs/programs/rewardDistributor'

export const useRewardDistributorData = () => {
  const stakePoolId = useStakePoolId()
  const { connection } = useEnvironmentCtx()
  return useDataHook<AccountData<RewardDistributorData> | undefined>(
    async () => {
      if (!stakePoolId) return
      const [rewardDistributorId] = await findRewardDistributorId(stakePoolId)
      return await getRewardDistributor(connection, rewardDistributorId)
    },
    [stakePoolId?.toString()],
    { name: 'rewardDistributor' }
  )
}
