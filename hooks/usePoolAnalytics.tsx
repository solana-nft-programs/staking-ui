import { ApolloClient, gql, InMemoryCache } from '@apollo/client'
import type { IdlAccountData } from '@cardinal/rewards-center'
import { rewardsCenterProgram } from '@cardinal/rewards-center'
import { getActiveStakeEntriesForPool } from '@cardinal/staking/dist/cjs/programs/stakePool/accounts'
import { useWallet } from '@solana/wallet-adapter-react'
import type { Connection } from '@solana/web3.js'
import { stakeEntryDataToV2 } from 'api/fetchStakeEntry'
import { asWallet } from 'common/Wallets'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useQuery } from 'react-query'

import { TOKEN_DATAS_KEY } from './useAllowedTokenDatas'
import { isStakePoolV2, useStakePoolData } from './useStakePoolData'
import { useStakePoolMetadata } from './useStakePoolMetadata'

export const usePoolAnalytics = () => {
  const { connection } = useEnvironmentCtx()
  const { data: stakePoolData } = useStakePoolData()
  const { data: stakePoolMetadata } = useStakePoolMetadata()
  const wallet = useWallet()

  return useQuery<{ [trait: string]: number } | undefined>(
    [
      TOKEN_DATAS_KEY,
      'poolAnalytics',
      stakePoolData?.pubkey.toString(),
      stakePoolMetadata,
    ],
    async () => {
      const analyticsData: { [trait: string]: number } = {}
      if (!stakePoolData?.pubkey || !stakePoolMetadata) {
        return analyticsData
      }
      const analytics = stakePoolMetadata.analytics
      if (!analytics) return analyticsData

      const tokensMetadata = await getEntriesMetadataForPool(
        connection,
        asWallet(wallet),
        stakePoolData
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
  wallet: Parameters<typeof rewardsCenterProgram>[1],
  stakePoolData: Pick<IdlAccountData<'stakePool'>, 'pubkey' | 'parsed'>
): Promise<
  {
    address: string
    metadatas_attributes: { trait_type: string; value: string }[]
  }[]
> => {
  let allStakeEntries: Pick<
    IdlAccountData<'stakeEntry'>,
    'pubkey' | 'parsed'
  >[] = []
  if (stakePoolData.pubkey && stakePoolData?.parsed) {
    if (isStakePoolV2(stakePoolData.parsed)) {
      const program = rewardsCenterProgram(connection, wallet)
      const stakeEntries = await program.account.stakeEntry.all([
        {
          memcmp: {
            offset: 11,
            bytes: stakePoolData.pubkey.toString(),
          },
        },
      ])
      allStakeEntries = stakeEntries.map((e) => {
        return { pubkey: e.publicKey, parsed: e.account }
      })
    } else {
      allStakeEntries = (
        await getActiveStakeEntriesForPool(connection, stakePoolData?.pubkey)
      ).map((entry) => {
        return {
          pubkey: entry.pubkey,
          parsed: stakeEntryDataToV2(entry.parsed),
        }
      })
    }
  }
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
                      .map((se) => `"${se.parsed?.stakeMint.toString()}"`)
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
