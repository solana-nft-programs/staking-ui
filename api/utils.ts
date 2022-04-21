import type { AccountData } from '@cardinal/common'
import { findAta, tryGetAccount } from '@cardinal/common'
import {
  RewardDistributorData,
  RewardEntryData,
  REWARD_DISTRIBUTOR_ADDRESS,
  REWARD_DISTRIBUTOR_IDL,
  REWARD_DISTRIBUTOR_PROGRAM,
} from '@cardinal/staking/dist/cjs/programs/rewardDistributor'
import { getRewardEntry } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/accounts'
import { findRewardEntryId } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/pda'
import { StakeEntryData } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { getStakeEntry } from '@cardinal/staking/dist/cjs/programs/stakePool/accounts'
import { findStakeEntryIdFromMint } from '@cardinal/staking/dist/cjs/programs/stakePool/utils'
import { BN, Program, Provider } from '@project-serum/anchor'
import * as splToken from '@solana/spl-token'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'

// /**
//  * TODO move into stake pool library?
//  *
//  * @param connection
//  * @param wallet
//  * @param mintIds
//  * @param rewardDistributor
//  * @param UTCNow
//  * @returns
//  */
// export const getPendingRewardsForPool = async (
//   connection: Connection,
//   wallet: PublicKey,
//   mintIds: PublicKey[],
//   rewardDistributor: AccountData<RewardDistributorData>,
//   UTCNow: number
// ): Promise<BN> => {
//   let totalRewards = new BN(0)

//   const rewardDistributorTokenAccount = await findAta(
//     rewardDistributor.parsed.rewardMint,
//     rewardDistributor.pubkey,
//     true
//   )
//   const rewardMint = new splToken.Token(
//     connection,
//     rewardDistributor.parsed.rewardMint,
//     splToken.TOKEN_PROGRAM_ID,
//     Keypair.generate() // not used
//   )
//   const rewardDistributorTokenAccountInfo = await rewardMint.getAccountInfo(
//     rewardDistributorTokenAccount
//   )

//   for (let i = 0; i < mintIds.length; i++) {
//     const mintId = mintIds[i]!
//     const [[stakeEntryId], [rewardEntryId]] = await Promise.all([
//       findStakeEntryIdFromMint(
//         connection,
//         wallet,
//         rewardDistributor.parsed.stakePool,
//         mintId
//       ),
//       findRewardEntryId(rewardDistributor.pubkey, mintId),
//     ])
//     const [stakeEntry, rewardEntry] = await Promise.all([
//       tryGetAccount(() => getStakeEntry(connection, stakeEntryId)),
//       tryGetAccount(() => getRewardEntry(connection, rewardEntryId)),
//     ])

//     if (
//       !stakeEntry ||
//       stakeEntry.parsed.pool.toString() !==
//         rewardDistributor.parsed.stakePool.toString()
//     ) {
//       continue
//     }

//     const rewardSecondsReceived =
//       rewardEntry?.parsed.rewardSecondsReceived || new BN(0)
//     const multiplier = rewardEntry?.parsed.multiplier || new BN(1)

//     const rewardTimeToReceive = new BN(UTCNow)
//       .sub(stakeEntry.parsed.lastStakedAt)
//       .add(stakeEntry.parsed.totalStakeSeconds)
//       .sub(rewardSecondsReceived)
//     const rewardAmountToReceive = rewardTimeToReceive
//       .div(rewardDistributor.parsed.rewardDurationSeconds)
//       .mul(rewardDistributor.parsed.rewardAmount)
//       .mul(multiplier)

//     totalRewards = totalRewards.add(rewardAmountToReceive)
//   }

//   if (
//     rewardDistributor.parsed.maxSupply &&
//     rewardDistributor.parsed.rewardsIssued
//       .add(totalRewards)
//       .gte(rewardDistributor.parsed.maxSupply)
//   ) {
//     totalRewards = rewardDistributor.parsed.maxSupply.sub(
//       rewardDistributor.parsed.rewardsIssued
//     )
//   }

//   if (totalRewards > rewardDistributorTokenAccountInfo.amount) {
//     totalRewards = rewardDistributorTokenAccountInfo.amount
//   }

//   return totalRewards
// }

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

  const rewardTimeToReceive = new BN(UTCNow)
    .sub(stakeEntry.parsed.lastStakedAt)
    .add(stakeEntry.parsed.totalStakeSeconds)
    .sub(rewardSecondsReceived)
  let rewardAmountToReceive = rewardTimeToReceive
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
      .mod(rewardDistributor.parsed.rewardDurationSeconds)
  )

  // console.log(
  //   UTCNow,
  //   new BN(UTCNow).sub(stakeEntry.parsed.lastStakedAt).toString(),
  //   rewardSecondsReceived.toString(),
  //   stakeEntry.parsed.totalStakeSeconds.toString(),
  //   rewardTimeToReceive.toString(),
  //   rewardAmountToReceive.toString()
  // )

  return [rewardAmountToReceive, nextRewardsIn]
}
