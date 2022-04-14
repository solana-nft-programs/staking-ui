import { stakePool } from '@cardinal/staking'
import { StakeEntryData } from '@cardinal/staking/dist/cjs/programs/stakePool'
import * as metaplex from '@metaplex-foundation/mpl-token-metadata'
import { getBatchedMultipleAccounts, tryGetAccount } from '@cardinal/common'
import { BorshAccountsCoder } from '@project-serum/anchor'
import { Connection, PublicKey } from '@solana/web3.js'
import * as anchor from '@project-serum/anchor'
import { AccountData } from '@cardinal/common'
import { StakeEntryTokenData } from './types'
import { findRewardEntryId } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/pda'
import { RewardDistributorData } from '@cardinal/staking/dist/cjs/programs/rewardDistributor'
import { getRewardEntry } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/accounts'

export const STAKER_OFFSET = 82

export const getPendingRewardsForPool = async (
  connection: Connection,
  mint_id: PublicKey,
  stakeEntry: AccountData<StakeEntryData>,
  rewardDistributor: AccountData<RewardDistributorData>
): Promise<number> => {
  const UTCNow = Date.now() / 1000
  const [rewardEntryId] = await findRewardEntryId(
    rewardDistributor.pubkey,
    mint_id
  )
  const rewardEntry = await tryGetAccount(() =>
    getRewardEntry(connection, rewardEntryId)
  )
  let rewardsReceived = new anchor.BN(0)
  let multiplier = new anchor.BN(1)
  if (rewardEntry) {
    rewardsReceived = rewardEntry.parsed.rewardSecondsReceived
    multiplier = rewardEntry.parsed.multiplier
  }
  const rewardTimeToReceive =
    UTCNow -
    stakeEntry.parsed.lastStakedAt.toNumber() -
    rewardsReceived.toNumber()
  const rewardAmountToReceive =
    (rewardTimeToReceive /
      rewardDistributor.parsed.rewardDurationSeconds.toNumber()) *
    rewardDistributor.parsed.rewardAmount.toNumber() *
    multiplier.toNumber()
  return rewardAmountToReceive
}

export async function getStakeEntryDatas(
  connection: Connection,
  stakePoolId: PublicKey,
  userId: PublicKey
): Promise<StakeEntryTokenData[]> {
  const stakeEntries = await getStakeEntriesForUser(connection, userId)
  const mintIds = stakeEntries
    .filter((entry) => entry.parsed.pool.toString() === stakePoolId.toString())
    .map((stakeEntry) => stakeEntry.parsed.originalMint)
  const metadataTuples: [PublicKey, PublicKey][] = await Promise.all(
    mintIds.map(async (mintId) => {
      const [metaplexId] = await PublicKey.findProgramAddress(
        [
          anchor.utils.bytes.utf8.encode(metaplex.MetadataProgram.PREFIX),
          metaplex.MetadataProgram.PUBKEY.toBuffer(),
          mintId.toBuffer(),
        ],
        metaplex.MetadataProgram.PUBKEY
      )
      return [metaplexId, mintId]
    })
  )

  const metaplexIds = metadataTuples.map(([metaplexId]) => metaplexId)

  const metaplexAccountInfos = await getBatchedMultipleAccounts(
    connection,
    metaplexIds
  )

  const metaplexData = metaplexAccountInfos.map((accountInfo, i) => {
    let md
    try {
      md = {
        pubkey: metaplexIds[i],
        ...accountInfo,
        data: metaplex.MetadataData.deserialize(accountInfo?.data as Buffer),
      }
    } catch (e) {}
    return md
  })

  const metadata = await Promise.all(
    metaplexData.map(async (md, i) => {
      try {
        if (!md) return null
        const json = await fetch(md.data.data.uri).then((r) => r.json())
        return {
          pubkey: md.pubkey,
          data: json,
        }
      } catch (e) {
        // console.log(e)
        return null
      }
    })
  )

  return metadataTuples.map(([metaplexId, mintId]) => ({
    metaplexData: metaplexData.find((data) =>
      data ? data.pubkey.toBase58() === metaplexId.toBase58() : undefined
    ),
    metadata: metadata.find((data) =>
      data ? data.pubkey.toBase58() === metaplexId.toBase58() : undefined
    ),
    stakeEntry: stakeEntries.find((data) =>
      data
        ? data.parsed.originalMint.toBase58() === mintId.toBase58()
        : undefined
    ),
  }))
}

export const getStakeEntriesForUser = async (
  connection: Connection,
  user: PublicKey
): Promise<AccountData<StakeEntryData>[]> => {
  const programAccounts = await connection.getProgramAccounts(
    stakePool.STAKE_POOL_ADDRESS,
    {
      filters: [{ memcmp: { offset: STAKER_OFFSET, bytes: user.toBase58() } }],
    }
  )

  const stakeEntryDatas: AccountData<StakeEntryData>[] = []
  const coder = new BorshAccountsCoder(stakePool.STAKE_POOL_IDL)
  programAccounts.forEach((account) => {
    try {
      const stakeEntryData: StakeEntryData = coder.decode(
        'stakeEntry',
        account.account.data
      )
      if (stakeEntryData) {
        stakeEntryDatas.push({
          ...account,
          parsed: stakeEntryData,
        })
      }
    } catch (e) {
      // console.log(`Failed to decode token manager data`);
    }
  })

  return stakeEntryDatas.sort((a, b) =>
    a.pubkey.toBase58().localeCompare(b.pubkey.toBase58())
  )
}
