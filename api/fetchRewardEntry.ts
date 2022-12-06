import type {
  CardinalRewardsCenter,
  IdlAccountData,
} from '@cardinal/rewards-center'
import {
  fetchIdlAccount,
  findRewardEntryId as findRewardEntryIdV2,
} from '@cardinal/rewards-center'
import type { RewardEntryData } from '@cardinal/staking/dist/cjs/programs/rewardDistributor'
import { getRewardEntry } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/accounts'
import { findRewardEntryId } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/pda'
import type {
  AllAccountsMap,
  TypeDef,
} from '@project-serum/anchor/dist/cjs/program/namespace/types'
import type { IdlTypes } from '@project-serum/anchor/dist/esm'
import type { Connection, PublicKey } from '@solana/web3.js'
import { isRewardDistributorV2 } from 'hooks/useRewardDistributorData'

export const fetchRewardEntry = async (
  connection: Connection,
  rewardDistributorData: Pick<
    IdlAccountData<'rewardDistributor'>,
    'pubkey' | 'parsed'
  >,
  stakeEntryId: PublicKey
): Promise<Pick<IdlAccountData<'rewardEntry'>, 'pubkey' | 'parsed'>> => {
  if (!rewardDistributorData.parsed) {
    throw 'No parsed data for reward distributor'
  }
  if (isRewardDistributorV2(rewardDistributorData.parsed)) {
    const rewardEntryId = findRewardEntryIdV2(
      rewardDistributorData.pubkey,
      stakeEntryId
    )
    return await fetchIdlAccount(connection, rewardEntryId, 'rewardEntry')
  } else {
    const [rewardEntryId] = await findRewardEntryId(
      rewardDistributorData.pubkey,
      stakeEntryId
    )
    const rewardEntryData = await getRewardEntry(connection, rewardEntryId)
    return {
      pubkey: rewardEntryId,
      parsed: rewardEntryData.parsed,
    }
  }
}

export const isRewardEntryV2 = (
  rewardEntryData:
    | RewardEntryData
    | TypeDef<
        AllAccountsMap<CardinalRewardsCenter>['rewardEntry'],
        IdlTypes<CardinalRewardsCenter>
      >
): boolean => !('original_mint' in rewardEntryData)

export const rewardEntryDataToV2 = (
  rewardEntryData:
    | RewardEntryData
    | TypeDef<
        AllAccountsMap<CardinalRewardsCenter>['rewardEntry'],
        IdlTypes<CardinalRewardsCenter>
      >
): TypeDef<
  AllAccountsMap<CardinalRewardsCenter>['rewardEntry'],
  IdlTypes<CardinalRewardsCenter>
> => {
  if (!isRewardEntryV2(rewardEntryData)) {
    const entryData = rewardEntryData as RewardEntryData
    return {
      bump: entryData.bump,
      stakeEntry: entryData.stakeEntry,
      rewardDistributor: entryData.rewardDistributor,
      rewardSecondsReceived: entryData.rewardSecondsReceived,
      multiplier: entryData.multiplier,
    }
  }
  return rewardEntryData as TypeDef<
    AllAccountsMap<CardinalRewardsCenter>['rewardEntry'],
    IdlTypes<CardinalRewardsCenter>
  >
}

export const rewardEntryDataToV1 = (
  rewardEntryData:
    | RewardEntryData
    | TypeDef<
        AllAccountsMap<CardinalRewardsCenter>['rewardEntry'],
        IdlTypes<CardinalRewardsCenter>
      >
): RewardEntryData => {
  if (!isRewardEntryV2(rewardEntryData)) {
    return rewardEntryData as RewardEntryData
  }

  const entryData = rewardEntryData as TypeDef<
    AllAccountsMap<CardinalRewardsCenter>['rewardEntry'],
    IdlTypes<CardinalRewardsCenter>
  >
  return {
    bump: entryData.bump,
    stakeEntry: entryData.stakeEntry,
    rewardDistributor: entryData.rewardDistributor,
    rewardSecondsReceived: entryData.rewardSecondsReceived,
    multiplier: entryData.multiplier,
  }
}
