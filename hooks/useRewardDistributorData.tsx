import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useStakePoolId } from './useStakePoolId'
import { findRewardDistributorId } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/pda'
import { getRewardDistributor } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/accounts'
import { AccountData } from '@cardinal/common'
import { RewardDistributorData } from '@cardinal/staking/dist/cjs/programs/rewardDistributor'
import { useQuery } from 'react-query'

export const useRewardDistributorData = () => {
  const stakePoolId = useStakePoolId()
  const { secondaryConnection } = useEnvironmentCtx()
  return useQuery<AccountData<RewardDistributorData> | undefined>(
    ['useRewardDistributorData', stakePoolId?.toString()],
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
