import { useDataHook } from './useDataHook'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { AccountData } from '@cardinal/common'
import { useRewardDistributorData } from './useRewardDistributorData'
import { findRewardEntryId } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/pda'
import { useStakedTokenDatas } from './useStakedTokenDatas'
import { RewardEntryData } from '@cardinal/staking/dist/cjs/programs/rewardDistributor'
import { getRewardEntries } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/accounts'

export const useRewardEntries = () => {
  const { data: rewardDistibutorData } = useRewardDistributorData()
  const { data: stakedTokenDatas } = useStakedTokenDatas()
  const { connection } = useEnvironmentCtx()
  return useDataHook<AccountData<RewardEntryData>[]>(
    async () => {
      const rewardDistibutorId = rewardDistibutorData?.pubkey
      if (!rewardDistibutorData || !stakedTokenDatas || !rewardDistibutorId) {
        return
      }

      const stakeEntries = stakedTokenDatas
        .filter((tk) => tk && tk.stakeEntry)
        .map((tk) => tk.stakeEntry!)
      const mintIds = stakeEntries.map((entry) => entry.parsed.originalMint)

      const rewardEntryIds = await Promise.all(
        mintIds.map(
          async (mintId) =>
            (
              await findRewardEntryId(rewardDistibutorId, mintId)
            )[0]
        )
      )

      return getRewardEntries(connection, rewardEntryIds)
    },
    [rewardDistibutorData?.pubkey?.toString(), stakedTokenDatas],
    { name: 'rewardEntries' }
  )
}
