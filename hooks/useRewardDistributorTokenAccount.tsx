import { findAta } from '@cardinal/common'
import * as splToken from '@solana/spl-token'
import { Keypair } from '@solana/web3.js'
import { REWARD_QUERY_KEY } from 'handlers/useHandleClaimRewards'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useQuery } from 'react-query'

import { useRewardDistributorData } from './useRewardDistributorData'

export const useRewardDistributorTokenAccount = () => {
  const rewardDistibutorData = useRewardDistributorData()
  const { secondaryConnection } = useEnvironmentCtx()
  return useQuery<splToken.AccountInfo | undefined>(
    [
      REWARD_QUERY_KEY,
      'useRewardDistributorTokenAccount',
      rewardDistibutorData?.data?.pubkey?.toString(),
    ],
    async () => {
      if (!rewardDistibutorData.data) return
      const rewardDistributorTokenAccount = await findAta(
        rewardDistibutorData.data.parsed.rewardMint,
        rewardDistibutorData.data.pubkey,
        true
      )
      const rewardMint = new splToken.Token(
        secondaryConnection,
        rewardDistibutorData.data.parsed.rewardMint,
        splToken.TOKEN_PROGRAM_ID,
        Keypair.generate() // not used
      )
      return await rewardMint.getAccountInfo(rewardDistributorTokenAccount)
    },
    { enabled: !!rewardDistibutorData.data }
  )
}
