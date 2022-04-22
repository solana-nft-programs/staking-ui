import { useDataHook } from './useDataHook'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { findAta } from '@cardinal/common'
import { useRewardDistributorData } from './useRewardDistributorData'
import * as splToken from '@solana/spl-token'
import { Keypair } from '@solana/web3.js'

export const useRewardDistributorTokenAccount = () => {
  const rewardDistibutorData = useRewardDistributorData()
  const { connection } = useEnvironmentCtx()
  return useDataHook<splToken.AccountInfo | undefined>(
    async () => {
      if (!rewardDistibutorData.data) return
      const rewardDistributorTokenAccount = await findAta(
        rewardDistibutorData.data.parsed.rewardMint,
        rewardDistibutorData.data.pubkey,
        true
      )
      const rewardMint = new splToken.Token(
        connection,
        rewardDistibutorData.data.parsed.rewardMint,
        splToken.TOKEN_PROGRAM_ID,
        Keypair.generate() // not used
      )
      return await rewardMint.getAccountInfo(rewardDistributorTokenAccount)
    },
    [rewardDistibutorData?.data?.pubkey?.toString()],
    { name: 'rewardDistributorTokenAccount' }
  )
}
