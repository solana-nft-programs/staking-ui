import type { AccountData } from '@cardinal/common'
import type { StatsEntryData } from '@cardinal/stats/dist/cjs/programs/cardinalStats'
import { getStatsEntry } from '@cardinal/stats/dist/cjs/programs/cardinalStats'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useQuery } from 'react-query'

import { useStakePoolId } from './useStakePoolId'

export const useGlobalStats = () => {
  const { secondaryConnection } = useEnvironmentCtx()
  const stakePoolId = useStakePoolId()
  return useQuery<
    | {
        [name: string]: { data: AccountData<StatsEntryData> }
      }
    | undefined
  >(
    ['useStats', stakePoolId?.toString()],
    async () => {
      const statsNames = [
        'total-active-stake-entries',
        'total-active-staked-tokens',
        'total-stake-pools',
      ]
      const statsData = await Promise.all(
        statsNames.map((name) => getStatsEntry(secondaryConnection, name))
      )
      return statsData.reduce(
        (acc, stat) => {
          const displayName = statsNameMapping.find(
            (mapp) => mapp.key === stat.parsed.name
          )!.displayName
          acc[displayName] = { data: stat }
          return acc
        },
        {} as {
          [name: string]: { data: AccountData<StatsEntryData> }
        }
      )
    },
    {
      refetchInterval: 3000,
    }
  )
}

export const statsNameMapping = [
  {
    key: 'total-active-staked-tokens',
    displayName: 'Total Staked Tokens',
  },
  {
    key: 'total-active-stake-entries',
    displayName: 'Total Staked NFTs',
  },
  {
    key: 'total-stake-pools',
    displayName: 'Total Stake Pools',
  },
]
