import { useDataHook } from './useDataHook'
import { useRewardDistributorData } from './useRewardDistributorData'
import { useStakedTokenDatas } from './useStakedTokenDatas'
import { BN } from '@project-serum/anchor'
import { useRewardDistributorTokenAccount } from './useRewardDistributorTokenAccount'
import { useUTCNow } from 'providers/UTCNowProvider'
import { useRewardEntries } from './useRewardEntries'
import { getRewardMap } from '@cardinal/staking'

export const useRewards = () => {
  const { data: rewardDistributorData } = useRewardDistributorData()
  const { data: rewardDistributorTokenAccount } =
    useRewardDistributorTokenAccount()
  const { data: stakedTokenDatas } = useStakedTokenDatas()
  const { data: rewardEntries } = useRewardEntries()
  const { UTCNow } = useUTCNow()

  return useDataHook<{
    rewardMap: {
      [stakeEntryId: string]: { claimableRewards: BN; nextRewardsIn: BN }
    }
    claimableRewards: BN
  }>(
    async () => {
      if (
        !(
          stakedTokenDatas &&
          rewardEntries &&
          rewardDistributorTokenAccount &&
          rewardDistributorData
        )
      ) {
        return
      }

      const stakeEntries = stakedTokenDatas
        .filter((tk) => tk && tk.stakeEntry)
        .map((tk) => tk.stakeEntry!)

      return getRewardMap(
        stakeEntries,
        rewardEntries,
        rewardDistributorData,
        rewardDistributorTokenAccount.amount,
        UTCNow
      )
    },
    [
      rewardDistributorData?.pubkey?.toString(),
      rewardEntries,
      stakedTokenDatas,
      UTCNow,
    ],
    { name: 'rewardMap' }
  )
}
