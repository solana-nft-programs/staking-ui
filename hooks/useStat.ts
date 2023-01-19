import { getStatsEntry } from '@cardinal/stats/dist/cjs/programs/cardinalStats'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useQuery } from 'react-query'

export type StatName = 'total-active-staked-tokens'

export const useStat = (statName: StatName) => {
  const { connection } = useEnvironmentCtx()
  return useQuery(['useStat', statName], async () => {
    return getStatsEntry(connection, statName)
  })
}
