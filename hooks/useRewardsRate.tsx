import { calculatePendingRewards } from '@cardinal/staking'
import { RewardDistributorKind } from '@cardinal/staking/dist/cjs/programs/rewardDistributor'
import { BN } from '@project-serum/anchor'
import { useQuery } from 'react-query'

import { useRewardDistributorData } from './useRewardDistributorData'
import { useRewardDistributorTokenAccount } from './useRewardDistributorTokenAccount'
import { useRewardEntries } from './useRewardEntries'
import { useRewardMintInfo } from './useRewardMintInfo'
import { useStakedTokenDatas } from './useStakedTokenDatas'

export const useRewardsRate = () => {
  const { data: rewardDistributorData } = useRewardDistributorData()
  const { data: stakedTokenData } = useStakedTokenDatas()
  const { data: rewardEntries } = useRewardEntries()
  const { data: rewardMintInfoData } = useRewardMintInfo()
  const { data: rewardDistributorTokenAccount } =
    useRewardDistributorTokenAccount()
  const { data: rewardMintInfo } = useRewardMintInfo()

  return useQuery<
    | {
        dailyRewards: BN
        rewardsRateMap: {
          [stakeEntryId: string]: { dailyRewards: BN }
        }
      }
    | undefined
  >(
    [
      'useRewardsRate',
      rewardDistributorData?.pubkey?.toString(),
      stakedTokenData?.map((s) => s.stakeEntry?.pubkey.toString()),
      rewardEntries?.map((r) => r.pubkey.toString()),
      rewardMintInfoData?.mintInfo.decimals,
      rewardDistributorTokenAccount?.address.toString(),
    ],
    async () => {
      const rewardDistibutorId = rewardDistributorData?.pubkey
      if (
        !rewardDistributorData ||
        !rewardEntries ||
        !rewardDistibutorId ||
        !rewardMintInfoData ||
        !rewardMintInfo ||
        !stakedTokenData ||
        !rewardDistributorTokenAccount
      ) {
        return undefined
      }

      const rewardsRateMap: {
        [stakeEntryId: string]: { dailyRewards: BN }
      } = {}
      let totalDaily = new BN(0)
      for (let i = 0; i < stakedTokenData.length; i++) {
        const stakeEntry = stakedTokenData[i]!.stakeEntry
        if (stakeEntry) {
          const rewardEntry = rewardEntries.find((rewardEntry) =>
            rewardEntry?.parsed?.stakeEntry.equals(stakeEntry?.pubkey)
          )
          const [claimableRewards] = calculatePendingRewards(
            rewardDistributorData,
            stakeEntry,
            rewardEntry,
            rewardDistributorData.parsed.kind === RewardDistributorKind.Mint
              ? rewardMintInfo?.mintInfo.supply
              : rewardDistributorTokenAccount.amount,
            stakeEntry.parsed.lastStakedAt.add(new BN(86400)).toNumber()
          )
          rewardsRateMap[stakeEntry.pubkey.toString()] = {
            dailyRewards: claimableRewards,
          }
          totalDaily = totalDaily.add(claimableRewards)
        }
      }
      return {
        rewardsRateMap,
        dailyRewards: totalDaily.eq(new BN(0))
          ? rewardDistributorData.parsed.rewardAmount.mul(
              rewardDistributorData.parsed.maxRewardSecondsReceived
                ? BN.min(
                    rewardDistributorData.parsed.maxRewardSecondsReceived,
                    new BN(86400).div(
                      rewardDistributorData.parsed.rewardDurationSeconds
                    )
                  )
                : new BN(86400).div(
                    rewardDistributorData.parsed.rewardDurationSeconds
                  )
            )
          : totalDaily,
      }
    }
  )
}
