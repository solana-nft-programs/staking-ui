import { rewardsCenterProgram } from '@cardinal/rewards-center'
import { executeTransaction } from '@cardinal/staking'
import { withCloseStakePool } from '@cardinal/staking/dist/cjs/programs/stakePool/transaction'
import { useWallet } from '@solana/wallet-adapter-react'
import { Transaction } from '@solana/web3.js'
import { notify } from 'common/Notification'
import { asWallet } from 'common/Wallets'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { useMutation } from 'react-query'

import { isStakePoolV2, useStakePoolData } from '../hooks/useStakePoolData'
import { useEnvironmentCtx } from '../providers/EnvironmentProvider'

export const useHandleStakePoolRemove = () => {
  const wallet = asWallet(useWallet())
  const { connection } = useEnvironmentCtx()
  const stakePool = useStakePoolData()
  const rewardDistributor = useRewardDistributorData()

  return useMutation(
    async (): Promise<string> => {
      if (!wallet) throw 'Wallet not found'
      if (!stakePool.data || !stakePool.data.parsed) throw 'No stake pool found'
      if (rewardDistributor.data?.parsed)
        throw 'Reward distributor must be removed first'

      const transaction = new Transaction()
      if (isStakePoolV2(stakePool.data.parsed)) {
        const program = rewardsCenterProgram(connection, wallet)
        const ix = await program.methods
          .closeStakePool()
          .accounts({
            stakePool: stakePool.data.pubkey,
            authority: wallet.publicKey,
          })
          .instruction()
        transaction.add(ix)
      } else {
        await withCloseStakePool(transaction, connection, wallet, {
          stakePoolId: stakePool.data.pubkey,
        })
      }
      return executeTransaction(connection, wallet, transaction, {})
    },
    {
      onSuccess: (txid) => {
        notify({
          message: `Successfully closed stake pool`,
          txid,
          type: 'success',
        })
        rewardDistributor.refetch()
        stakePool.refetch()
      },
      onError: (e) => {
        notify({
          message: 'Failed to close stake pool',
          description: `${e}`,
        })
      },
    }
  )
}
