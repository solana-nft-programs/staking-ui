import type {
  CardinalRewardsCenter,
  IdlAccountData,
} from '@cardinal/rewards-center'
import { PublicKey } from '@solana/web3.js'
import type BN from 'bn.js'
import { BN as BigNumber } from 'bn.js'
import { formatAmountAsDecimal } from 'common/units'
import type { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import type { StakeEntryTokenData } from 'hooks/useStakedTokenDatas'

export interface BoostArgs {
  rewardDistributorData: Pick<
    IdlAccountData<'rewardDistributor'>,
    'pubkey' | 'parsed'
  >
  tokenData: StakeEntryTokenData
  rewardEntriesData:
    | Pick<IdlAccountData<'rewardEntry'>, 'pubkey' | 'parsed'>[]
    | undefined
}

export const calculateBoost = ({
  rewardDistributorData,
  rewardEntriesData,
  tokenData,
}: BoostArgs) => {
  return formatAmountAsDecimal(
    rewardDistributorData?.parsed.multiplierDecimals || 0,
    rewardEntriesData
      ? rewardEntriesData.find((entry) =>
          entry.parsed?.stakeEntry.equals(
            tokenData.stakeEntry?.pubkey || PublicKey.default
          )
        )?.parsed?.multiplier || rewardDistributorData.parsed.defaultMultiplier
      : rewardDistributorData.parsed.defaultMultiplier,
    rewardDistributorData.parsed.multiplierDecimals
  )
}

export const hasBoost = ({
  rewardDistributorData,
  rewardEntriesData,
  tokenData,
}: BoostArgs) => {
  const boost = Number(
    calculateBoost({
      rewardDistributorData,
      rewardEntriesData,
      tokenData,
    })
  )
  return boost > 1
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
