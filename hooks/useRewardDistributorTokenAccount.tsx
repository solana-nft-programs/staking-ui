import { findAta } from '@cardinal/common'
import type { Account } from '@solana/spl-token'
import { getAccount } from '@solana/spl-token'
import { REWARD_QUERY_KEY } from 'handlers/useHandleClaimRewards'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useQuery } from '@tanstack/react-query'

import { useRewardDistributorData } from './useRewardDistributorData'

export const useRewardDistributorTokenAccount = () => {
  const rewardDistibutorData = useRewardDistributorData()
  const { connection } = useEnvironmentCtx()
  return useQuery<Account | undefined>(
    [
      REWARD_QUERY_KEY,
      'useRewardDistributorTokenAccount',
      rewardDistibutorData?.data?.pubkey?.toString(),
    ],
    async () => {
      if (!rewardDistibutorData.data || !rewardDistibutorData.data.parsed)
        return
      const rewardDistributorTokenAccount = await findAta(
        rewardDistibutorData.data.parsed.rewardMint,
        rewardDistibutorData.data.pubkey,
        true
      )
      const account = await getAccount(
        connection,
        rewardDistributorTokenAccount
      )
      return account
    },
    { enabled: !!rewardDistibutorData.data }
  )
}
