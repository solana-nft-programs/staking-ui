import { executeTransaction } from '@cardinal/staking'
import { withReclaimFunds } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/transaction'
import { BN } from '@project-serum/anchor'
import { useWallet } from '@solana/wallet-adapter-react'
import { Transaction } from '@solana/web3.js'
import { notify } from 'common/Notification'
import { asWallet } from 'common/Wallets'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { useMutation } from 'react-query'

import { useStakePoolData } from '../hooks/useStakePoolData'
import { useEnvironmentCtx } from '../providers/EnvironmentProvider'

export const useHandleReclaimFunds = () => {
  const wallet = asWallet(useWallet())
  const { connection } = useEnvironmentCtx()
  const stakePool = useStakePoolData()
  const rewardDistributor = useRewardDistributorData()

  return useMutation(
    async ({
      reclaimAmount,
    }: {
      reclaimAmount: string | undefined
    }): Promise<string> => {
      if (!wallet) throw 'Wallet not found'
      if (!stakePool.data) throw 'No stake pool found'
      if (!rewardDistributor.data) throw 'No reward distributor found'
      const transaction = new Transaction()
      await withReclaimFunds(transaction, connection, wallet, {
        stakePoolId: stakePool.data.pubkey,
        amount: new BN(reclaimAmount || 0),
      })
      return executeTransaction(connection, wallet, transaction, {})
    },
    {
      onSuccess: (txid) => {
        notify({
          message: `Successfully reclaimed funds from pool`,
          txid,
          type: 'success',
        })
      },
      onError: (e) => {
        notify({ message: 'Failed to authorize mints', description: `${e}` })
      },
    }
  )
}
