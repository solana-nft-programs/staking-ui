import { findMintMetadataId } from '@cardinal/common'
import { Metadata } from '@metaplex-foundation/mpl-token-metadata'
import type { Mint } from '@solana/spl-token'
import { getMint } from '@solana/spl-token'
import { useQuery } from '@tanstack/react-query'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'

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
        metaplexMintData: Metadata | undefined
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
      const metadataId = findMintMetadataId(
        rewardDistibutor.data.parsed.rewardMint
      )
      const accountInfo = await secondaryConnection.getAccountInfo(metadataId)
      let metaplexMintData: Metadata | undefined
      try {
        if (accountInfo) {
          metaplexMintData = Metadata.deserialize(accountInfo?.data)[0]
        }
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
