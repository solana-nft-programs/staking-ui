import * as splToken from '@solana/spl-token'
import { stakePool } from '@cardinal/staking'
import { StakeEntryData } from '@cardinal/staking/dist/cjs/programs/stakePool'
import * as metaplex from '@metaplex-foundation/mpl-token-metadata'
import { getBatchedMultipleAccounts } from '@cardinal/common'
import { BorshAccountsCoder } from '@project-serum/anchor'
import { Connection, PublicKey } from '@solana/web3.js'
import * as anchor from '@project-serum/anchor'
import { AccountData } from '@cardinal/common'
import { StakeEntryTokenData } from './types'

export const STAKER_OFFSET = 82

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
        pubkey: metaplexIds[i]!,
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
          pubkey: md.pubkey!,
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
