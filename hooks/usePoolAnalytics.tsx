import { ApolloClient, gql, InMemoryCache } from '@apollo/client'
import { getActiveStakeEntriesForPool } from '@cardinal/staking/dist/cjs/programs/stakePool/accounts'
import type { Connection, PublicKey } from '@solana/web3.js'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useQuery } from 'react-query'

import { TOKEN_DATAS_KEY } from './useAllowedTokenDatas'
import { useStakePoolId } from './useStakePoolId'
import { useStakePoolMetadata } from './useStakePoolMetadata'

export const usePoolAnalytics = () => {
  const { connection } = useEnvironmentCtx()
  const stakePoolId = useStakePoolId()
  const { data: stakePoolMetadata } = useStakePoolMetadata()

  return useQuery<{ [trait: string]: number } | undefined>(
    [
      TOKEN_DATAS_KEY,
      'poolAnalytics',
      stakePoolId?.toString(),
      stakePoolMetadata,
    ],
    async () => {
      const analyticsData: { [trait: string]: number } = {}
      if (!stakePoolId || !stakePoolMetadata) {
        return analyticsData
      }
      const analytics = stakePoolMetadata.analytics
      if (!analytics) return analyticsData

      const tokensMetadata = await getEntriesMetadataForPool(
        connection,
        stakePoolId
      )

      for (const analytic of analytics) {
        if (analytic.metadata) {
          switch (analytic.metadata.type) {
            case 'staked':
              for (const md of tokensMetadata) {
                const foundAttr = md.metadatas_attributes.find(
                  (attr) => attr.trait_type === analytic.metadata?.key
                )
                if (foundAttr) {
                  if (foundAttr.value in analyticsData) {
                    analyticsData[foundAttr.value] += 1
                  } else {
                    analyticsData[foundAttr.value] = 1
                  }
                }
              }
              for (const md of Object.keys(analyticsData)) {
                analyticsData[md] =
                  analyticsData[md]! /
                  (analytic.metadata.totals
                    ? analytic.metadata.totals?.find((data) => data.key === md)
                        ?.value ||
                      stakePoolMetadata.maxStaked ||
                      1
                    : stakePoolMetadata.maxStaked || 1)
              }
              return analyticsData
            default:
              return analyticsData
          }
        } else {
          console.log('No analytics found')
        }
      }
      return analyticsData
    }
  )
}

const getEntriesMetadataForPool = async (
  connection: Connection,
  poolId: PublicKey
): Promise<
  {
    address: string
    metadatas_attributes: { trait_type: string; value: string }[]
  }[]
> => {
  const allStakeEntries = await getActiveStakeEntriesForPool(connection, poolId)
  const indexer = new ApolloClient({
    uri: 'https://prod-holaplex.hasura.app/v1/graphql',
    cache: new InMemoryCache({ resultCaching: false }),
  })
  const aggregateTokensMetadataResponse = await indexer.query({
    query: gql`
          query GetMetadata {
            metadatas(
              where: {
                mint_address: {
                    _in: [${allStakeEntries
                      .map((se) => `"${se.parsed.originalMint.toString()}"`)
                      .join(',')}]
                }
              }
            ) {
                address
                metadatas_attributes {
                    trait_type
                    value
                }
            }
          }
        `,
  })
  const metadata = aggregateTokensMetadataResponse.data['metadatas'] as {
    address: string
    metadatas_attributes: { trait_type: string; value: string }[]
  }[]
  return metadata
}
