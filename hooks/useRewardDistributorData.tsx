import type { AccountData } from '@solana-nft-programs/common'
import type {
  RewardsCenter,
  IdlAccountData,
} from '@solana-nft-programs/rewards-center'
import {
  fetchIdlAccount,
  findRewardDistributorId as findRewardDistributorIdV2,
} from '@solana-nft-programs/rewards-center'
import type { RewardDistributorData } from '@solana-nft-programs/staking/dist/cjs/programs/rewardDistributor'
import { getRewardDistributor } from '@solana-nft-programs/staking/dist/cjs/programs/rewardDistributor/accounts'
import { findRewardDistributorId } from '@solana-nft-programs/staking/dist/cjs/programs/rewardDistributor/pda'
import { BN } from '@coral-xyz/anchor'
import type {
  AllAccountsMap,
  IdlTypes,
  TypeDef,
} from '@coral-xyz/anchor/dist/cjs/program/namespace/types'
import { PublicKey } from '@solana/web3.js'
import { REWARD_QUERY_KEY } from 'handlers/useHandleClaimRewards'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useQuery } from '@tanstack/react-query'

import { isStakePoolV2, useStakePoolData } from './useStakePoolData'

export const useRewardDistributorData = () => {
  const { connection } = useEnvironmentCtx()
  const { data: stakePoolData } = useStakePoolData()
  return useQuery<
    Pick<IdlAccountData<'rewardDistributor'>, 'pubkey' | 'parsed'> | undefined
  >(
    [
      REWARD_QUERY_KEY,
      'useRewardDistributorData',
      stakePoolData?.pubkey?.toString(),
    ],
    async () => {
      if (!stakePoolData?.pubkey || !stakePoolData?.parsed) return
      if (!isStakePoolV2(stakePoolData.parsed)) {
        const rewardDistributorId = findRewardDistributorId(
          stakePoolData.pubkey
        )
        const rewardDistributorData = await getRewardDistributor(
          connection,
          rewardDistributorId
        )
        return {
          pubkey: rewardDistributorId,
          parsed: rewardDistributorDataToV2(rewardDistributorData.parsed),
        }
      } else {
        const rewardDistributorId = findRewardDistributorIdV2(
          stakePoolData?.pubkey,
          new BN(0)
        )
        const rewardDistributorData = await fetchIdlAccount(
          connection,
          rewardDistributorId,
          'rewardDistributor'
        )
        return {
          pubkey: rewardDistributorId,
          parsed: rewardDistributorDataToV2(rewardDistributorData.parsed),
        }
      }
    },
    {
      enabled: !!stakePoolData?.pubkey,
      retry: false,
    }
  )
}

export const isRewardDistributorV2 = (
  rewardDistributorData: (
    | RewardDistributorData
    | TypeDef<
        AllAccountsMap<RewardsCenter>['rewardDistributor'],
        IdlTypes<RewardsCenter>
      >
  ) & { type?: 'v1' | 'v2' }
): boolean =>
  !('maxSupply' in rewardDistributorData || rewardDistributorData.type === 'v1')

export const rewardDistributorDataToV2 = (
  rewardDistributorData:
    | RewardDistributorData
    | TypeDef<
        AllAccountsMap<RewardsCenter>['rewardDistributor'],
        IdlTypes<RewardsCenter>
      >
): TypeDef<
  AllAccountsMap<RewardsCenter>['rewardDistributor'],
  IdlTypes<RewardsCenter>
> & { type: 'v1' | 'v2' } => {
  if (!('identifier' in rewardDistributorData)) {
    const rwdData = rewardDistributorData as RewardDistributorData
    return {
      bump: rwdData.bump,
      stakePool: rwdData.stakePool,
      kind: rwdData.kind,
      authority: rwdData.authority,
      identifier: new BN(0),
      rewardMint: rwdData.rewardMint,
      rewardAmount: rwdData.rewardAmount,
      rewardDurationSeconds: rwdData.rewardDurationSeconds,
      rewardsIssued: rwdData.rewardsIssued,
      defaultMultiplier: rwdData.defaultMultiplier,
      multiplierDecimals: rwdData.multiplierDecimals,
      claimRewardsPaymentInfo: PublicKey.default,
      maxRewardSecondsReceived: rwdData.maxRewardSecondsReceived,
      type: 'v1',
    }
  }
  return { ...rewardDistributorData, type: 'v2' }
}

export const rewardDistributorDataToV1 = (
  rewardDistributorData:
    | AccountData<RewardDistributorData>
    | Pick<IdlAccountData<'rewardDistributor'>, 'pubkey' | 'parsed'>
): AccountData<RewardDistributorData> => {
  if (!rewardDistributorData.parsed) throw 'No parsed reward distributor data'
  if (isRewardDistributorV2(rewardDistributorData.parsed)) {
    return {
      pubkey: rewardDistributorData.pubkey,
      parsed: {
        bump: rewardDistributorData.parsed.bump,
        stakePool: rewardDistributorData.parsed.stakePool,
        kind: rewardDistributorData.parsed.kind,
        authority: rewardDistributorData.parsed.authority,
        rewardMint: rewardDistributorData.parsed.rewardMint,
        rewardAmount: rewardDistributorData.parsed.rewardAmount,
        rewardDurationSeconds:
          rewardDistributorData.parsed.rewardDurationSeconds,
        rewardsIssued: rewardDistributorData.parsed.rewardsIssued,
        maxSupply: null,
        defaultMultiplier: rewardDistributorData.parsed.defaultMultiplier,
        multiplierDecimals: rewardDistributorData.parsed.multiplierDecimals,
        maxRewardSecondsReceived:
          rewardDistributorData.parsed.maxRewardSecondsReceived,
      },
    }
  }
  return rewardDistributorData as AccountData<RewardDistributorData>
}
