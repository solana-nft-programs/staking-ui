import type { AccountData } from '@cardinal/common'
import type { RewardEntryData } from '@cardinal/staking/dist/cjs/programs/rewardDistributor'
import { getRewardEntries } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/accounts'
import { findRewardEntryId } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/pda'
import { REWARD_QUERY_KEY } from 'handlers/useHandleClaimRewards'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useQuery } from 'react-query'

import { useRewardDistributorData } from './useRewardDistributorData'
import { useStakedTokenDatas } from './useStakedTokenDatas'

export const useRewardEntries = () => {
  const { data: rewardDistibutorData } = useRewardDistributorData()
  const { data: stakedTokenDatas } = useStakedTokenDatas()
  const { secondaryConnection } = useEnvironmentCtx()
  return useQuery<AccountData<RewardEntryData>[] | undefined>(
    [
      REWARD_QUERY_KEY,
      'useRewardEntries',
      rewardDistibutorData?.pubkey?.toString(),
      stakedTokenDatas,
    ],
    async () => {
      const rewardDistibutorId = rewardDistibutorData?.pubkey
      if (!rewardDistibutorData || !stakedTokenDatas || !rewardDistibutorId) {
        return []
      }
      const stakeEntryIds = stakedTokenDatas
        .filter((tk) => tk && tk.stakeEntry)
        .map((tk) => tk.stakeEntry!)
        .map((entry) => entry.pubkey)

      const rewardEntryIds = await Promise.all(
        stakeEntryIds.map(
          async (stakeEntryId) =>
            (
              await findRewardEntryId(rewardDistibutorId, stakeEntryId)
            )[0]
        )
      )

      return (
        await getRewardEntries(secondaryConnection, rewardEntryIds)
      ).filter((rewardEntry) => rewardEntry.parsed)
    }
  )
}
