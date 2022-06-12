import { useRewardDistributorData } from './useRewardDistributorData'
import { useStakedTokenDatas } from './useStakedTokenDatas'
import { BN } from '@project-serum/anchor'
import { useRewardDistributorTokenAccount } from './useRewardDistributorTokenAccount'
import { useUTCNow } from 'providers/UTCNowProvider'
import { useRewardEntries } from './useRewardEntries'
import { getRewardMap } from '@cardinal/staking'
import { useQuery } from 'react-query'
import { useRewardMintInfo } from './useRewardMintInfo'
import { RewardDistributorKind } from '@cardinal/staking/dist/cjs/programs/rewardDistributor'

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
      rewardEntries,
      stakedTokenDatas,
      UTCNow,
    ],
    () => {
      if (
        !(
          stakedTokenDatas &&
          rewardEntries &&
          rewardDistributorData &&
          rewardMintInfo &&
          (rewardDistributorData?.parsed.kind === RewardDistributorKind.Mint ||
            !!rewardDistributorTokenAccount)
        )
      ) {
        return { rewardMap: {}, claimableRewards: new BN(0) }
      }

      const stakeEntries = stakedTokenDatas
        .filter((tk) => tk && tk.stakeEntry)
        .map((tk) => tk.stakeEntry!)

      return getRewardMap(
        stakeEntries,
        rewardEntries,
        rewardDistributorData,
        rewardDistributorData.parsed.kind === RewardDistributorKind.Mint
          ? rewardMintInfo?.mintInfo.supply
          : rewardDistributorTokenAccount!.amount,
        UTCNow
      )
    },
    {
      keepPreviousData: true,
      enabled:
        !!stakedTokenDatas &&
        !!rewardEntries &&
        !!rewardDistributorData &&
        (rewardDistributorData?.parsed.kind === RewardDistributorKind.Mint ||
          !!rewardDistributorTokenAccount),
    }
  )
}
