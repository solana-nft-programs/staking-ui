import type {
  CardinalRewardsCenter,
  IdlAccountData,
} from '@cardinal/rewards-center'
import {
  REWARDS_CENTER_ADDRESS,
  REWARDS_CENTER_IDL,
} from '@cardinal/rewards-center'
import type { StakePoolData } from '@cardinal/staking/dist/cjs/programs/stakePool'
import {
  STAKE_POOL_ADDRESS,
  STAKE_POOL_IDL,
} from '@cardinal/staking/dist/cjs/programs/stakePool'
import { BorshAccountsCoder } from '@project-serum/anchor'
import type {
  AllAccountsMap,
  IdlTypes,
  TypeDef,
} from '@project-serum/anchor/dist/cjs/program/namespace/types'
import { PublicKey } from '@solana/web3.js'
import { useStakePoolId } from 'hooks/useStakePoolId'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useQuery } from 'react-query'

export const useStakePoolData = () => {
  const stakePoolId = useStakePoolId()
  const { connection } = useEnvironmentCtx()

  return useQuery<
    Pick<IdlAccountData<'stakePool'>, 'pubkey' | 'parsed'> | undefined
  >(
    ['stakePoolData', stakePoolId?.toString()],
    async () => {
      if (!stakePoolId) return
      const stakePoolAccountInfo = await connection.getAccountInfo(stakePoolId)
      if (
        stakePoolAccountInfo?.owner.toString() === STAKE_POOL_ADDRESS.toString()
      ) {
        const stakePoolData: StakePoolData = new BorshAccountsCoder(
          STAKE_POOL_IDL
        ).decode('stakePool', stakePoolAccountInfo.data)
        return {
          pubkey: stakePoolId,
          parsed: stakePoolDataToV2(stakePoolData),
        }
      } else if (
        stakePoolAccountInfo?.owner.toString() ===
        REWARDS_CENTER_ADDRESS.toString()
      ) {
        const stakePoolData: TypeDef<
          AllAccountsMap<CardinalRewardsCenter>['stakePool'],
          IdlTypes<CardinalRewardsCenter>
        > = new BorshAccountsCoder(REWARDS_CENTER_IDL).decode(
          'stakePool',
          stakePoolAccountInfo.data
        )
        return {
          pubkey: stakePoolId,
          parsed: stakePoolDataToV2(stakePoolData),
        }
      }
    },
    {
      enabled: !!stakePoolId,
    }
  )
}

export const isStakePoolV2 = (
  stakePoolData: (
    | StakePoolData
    | TypeDef<
        AllAccountsMap<CardinalRewardsCenter>['stakePool'],
        IdlTypes<CardinalRewardsCenter>
      >
  ) & { type?: string }
): boolean =>
  !('requiresCreators' in stakePoolData || stakePoolData.type === 'v1')

export const stakePoolDataToV2 = (
  stakePoolData:
    | StakePoolData
    | TypeDef<
        AllAccountsMap<CardinalRewardsCenter>['stakePool'],
        IdlTypes<CardinalRewardsCenter>
      >
): TypeDef<
  AllAccountsMap<CardinalRewardsCenter>['stakePool'],
  IdlTypes<CardinalRewardsCenter>
> & { type: string } => {
  if (!isStakePoolV2(stakePoolData)) {
    const poolData = stakePoolData as StakePoolData
    return {
      bump: poolData.bump,
      authority: poolData.authority,
      totalStaked: poolData.totalStaked,
      resetOnUnstake: poolData.resetOnStake,
      cooldownSeconds: poolData.cooldownSeconds,
      minStakeSeconds: poolData.minStakeSeconds,
      endDate: poolData.endDate,
      stakePaymentInfo: PublicKey.default,
      unstakePaymentInfo: PublicKey.default,
      requiresAuthorization: poolData.requiresAuthorization,
      allowedCreators: poolData.requiresCreators,
      allowedCollections: poolData.requiresCollections,
      identifier: poolData.identifier.toString(),
      type: 'v1',
    }
  }
  return { ...stakePoolData, type: 'v2' } as TypeDef<
    AllAccountsMap<CardinalRewardsCenter>['stakePool'],
    IdlTypes<CardinalRewardsCenter>
  > & { type: string }
}
