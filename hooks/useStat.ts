import { getStatsEntry } from '@solana-nft-programs/stats/dist/cjs/programs/Stats'
import { useQuery } from '@tanstack/react-query'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'

export type StatName = 'total-active-staked-tokens'

export const useStat = (statName: StatName) => {
  const { connection } = useEnvironmentCtx()
  return useQuery(['useStat', statName], async () => {
    return getStatsEntry(connection, statName)
  })
}
