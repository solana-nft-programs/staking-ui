import { ApolloClient, gql, InMemoryCache } from '@apollo/client'
import { useQuery } from 'react-query'

import type { StakePoolMetadata } from '../api/mapping'
import { stakePoolMetadatas } from '../api/mapping'
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
  const index = new ApolloClient({
    uri: 'https://index.cardinal.so/v1/graphql',
    cache: new InMemoryCache({ resultCaching: false }),
  })

  const stakePoolIds = stakePoolMetadatas.map((m) => m.stakePoolAddress)
  return useQuery<{ [poolId: string]: number }>(
    ['useStakePoolEntryCounts', stakePoolIds.map((i) => i?.toString())],
    async () => {
      const queryResult = await index.query({
        query: gql`
          query GetStakePoolTotals {
            q1: acc_k0u6qbqshnoizi7cayzl {
              totalStaked
              pubkey
            }
            q2: acc_o5zqddeady2fcbezcoee {
              totalStaked
              pubkey
            }
          }
        `,
      })
      const queryData = queryResult.data as
        | {
            q1: [
              {
                totalStaked: number
                pubkey: string
              }
            ]
            q2: [
              {
                totalStaked: number
                pubkey: string
              }
            ]
          }
        | undefined

      return (
        (queryData ? [...queryData?.q1, ...queryData.q2] : [])?.reduce(
          (acc, { totalStaked, pubkey }) => {
            acc[pubkey] = totalStaked
            return acc
          },
          {} as { [poolId: string]: number }
        ) ?? {}
      )
    }
  )
}
