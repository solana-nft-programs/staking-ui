import { useRewardDistributorData } from './useRewardDistributorData'
import { useStakedTokenDatas } from './useStakedTokenDatas'
import { BN } from '@project-serum/anchor'
import { useRewardDistributorTokenAccount } from './useRewardDistributorTokenAccount'
import { useUTCNow } from 'providers/UTCNowProvider'
import { useRewardEntries } from './useRewardEntries'
import { getRewardMap } from '@cardinal/staking'
import { useQuery } from 'react-query'

export const useRewards = () => {
  const { data: rewardDistributorData } = useRewardDistributorData()
  const { data: rewardDistributorTokenAccount } =
    useRewardDistributorTokenAccount()
  const { data: stakedTokenDatas } = useStakedTokenDatas()
  const { data: rewardEntries } = useRewardEntries()
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
          rewardDistributorTokenAccount &&
          rewardDistributorData &&
          rewardEntries.length > 0
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
        rewardDistributorTokenAccount.amount,
        UTCNow
      )
    },
    {
      keepPreviousData: true,
      enabled:
        !!stakedTokenDatas &&
        !!rewardEntries &&
        !!rewardDistributorTokenAccount &&
        !!rewardDistributorData,
    }
  )
}
