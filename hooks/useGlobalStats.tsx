import { ApolloClient, gql, InMemoryCache } from '@apollo/client'
import { getStatsEntry } from '@cardinal/stats/dist/cjs/programs/cardinalStats'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useQuery } from 'react-query'

export const useGlobalStats = () => {
  const { connection } = useEnvironmentCtx()
  const index = new ApolloClient({
    uri: 'https://index.cardinal.so/v1/graphql',
    cache: new InMemoryCache({ resultCaching: false }),
  })

  return useQuery<
    | {
        [name in GlobalStatsId]: { value: number }
      }
    | undefined
  >(['useGlobalStats'], async () => {
    const [queryResult, statsEntry] = await Promise.all([
      index.query({
        query: gql`
          query GetTokenManagers {
            q1: acc_vpw38d6rgx7qv1vnrlqo_aggregate(
              where: {
                lastStaker: { _neq: "11111111111111111111111111111111" }
              }
            ) {
              aggregate {
                count
              }
            }
            q2: acc_k0u6qbqshnoizi7cayzl_aggregate {
              aggregate {
                count
              }
            }
          }
        `,
      }),
      getStatsEntry(connection, 'total-active-staked-tokens'),
    ])
    const queryData = queryResult.data as {
      q1?: { aggregate?: { count?: number } }
      q2?: { aggregate?: { count?: number } }
    }
    return {
      'total-active-staked-tokens': {
        value: Number(statsEntry.parsed.value ?? 0),
      },
      'total-active-stake-entries': {
        value: queryData.q1?.aggregate?.count ?? 0,
      },
      'total-stake-pools': { value: queryData.q2?.aggregate?.count ?? 0 },
    }
  })
}

export type GlobalStatsId =
  | 'total-active-staked-tokens'
  | 'total-active-stake-entries'
  | 'total-stake-pools'
export const statsNameMapping: {
  key: GlobalStatsId
  displayName: string
}[] = [
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
