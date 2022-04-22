import type { AccountData } from '@cardinal/common'
import {
  RewardDistributorData,
  RewardEntryData,
  REWARD_DISTRIBUTOR_ADDRESS,
  REWARD_DISTRIBUTOR_IDL,
  REWARD_DISTRIBUTOR_PROGRAM,
} from '@cardinal/staking/dist/cjs/programs/rewardDistributor'
import { StakeEntryData } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { BN, Program, Provider } from '@project-serum/anchor'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'

export const getRewardEntries = async (
  connection: Connection,
  rewardEntryIds: PublicKey[]
): Promise<AccountData<RewardEntryData>[]> => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const provider = new Provider(connection, null, {})
  const rewardDistributorProgram = new Program<REWARD_DISTRIBUTOR_PROGRAM>(
    REWARD_DISTRIBUTOR_IDL,
    REWARD_DISTRIBUTOR_ADDRESS,
    provider
  )

  const stakeEntries =
    (await rewardDistributorProgram.account.rewardEntry.fetchMultiple(
      rewardEntryIds
    )) as RewardEntryData[]
  return stakeEntries.map((tm, i) => ({
    parsed: tm,
    pubkey: rewardEntryIds[i]!,
  }))
}

export const calculatePendingRewards = (
  rewardDistributor: AccountData<RewardDistributorData>,
  stakeEntry: AccountData<StakeEntryData>,
  rewardEntry: AccountData<RewardEntryData>,
  remainingRewardAmount: BN,
  UTCNow: number
): [BN, BN] => {
  if (
    !stakeEntry ||
    stakeEntry.parsed.pool.toString() !==
      rewardDistributor.parsed.stakePool.toString()
  ) {
    return [new BN(0), new BN(0)]
  }

  const rewardSecondsReceived =
    rewardEntry?.parsed.rewardSecondsReceived || new BN(0)
  const multiplier = rewardEntry?.parsed.multiplier || new BN(1)

  let rewardAmountToReceive = new BN(UTCNow)
    .sub(stakeEntry.parsed.lastStakedAt)
    .add(stakeEntry.parsed.totalStakeSeconds)
    .sub(rewardSecondsReceived)
    .div(rewardDistributor.parsed.rewardDurationSeconds)
    .mul(rewardDistributor.parsed.rewardAmount)
    .mul(multiplier)

  if (
    rewardDistributor.parsed.maxSupply &&
    rewardDistributor.parsed.rewardsIssued
      .add(rewardAmountToReceive)
      .gte(rewardDistributor.parsed.maxSupply)
  ) {
    rewardAmountToReceive = rewardDistributor.parsed.maxSupply.sub(
      rewardDistributor.parsed.rewardsIssued
    )
  }

  if (rewardAmountToReceive > remainingRewardAmount) {
    rewardAmountToReceive = remainingRewardAmount
  }

  const nextRewardsIn = rewardDistributor.parsed.rewardDurationSeconds.sub(
    new BN(UTCNow)
      .sub(stakeEntry.parsed.lastStakedAt)
      .add(stakeEntry.parsed.totalStakeSeconds)
      .mod(rewardDistributor.parsed.rewardDurationSeconds)
  )
  // console.log(
  //   new BN(UTCNow).sub(stakeEntry.parsed.lastStakedAt).toString(),
  //   rewardSecondsReceived.toString(),
  //   stakeEntry.parsed.totalStakeSeconds.toString(),
  //   rewardDistributor.parsed.rewardDurationSeconds.toString(),
  //   rewardAmountToReceive.toString()
  // )

  return [rewardAmountToReceive, nextRewardsIn]
}
