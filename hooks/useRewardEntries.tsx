import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { AccountData } from '@cardinal/common'
import { useRewardDistributorData } from './useRewardDistributorData'
import { findRewardEntryId } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/pda'
import { useStakedTokenDatas } from './useStakedTokenDatas'
import { RewardEntryData } from '@cardinal/staking/dist/cjs/programs/rewardDistributor'
import { getRewardEntries } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/accounts'
import { useQuery } from 'react-query'

export const useRewardEntries = () => {
  const { data: rewardDistibutorData } = useRewardDistributorData()
  const { data: stakedTokenDatas } = useStakedTokenDatas()
  const { secondaryConnection } = useEnvironmentCtx()
  return useQuery<AccountData<RewardEntryData>[] | undefined>(
    [
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
