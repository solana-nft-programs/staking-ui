import { getRewardMap } from '@cardinal/staking'
import { RewardDistributorKind } from '@cardinal/staking/dist/cjs/programs/rewardDistributor'
import { BN } from '@project-serum/anchor'
import { rewardEntryDataToV1 } from 'api/fetchRewardEntry'
import { stakeEntryDataToV1 } from 'api/fetchStakeEntry'
import { useUTCNow } from 'providers/UTCNowProvider'
import { useQuery } from 'react-query'

import {
  rewardDistributorDataToV1,
  useRewardDistributorData,
} from './useRewardDistributorData'
import { useRewardDistributorTokenAccount } from './useRewardDistributorTokenAccount'
import { useRewardEntries } from './useRewardEntries'
import { useRewardMintInfo } from './useRewardMintInfo'
import { useStakedTokenDatas } from './useStakedTokenDatas'

export const useRewards = () => {
  const { data: rewardDistributorData } = useRewardDistributorData()
  const { data: rewardDistributorTokenAccount } =
    useRewardDistributorTokenAccount()
  const { data: stakedTokenDatas } = useStakedTokenDatas()
  const { data: rewardEntries } = useRewardEntries()
  const { data: rewardMintInfo } = useRewardMintInfo()
  const { UTCNow } = useUTCNow()

  return useQuery<
    | {
        rewardMap: {
          [stakeEntryId: string]: { claimableRewards: BN; nextRewardsIn: BN }
        }
        claimableRewards: BN
      }
    | undefined
  >(
    [
      'useRewards',
      rewardDistributorData?.pubkey?.toString(),
      rewardEntries?.map((r) => r.pubkey.toString()).join(','),
      stakedTokenDatas?.map((s) => s.stakeEntry?.pubkey.toString()).join(','),
      UTCNow,
    ],
    () => {
      if (
        !(
          stakedTokenDatas &&
          rewardEntries &&
          rewardDistributorData &&
          rewardDistributorTokenAccount &&
          rewardMintInfo &&
          (rewardDistributorData?.parsed?.kind === RewardDistributorKind.Mint ||
            !!rewardDistributorTokenAccount)
        )
      ) {
        return { rewardMap: {}, claimableRewards: new BN(0) }
      }

      const stakeEntries = stakedTokenDatas
        .filter((tk) => tk && tk.stakeEntry)
        .map((tk) => tk.stakeEntry!)

      return getRewardMap(
        stakeEntries.map((entry) => {
          return {
            pubkey: entry.pubkey,
            parsed: stakeEntryDataToV1(entry.parsed!),
          }
        }),
        rewardEntries.map((entry) => {
          return {
            pubkey: entry.pubkey,
            parsed: rewardEntryDataToV1(entry.parsed!),
          }
        }),
        rewardDistributorDataToV1(rewardDistributorData),
        rewardDistributorData.parsed?.kind === RewardDistributorKind.Mint
          ? new BN(rewardMintInfo?.mintInfo.supply.toString())
          : new BN(rewardDistributorTokenAccount.amount.toString()),
        UTCNow
      )
    },
    {
      keepPreviousData: true,
      enabled: !!stakedTokenDatas && !!rewardEntries && !!rewardDistributorData,
    }
  )
}
