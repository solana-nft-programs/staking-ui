import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useRewardDistributorData } from './useRewardDistributorData'
import * as splToken from '@solana/spl-token'
import { Keypair } from '@solana/web3.js'
import { useQuery } from 'react-query'
import { TokenListData, useTokenList } from './useTokenList'
import { Metadata, MetadataData } from '@metaplex-foundation/mpl-token-metadata'

export const useRewardMintInfo = () => {
  const { secondaryConnection } = useEnvironmentCtx()
  const { data: tokenList } = useTokenList()
  const { data: rewardDistibutorData } = useRewardDistributorData()
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
      rewardDistibutorData?.pubkey?.toString(),
      tokenList?.length,
    ],
    async () => {
      if (!rewardDistibutorData) return

      // tokenListData
      const tokenListData = tokenList?.find(
        (tk) =>
          tk.address === rewardDistibutorData?.parsed.rewardMint.toString()
      )

      // Metaplex metadata
      const metadataId = await Metadata.getPDA(
        rewardDistibutorData.parsed.rewardMint
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
        rewardDistibutorData.parsed.rewardMint,
        splToken.TOKEN_PROGRAM_ID,
        Keypair.generate() // not used
      )
      const mintInfo = await rewardMint.getMintInfo()
      return {
        mintInfo,
        tokenListData,
        metaplexMintData,
      }
    }
  )
}
