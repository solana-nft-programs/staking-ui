import { Metadata, MetadataData } from '@metaplex-foundation/mpl-token-metadata'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useQuery } from 'react-query'
import type { Mint } from 'spl-token-v3'
import { getMint } from 'spl-token-v3'

import { useRewardDistributorData } from './useRewardDistributorData'
import type { TokenListData } from './useTokenList'
import { useTokenList } from './useTokenList'

export const useRewardMintInfo = () => {
  const { secondaryConnection } = useEnvironmentCtx()
  const tokenList = useTokenList()
  const rewardDistibutor = useRewardDistributorData()
  return useQuery<
    | {
        mintInfo: Mint
        tokenListData: TokenListData | undefined
        metaplexMintData: MetadataData | undefined
      }
    | undefined
  >(
    [
      'useRewardMintInfo',
      rewardDistibutor.data?.pubkey?.toString(),
      tokenList.data?.length,
    ],
    async () => {
      if (!rewardDistibutor.data || !rewardDistibutor.data.parsed?.rewardMint)
        return

      // tokenListData
      const tokenListData = tokenList.data?.find(
        (tk) =>
          tk.address === rewardDistibutor.data?.parsed?.rewardMint.toString()
      )

      // Metaplex metadata
      const metadataId = await Metadata.getPDA(
        rewardDistibutor.data.parsed.rewardMint
      )
      const accountInfo = await secondaryConnection.getAccountInfo(metadataId)
      let metaplexMintData: MetadataData | undefined
      try {
        metaplexMintData = MetadataData.deserialize(
          accountInfo?.data as Buffer
        ) as MetadataData
      } catch (e) {}

      // Mint info
      const mintInfo = await getMint(
        secondaryConnection,
        rewardDistibutor.data.parsed.rewardMint
      )
      return {
        mintInfo,
        tokenListData,
        metaplexMintData,
      }
    },
    { enabled: tokenList.isFetched && !!rewardDistibutor.data }
  )
}
