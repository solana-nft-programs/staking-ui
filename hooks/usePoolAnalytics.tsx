import { useStakePoolId } from './useStakePoolId'
import { useQuery } from 'react-query'
import { useStakePoolMetadata } from './useStakePoolMetadata'
import { getActiveStakeEntriesForPool } from '@cardinal/staking/dist/cjs/programs/stakePool/accounts'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { Metadata, MetadataData } from '@metaplex-foundation/mpl-token-metadata'

export const usePoolAnalytics = () => {
  const stakePoolId = useStakePoolId()
  const { data: stakePoolMetadata } = useStakePoolMetadata()
  const { connection } = useEnvironmentCtx()
  const batchSize = 20

  return useQuery<{ [trait: string]: number } | undefined>(
    ['poolAnalytics', stakePoolId?.toString(), stakePoolMetadata],
    async () => {
      let analyticsData: { [trait: string]: number } = {}
      if (!stakePoolId || !stakePoolMetadata) return analyticsData
      const analytics = stakePoolMetadata.analytics
      if (!analytics) return analyticsData
      const allStakeEntries = await getActiveStakeEntriesForPool(
        connection,
        stakePoolId
      )

      for (const analytic of analytics) {
        if (analytic.metadata) {
          let metadata: { trait_type: string; value: string }[] = []
          for (
            let counter = 0;
            counter < allStakeEntries.length;
            counter += batchSize
          ) {
            const entries = allStakeEntries.slice(
              0,
              Math.min(allStakeEntries.length, batchSize * (counter + 1))
            )
            const metadataIds = await Promise.all(
              entries.map((entry) => Metadata.getPDA(entry.parsed.originalMint))
            )
            const accountInfo = await Promise.all(
              metadataIds
                .map((mdId) => {
                  try {
                    return connection.getAccountInfo(mdId)
                  } catch (e) {
                    return null
                  }
                })
                .filter((m) => !!m)
            )
            const metaplexMintDatas = (
              await Promise.all(
                accountInfo.map((acc) => {
                  try {
                    return MetadataData.deserialize(
                      acc?.data as Buffer
                    ) as MetadataData
                  } catch (e) {
                    return null
                  }
                })
              )
            ).filter((m) => !!m)
            const metadataResponses = await Promise.all(
              metaplexMintDatas.map((m) => fetch(m!.data.uri))
            )
            const jsons = await Promise.all(
              metadataResponses.map((m) => m.json())
            )

            const data = jsons.map((data) =>
              data.attributes.find(
                (attr: { trait_type: string; value: string }) =>
                  attr.trait_type === analytic.metadata?.key
              )
            ) as { trait_type: string; value: string }[]
            metadata = metadata.concat(data)
          }

          switch (analytic.metadata.type) {
            case 'staked':
              for (const md of metadata) {
                if (md.value in analyticsData) {
                  analyticsData[md.value] += 1
                } else {
                  analyticsData[md.value] = 1
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
