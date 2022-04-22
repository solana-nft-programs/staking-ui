import { useDataHook } from './useDataHook'
import { useRewardDistributorData } from './useRewardDistributorData'
import { useStakedTokenDatas } from './useStakedTokenDatas'
import { BN } from '@project-serum/anchor'
import { useRewardDistributorTokenAccount } from './useRewardDistributorTokenAccount'
import { useUTCNow } from 'providers/UTCNowProvider'
import { useRewardEntries } from './useRewardEntries'
import { calculatePendingRewards, getRewardMap } from '@cardinal/staking'

export const useRewards = () => {
  const { data: rewardDistributorData } = useRewardDistributorData()
  const { data: rewardDistributorTokenAccount } =
    useRewardDistributorTokenAccount()
  const { data: stakedTokenDatas } = useStakedTokenDatas()
  const { data: rewardEntries } = useRewardEntries()
  const { UTCNow } = useUTCNow()
  return useDataHook<{
    rewardMap: { [mintId: string]: { claimableRewards: BN; nextRewardsIn: BN } }
    claimableRewards: BN
  }>(
    async () => {
      const rewardMap: {
        [mintId: string]: { claimableRewards: BN; nextRewardsIn: BN }
      } = {}
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
      const mintIds = stakeEntries.map((entry) => entry.parsed.originalMint)

      // return getRewardMap(
      //   mintIds,
      //   stakeEntries,
      //   rewardEntries,
      //   rewardDistributorData,
      //   rewardDistributorTokenAccount.amount
      // )
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
            rewardDistributorData,
            stakeEntry,
            rewardEntry,
            rewardDistributorTokenAccount.amount,
            UTCNow
          )
          rewardMap[mintId.toString()] = {
            claimableRewards,
            nextRewardsIn,
          }
        }
      }

      // Compute too many rewards
      let claimableRewards = Object.values(rewardMap).reduce(
        (acc, { claimableRewards }) => acc.add(claimableRewards),
        new BN(0)
      )
      if (
        rewardDistributorData.parsed.maxSupply &&
        rewardDistributorData.parsed.rewardsIssued
          .add(claimableRewards)
          .gte(rewardDistributorData.parsed.maxSupply)
      ) {
        claimableRewards = rewardDistributorData.parsed.maxSupply.sub(
          rewardDistributorData.parsed.rewardsIssued
        )
      }

      if (claimableRewards > rewardDistributorTokenAccount.amount) {
        claimableRewards = rewardDistributorTokenAccount.amount
      }

      return { rewardMap, claimableRewards: new BN(0) }
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
