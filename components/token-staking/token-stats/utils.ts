import type {
  CardinalRewardsCenter,
  IdlAccountData,
} from '@cardinal/rewards-center'
import type BN from 'bn.js'
import { BN as BigNumber } from 'bn.js'
import type { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import type { StakeEntryTokenData } from 'hooks/useStakedTokenDatas'

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

export interface MinimumStakeTimeArgs {
  tokenData: StakeEntryTokenData
  stakePool:
    | Pick<
        IdlAccountData<'stakePool', CardinalRewardsCenter>,
        'pubkey' | 'parsed'
      >
    | undefined
}

export const hasMinimumStakeTime = ({
  tokenData,
  stakePool,
}: MinimumStakeTimeArgs) => {
  const has =
    tokenData.stakeEntry?.parsed.cooldownStartSeconds ||
    stakePool?.parsed.minStakeSeconds
  return !!has
}

export interface CooldownArgs {
  tokenData: StakeEntryTokenData
  stakePool:
    | Pick<
        IdlAccountData<'stakePool', CardinalRewardsCenter>,
        'pubkey' | 'parsed'
      >
    | undefined
}

export const hasCooldown = ({ tokenData, stakePool }: CooldownArgs) => {
  const has =
    tokenData.stakeEntry?.parsed.cooldownStartSeconds ||
    stakePool?.parsed.cooldownSeconds
  return !!has
}
