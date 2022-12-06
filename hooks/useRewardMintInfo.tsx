import { Metadata, MetadataData } from '@metaplex-foundation/mpl-token-metadata'
import * as splToken from '@solana/spl-token'
import { Keypair } from '@solana/web3.js'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useQuery } from 'react-query'

import { useRewardDistributorData } from './useRewardDistributorData'
import type { TokenListData } from './useTokenList'
import { useTokenList } from './useTokenList'

export const useRewardMintInfo = () => {
  const { secondaryConnection } = useEnvironmentCtx()
  const tokenList = useTokenList()
  const rewardDistibutor = useRewardDistributorData()
  return useQuery<
    | {
        mintInfo: splToken.MintInfo
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
      const rewardMint = new splToken.Token(
        secondaryConnection,
        rewardDistibutor.data.parsed.rewardMint,
        splToken.TOKEN_PROGRAM_ID,
        Keypair.generate() // not used
      )
      const mintInfo = await rewardMint.getMintInfo()
      return {
        mintInfo,
        tokenListData,
        metaplexMintData,
      }
    },
    { enabled: tokenList.isFetched && !!rewardDistibutor.data }
  )
}
