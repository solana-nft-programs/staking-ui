import type { IdlAccountData } from '@cardinal/rewards-center'
import { calculatePendingRewards } from '@cardinal/staking'
import { RewardDistributorKind } from '@cardinal/staking/dist/cjs/programs/rewardDistributor'
import { BN } from '@project-serum/anchor'
import { rewardEntryDataToV1 } from 'api/fetchRewardEntry'
import { stakeEntryDataToV1 } from 'api/fetchStakeEntry'
import { useQuery } from 'react-query'

import {
  isRewardDistributorV2,
  rewardDistributorDataToV1,
  rewardDistributorDataToV2,
  useRewardDistributorData,
} from './useRewardDistributorData'
import { useRewardDistributorTokenAccount } from './useRewardDistributorTokenAccount'
import { useRewardEntries } from './useRewardEntries'
import { useRewardMintInfo } from './useRewardMintInfo'
import { useStakedTokenDatas } from './useStakedTokenDatas'

export const baseDailyRate = (
  rewardDistributorData: Pick<
    IdlAccountData<'rewardDistributor'>,
    'pubkey' | 'parsed'
  >
) => {
  return (
    rewardDistributorData.parsed?.rewardAmount
      .mul(
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
      .mul(rewardDistributorData.parsed.defaultMultiplier)
      .div(
        new BN(10).pow(new BN(rewardDistributorData.parsed.multiplierDecimals))
      ) || new BN(0)
  )
}

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
        !rewardDistributorData.parsed ||
        !rewardEntries ||
        !rewardDistibutorId ||
        !rewardMintInfoData ||
        !rewardMintInfo ||
        !stakedTokenData
      ) {
        return undefined
      }

      const rewardsRateMap: {
        [stakeEntryId: string]: { dailyRewards: BN }
      } = {}
      let totalDaily = new BN(0)
      for (let i = 0; i < stakedTokenData.length; i++) {
        const stakeEntry = stakedTokenData[i]!.stakeEntry
        if (stakeEntry && stakeEntry.parsed) {
          const rewardEntry = rewardEntries.find((rewardEntry) =>
            rewardEntry?.parsed?.stakeEntry.equals(stakeEntry?.pubkey)
          )
          const [claimableRewards] = calculatePendingRewards(
            rewardDistributorDataToV1(rewardDistributorData),
            {
              pubkey: stakeEntry.pubkey,
              parsed: stakeEntryDataToV1(stakeEntry.parsed),
            },
            rewardEntry
              ? {
                  pubkey: rewardEntry.pubkey,
                  parsed: rewardEntryDataToV1(rewardEntry.parsed),
                }
              : undefined,
            isRewardDistributorV2(rewardDistributorData.parsed)
              ? new BN(rewardDistributorTokenAccount?.amount.toString() || 0)
              : rewardDistributorData.parsed?.kind ===
                RewardDistributorKind.Mint
              ? new BN(rewardMintInfo?.mintInfo.supply.toString())
              : new BN(rewardDistributorTokenAccount?.amount.toString() || 0),
            (stakeEntry.parsed.lastUpdatedAt ?? stakeEntry.parsed.lastStakedAt)
              .add(new BN(86400))
              .toNumber()
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
          ? baseDailyRate({
              pubkey: rewardDistributorData.pubkey,
              parsed: rewardDistributorDataToV2(rewardDistributorData.parsed),
            })
          : totalDaily,
      }
    }
  )
}
