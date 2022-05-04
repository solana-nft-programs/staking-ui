import { useDataHook } from './useDataHook'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useRewardDistributorData } from './useRewardDistributorData'
import * as splToken from '@solana/spl-token'
import { Keypair } from '@solana/web3.js'
import { TokenListData, useTokenList } from 'providers/TokenListProvider'

export const useRewardMintInfo = () => {
  const { connection } = useEnvironmentCtx()
  const { tokenList } = useTokenList()
  const { data: rewardDistibutorData } = useRewardDistributorData()
  return useDataHook<
    | { mintInfo: splToken.MintInfo; tokenListData: TokenListData | undefined }
    | undefined
  >(
    async () => {
      if (!rewardDistibutorData) return
      const tokenListData = tokenList.find(
        (tk) =>
          tk.address === rewardDistibutorData?.parsed.rewardMint.toString()
      )
      const rewardMint = new splToken.Token(
        connection,
        rewardDistibutorData.parsed.rewardMint,
        splToken.TOKEN_PROGRAM_ID,
        Keypair.generate() // not used
      )
      const mintInfo = await rewardMint.getMintInfo()
      return {
        mintInfo,
        tokenListData,
      }
    },
    [rewardDistibutorData?.pubkey?.toString(), tokenList],
    { name: 'rewardDistributorTokenAccount' }
  )
}
