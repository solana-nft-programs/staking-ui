import type {
  CardinalRewardsCenter,
  IdlAccountData,
  StakeEntry,
} from '@cardinal/rewards-center'
import {
  fetchIdlAccount,
  findStakeEntryId,
  rewardsCenterProgram,
} from '@cardinal/rewards-center'
import type { StakeEntryData } from '@cardinal/staking/dist/cjs/programs/stakePool'
import {
  getStakeEntriesForUser,
  getStakeEntry,
} from '@cardinal/staking/dist/cjs/programs/stakePool/accounts'
import { findStakeEntryIdFromMint } from '@cardinal/staking/dist/cjs/programs/stakePool/utils'
import type { IdlTypes } from '@project-serum/anchor'
import type {
  AllAccountsMap,
  TypeDef,
} from '@project-serum/anchor/dist/cjs/program/namespace/types'
import type { Connection } from '@solana/web3.js'
import { PublicKey } from '@solana/web3.js'
import { BN } from 'bn.js'
import { isStakePoolV2 } from 'hooks/useStakePoolData'

export const fetchStakeEntry = async (
  connection: Connection,
  wallet: Parameters<typeof rewardsCenterProgram>[1],
  stakePoolData: Pick<IdlAccountData<'stakePool'>, 'pubkey' | 'parsed'>,
  mintId: PublicKey,
  isFungible = false
): Promise<Pick<IdlAccountData<'stakeEntry'>, 'pubkey' | 'parsed'>> => {
  if (!stakePoolData.parsed) {
    throw 'No parsed data for stake pool'
  }
  if (isStakePoolV2(stakePoolData.parsed)) {
    const stakeEntryId = findStakeEntryId(
      stakePoolData.pubkey,
      mintId,
      wallet.publicKey,
      isFungible
    )
    return await fetchIdlAccount(connection, stakeEntryId, 'stakeEntry')
  } else {
    const [stakeEntryId] = await findStakeEntryIdFromMint(
      connection,
      wallet.publicKey,
      stakePoolData.pubkey,
      mintId,
      isFungible
    )
    const stakeEntryData = await getStakeEntry(connection, stakeEntryId)
    return {
      pubkey: stakeEntryId,
      parsed: stakeEntryDataToV2(stakeEntryData.parsed),
    }
  }
}

export const fetchStakeEntriesForUser = async (
  connection: Connection,
  wallet: Parameters<typeof rewardsCenterProgram>[1],
  stakePoolData: Pick<IdlAccountData<'stakePool'>, 'pubkey' | 'parsed'>,
  user: PublicKey
): Promise<Pick<IdlAccountData<'stakeEntry'>, 'pubkey' | 'parsed'>[]> => {
  if (!stakePoolData.parsed) throw 'No stake pool parsed data found'
  if (isStakePoolV2(stakePoolData.parsed)) {
    const program = rewardsCenterProgram(connection, wallet)
    const stakeEntriesForUser = await program.account.stakeEntry.all([
      {
        memcmp: {
          offset: 82,
          bytes: user.toString(),
        },
      },
    ])
    return stakeEntriesForUser.map((e) => {
      return { pubkey: e.publicKey, parsed: e.account }
    })
  } else {
    const stakeEntries = await getStakeEntriesForUser(connection, user)
    return stakeEntries.map((entry) => {
      return {
        pubkey: entry.pubkey,
        parsed: stakeEntryDataToV2(entry.parsed),
      }
    })
  }
}

export const isStakeEntryV2 = (
  stakePoolData:
    | StakeEntryData
    | StakeEntry
    | TypeDef<
        AllAccountsMap<CardinalRewardsCenter>['stakeEntry'],
        IdlTypes<CardinalRewardsCenter>
      >
): boolean => !('originalMint' in stakePoolData)

export const stakeEntryDataToV2 = (
  stakeEntryData:
    | StakeEntryData
    | TypeDef<
        AllAccountsMap<CardinalRewardsCenter>['stakeEntry'],
        IdlTypes<CardinalRewardsCenter>
      >
): TypeDef<
  AllAccountsMap<CardinalRewardsCenter>['stakeEntry'],
  IdlTypes<CardinalRewardsCenter>
> => {
  if (!isStakeEntryV2(stakeEntryData)) {
    const entryData = stakeEntryData as StakeEntryData
    return {
      bump: entryData.bump,
      kind: entryData.kind,
      pool: entryData.pool,
      amount: entryData.amount,
      stakeMint: entryData.originalMint,
      lastStaker: entryData.lastStaker,
      lastStakedAt: entryData.lastStakedAt,
      lastUpdatedAt: entryData.lastUpdatedAt || entryData.lastStakedAt,
      totalStakeSeconds: entryData.totalStakeSeconds,
      usedStakeSeconds: new BN(0),
      cooldownStartSeconds: entryData.cooldownStartSeconds,
    }
  }
  return stakeEntryData as TypeDef<
    AllAccountsMap<CardinalRewardsCenter>['stakeEntry'],
    IdlTypes<CardinalRewardsCenter>
  >
}

export const stakeEntryDataToV1 = (
  stakeEntryData:
    | StakeEntryData
    | TypeDef<
        AllAccountsMap<CardinalRewardsCenter>['stakeEntry'],
        IdlTypes<CardinalRewardsCenter>
      >
): StakeEntryData => {
  if (!isStakeEntryV2(stakeEntryData)) {
    return stakeEntryData as StakeEntryData
  }

  const entryData = stakeEntryData as TypeDef<
    AllAccountsMap<CardinalRewardsCenter>['stakeEntry'],
    IdlTypes<CardinalRewardsCenter>
  >
  return {
    bump: entryData.bump,
    pool: entryData.pool,
    amount: entryData.amount,
    originalMint: entryData.stakeMint,
    lastStaker: entryData.lastStaker,
    lastStakedAt: entryData.lastStakedAt,
    totalStakeSeconds: entryData.totalStakeSeconds,
    originalMintClaimed: entryData.stakeMint !== PublicKey.default,
    stakeMintClaimed: false,
    kind: entryData.kind,
    stakeMint: PublicKey.default,
    cooldownStartSeconds: entryData.cooldownStartSeconds,
    lastUpdatedAt: entryData.lastUpdatedAt,
    grouped: false,
  }
}
