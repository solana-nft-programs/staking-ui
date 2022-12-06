import type {
  CardinalRewardsCenter,
  IdlAccountData,
} from '@cardinal/rewards-center'
import type { StakePoolData } from '@cardinal/staking/dist/cjs/programs/stakePool'
import type {
  AllAccountsMap,
  IdlTypes,
  TypeDef,
} from '@project-serum/anchor/dist/cjs/program/namespace/types'
import { PublicKey } from '@solana/web3.js'
import { useStakePoolId } from 'hooks/useStakePoolId'
import { useQuery } from 'react-query'

import { useStakePoolDataV1 } from './useStakePoolDataV1'
import { useStakePoolDataV2 } from './useStakePoolDataV2'

export const useStakePoolData = () => {
  const stakePoolId = useStakePoolId()
  const stakePoolDataV1 = useStakePoolDataV1()
  const stakePoolDataV2 = useStakePoolDataV2()

  return useQuery<
    Pick<IdlAccountData<'stakePool'>, 'pubkey' | 'parsed'> | undefined
  >(
    ['stakePoolData', stakePoolId?.toString()],
    async () => {
      if (!stakePoolId) return
      if (stakePoolDataV1.data) {
        return {
          pubkey: stakePoolId,
          parsed: stakePoolDataToV2(stakePoolDataV1.data.parsed),
        }
      }
      return stakePoolDataV2.data
    },
    {
      enabled: !!stakePoolDataV1.isFetched && !!stakePoolDataV2.isFetched,
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
): boolean => stakePoolData.type === 'v2'

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
  return stakePoolData as TypeDef<
    AllAccountsMap<CardinalRewardsCenter>['stakePool'],
    IdlTypes<CardinalRewardsCenter>
  > & { type: 'v2' }
}
