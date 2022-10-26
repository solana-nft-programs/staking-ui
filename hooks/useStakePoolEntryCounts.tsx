import { getBatchedMultipleAccounts } from '@cardinal/common'
import type { StatsEntryData } from '@cardinal/stats/dist/cjs/programs/cardinalStats'
import { STATS_IDL } from '@cardinal/stats/dist/cjs/programs/cardinalStats'
import { findStatsEntryId } from '@cardinal/stats/dist/cjs/programs/cardinalStats/pda'
import { BorshAccountsCoder } from '@project-serum/anchor'
import { useQuery } from 'react-query'

import type { StakePoolMetadata } from '../api/mapping'
import { stakePoolMetadatas } from '../api/mapping'
import { useEnvironmentCtx } from '../providers/EnvironmentProvider'
import type { StakePool } from './useAllStakePools'

export const statName = (poolId: string) => {
  return `sp-${poolId.slice(-3)}`
}

export const poolId = (stakePool: StakePool) => {
  return (
    stakePool.stakePoolMetadata?.stakePoolAddress.toString() ??
    stakePool.stakePoolData?.pubkey.toString() ??
    ''
  )
}

export const percentStaked = (
  stakePoolMetadata: StakePoolMetadata | undefined,
  stakePoolEntryCounts: {
    [poolId: string]: number
  },
  minimum = 0
) => {
  return stakePoolMetadata?.maxStaked && stakePoolMetadata?.maxStaked > minimum
    ? ((stakePoolEntryCounts[stakePoolMetadata?.stakePoolAddress.toString()] ??
        0) *
        100) /
        stakePoolMetadata?.maxStaked
    : undefined
}

export const totalStaked = (
  stakePoolMetadata: StakePoolMetadata | undefined,
  stakePoolEntryCounts: {
    [poolId: string]: number
  }
) => {
  return (
    stakePoolEntryCounts[
      stakePoolMetadata?.stakePoolAddress.toString() ?? ''
    ] ?? 0
  )
}

export const compareStakePools = (
  a: StakePool,
  b: StakePool,
  stakePoolEntryCounts: {
    [poolId: string]: number
  }
) => {
  const pctAMin = percentStaked(a.stakePoolMetadata, stakePoolEntryCounts, 100)
  const pctA = percentStaked(a.stakePoolMetadata, stakePoolEntryCounts)
  const pctBMin = percentStaked(b.stakePoolMetadata, stakePoolEntryCounts, 100)
  const pctB = percentStaked(b.stakePoolMetadata, stakePoolEntryCounts)
  const totalA = totalStaked(a.stakePoolMetadata, stakePoolEntryCounts)
  const totalB = totalStaked(b.stakePoolMetadata, stakePoolEntryCounts)
  return pctAMin && pctBMin
    ? pctBMin - pctAMin
    : pctAMin
    ? -1
    : pctBMin
    ? 1
    : pctA
    ? -1
    : pctB
    ? 1
    : totalB - totalA
}

export const useStakePoolEntryCounts = () => {
  const { connection } = useEnvironmentCtx()
  const stakePoolIds = stakePoolMetadatas.map((m) => m.stakePoolAddress)
  return useQuery<{ [poolId: string]: number }>(
    ['useStakePoolEntryCounts', stakePoolIds.map((i) => i?.toString())],
    async () => {
      const statNames = stakePoolIds.map((i) => statName(i.toString()))
      const accountIds = await Promise.all(
        statNames.map(async (s) => (await findStatsEntryId(s))[0])
      )
      const statEntries = await getBatchedMultipleAccounts(
        connection,
        accountIds
      )
      const poolIdToStatValue = statEntries.reduce((acc, accountInfo, i) => {
        const stakePoolId = stakePoolIds[i]!
        try {
          const type = 'statsEntry'
          const coder = new BorshAccountsCoder(STATS_IDL)
          const parsed = coder.decode(
            type,
            accountInfo?.data as Buffer
          ) as StatsEntryData
          acc[stakePoolId.toString()] = parseInt(parsed.value)
        } catch (e) {}
        return acc
      }, {} as { [poolId: string]: number })

      return poolIdToStatValue
    }
  )
}
