import { secondstoDuration } from '@cardinal/common'
import type BN from 'bn.js'
import { BN as BigNumber } from 'bn.js'
import type { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { useRewards } from 'hooks/useRewards'
import type { StakeEntryTokenData } from 'hooks/useStakedTokenDatas'

export interface TokenStatNextRewardValueProps {
  tokenData: StakeEntryTokenData
}

export interface RewardArgs {
  rewardsData:
    | {
        rewardMap: {
          [stakeEntryId: string]: { claimableRewards: BN; nextRewardsIn: BN }
        }
        claimableRewards: BN
      }
    | undefined
  rewardDistributorData: ReturnType<typeof useRewardDistributorData>['data']
  tokenData: StakeEntryTokenData
}

export const hasNextRewards = ({
  rewardsData,
  rewardDistributorData,
  tokenData,
}: RewardArgs) => {
  const hasRewards =
    rewardsData &&
    rewardsData.rewardMap[tokenData.stakeEntry?.pubkey.toString() || ''] &&
    rewardDistributorData?.parsed.rewardDurationSeconds.gte(new BigNumber(60))
  return !!hasRewards
}

export const TokenStatNextRewardValue = ({
  tokenData,
}: TokenStatNextRewardValueProps) => {
  const { data: rewardsData } = useRewards()

  return (
    <>
      {rewardsData &&
        secondstoDuration(
          rewardsData.rewardMap[
            tokenData.stakeEntry?.pubkey.toString() || ''
          ]?.nextRewardsIn.toNumber() || 0
        )}
    </>
  )
}
