import type { AccountData } from '@cardinal/common'
import { findAta, tryGetAccount } from '@cardinal/common'
import { RewardDistributorData } from '@cardinal/staking/dist/cjs/programs/rewardDistributor'
import { getRewardEntry } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/accounts'
import { findRewardEntryId } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/pda'
import { getStakeEntry } from '@cardinal/staking/dist/cjs/programs/stakePool/accounts'
import { findStakeEntryIdFromMint } from '@cardinal/staking/dist/cjs/programs/stakePool/utils'
import { BN } from '@project-serum/anchor'
import * as splToken from '@solana/spl-token'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'

export const getPendingRewardsForPool = async (
  connection: Connection,
  wallet: PublicKey,
  mintIds: PublicKey[],
  rewardDistributor: AccountData<RewardDistributorData>,
  UTCNow: number
): Promise<BN> => {
  let totalRewards = new BN(0)

  const rewardDistributorTokenAccount = await findAta(
    rewardDistributor.parsed.rewardMint,
    rewardDistributor.pubkey,
    true
  )
  const rewardMint = new splToken.Token(
    connection,
    rewardDistributor.parsed.rewardMint,
    splToken.TOKEN_PROGRAM_ID,
    Keypair.generate() // not used
  )
  const rewardDistributorTokenAccountInfo = await rewardMint.getAccountInfo(
    rewardDistributorTokenAccount
  )

  for (let i = 0; i < mintIds.length; i++) {
    const mintId = mintIds[i]!
    const [[stakeEntryId], [rewardEntryId]] = await Promise.all([
      findStakeEntryIdFromMint(
        connection,
        wallet,
        rewardDistributor.parsed.stakePool,
        mintId
      ),
      findRewardEntryId(rewardDistributor.pubkey, mintId),
    ])
    const [stakeEntry, rewardEntry] = await Promise.all([
      tryGetAccount(() => getStakeEntry(connection, stakeEntryId)),
      tryGetAccount(() => getRewardEntry(connection, rewardEntryId)),
    ])

    if (
      !stakeEntry ||
      stakeEntry.parsed.pool.toString() !==
        rewardDistributor.parsed.stakePool.toString()
    ) {
      continue
    }

    let rewardsReceived = new BN(0)
    let multiplier = new BN(1)
    if (rewardEntry) {
      rewardsReceived = rewardEntry.parsed.rewardSecondsReceived
      multiplier = rewardEntry.parsed.multiplier
    }
    const rewardTimeToReceive = new BN(UTCNow).sub(
      stakeEntry.parsed.lastStakedAt.sub(rewardsReceived)
    )
    const rewardAmountToReceive = rewardTimeToReceive
      .div(rewardDistributor.parsed.rewardDurationSeconds)
      .mul(rewardDistributor.parsed.rewardAmount)
      .mul(multiplier)

    totalRewards = totalRewards.add(rewardAmountToReceive)
  }

  if (
    rewardDistributor.parsed.maxSupply &&
    rewardDistributor.parsed.rewardsIssued
      .add(totalRewards)
      .gte(rewardDistributor.parsed.maxSupply)
  ) {
    totalRewards = rewardDistributor.parsed.maxSupply.sub(
      rewardDistributor.parsed.rewardsIssued
    )
  }

  if (totalRewards > rewardDistributorTokenAccountInfo.amount) {
    totalRewards = rewardDistributorTokenAccountInfo.amount
  }

  console.log(totalRewards.toString())
  return totalRewards
}
