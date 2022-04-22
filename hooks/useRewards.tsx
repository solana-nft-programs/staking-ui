import { useDataHook } from './useDataHook'
import { useRewardDistributorData } from './useRewardDistributorData'
import { useStakedTokenDatas } from './useStakedTokenDatas'
import { BN } from '@project-serum/anchor'
import { useRewardDistributorTokenAccount } from './useRewardDistributorTokenAccount'
import { calculatePendingRewards } from 'api/utils'
import { useUTCNow } from 'providers/UTCNowProvider'
import { useRewardEntries } from './useRewardEntries'

export const useRewards = () => {
  const { data: rewardDistibutorData } = useRewardDistributorData()
  const { data: rewardDistibutorTokenAccount } =
    useRewardDistributorTokenAccount()
  const { data: stakedTokenDatas } = useStakedTokenDatas()
  const { data: rewardEntries } = useRewardEntries()
  const { UTCNow } = useUTCNow()
  return useDataHook<{
    [mintId: string]: { claimableRewards: BN; nextRewardsIn: BN }
  }>(
    async () => {
      const rewardMap: {
        [mintId: string]: { claimableRewards: BN; nextRewardsIn: BN }
      } = {}
      if (
        !(
          stakedTokenDatas &&
          rewardEntries &&
          rewardDistibutorTokenAccount &&
          rewardDistibutorData
        )
      ) {
        return
      }

      const stakeEntries = stakedTokenDatas
        .filter((tk) => tk && tk.stakeEntry)
        .map((tk) => tk.stakeEntry!)
      const mintIds = stakeEntries.map((entry) => entry.parsed.originalMint)

      for (let i = 0; i < mintIds.length; i++) {
        const mintId = mintIds[i]!
        const stakeEntry = stakeEntries.find((stakeEntry) =>
          stakeEntry.parsed.originalMint.equals(mintId)
        )
        const rewardEntry = rewardEntries.find((rewardEntry) =>
          rewardEntry.parsed.mint.equals(mintId)
        )

        if (mintId && stakeEntry && rewardEntry) {
          const [claimableRewards, nextRewardsIn] = calculatePendingRewards(
            rewardDistibutorData,
            stakeEntry,
            rewardEntry,
            rewardDistibutorTokenAccount.amount,
            UTCNow
          )
          rewardMap[mintId.toString()] = {
            claimableRewards,
            nextRewardsIn,
          }
        }
      }

      return rewardMap
    },
    [
      rewardDistibutorData?.pubkey?.toString(),
      rewardEntries,
      stakedTokenDatas,
      UTCNow,
    ],
    { name: 'rewardMap' }
  )
}
