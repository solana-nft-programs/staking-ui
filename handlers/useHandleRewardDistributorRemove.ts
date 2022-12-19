import { withFindOrInitAssociatedTokenAccount } from '@cardinal/common'
import { rewardsCenterProgram } from '@cardinal/rewards-center'
import { executeTransaction } from '@cardinal/staking'
import { withCloseRewardDistributor } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/transaction'
import { useWallet } from '@solana/wallet-adapter-react'
import { Transaction } from '@solana/web3.js'
import { notify } from 'common/Notification'
import { asWallet } from 'common/Wallets'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { useMutation } from 'react-query'
import { TOKEN_PROGRAM_ID } from 'spl-token-v3'

import { isStakePoolV2, useStakePoolData } from '../hooks/useStakePoolData'
import { useEnvironmentCtx } from '../providers/EnvironmentProvider'

export const useHandleRewardDistributorRemove = () => {
  const wallet = asWallet(useWallet())
  const { connection } = useEnvironmentCtx()
  const stakePool = useStakePoolData()
  const rewardDistributor = useRewardDistributorData()

  return useMutation(
    async (): Promise<string> => {
      if (!wallet) throw 'Wallet not found'
      if (!stakePool.data || !stakePool.data.parsed) throw 'No stake pool found'
      if (!rewardDistributor.data || !rewardDistributor.data.parsed)
        throw 'No reward distributor found'

      const transaction = new Transaction()
      const poolAta = await withFindOrInitAssociatedTokenAccount(
        transaction,
        connection,
        rewardDistributor.data.parsed.rewardMint,
        rewardDistributor.data.pubkey,
        wallet.publicKey,
        true
      )
      const authorityAta = await withFindOrInitAssociatedTokenAccount(
        transaction,
        connection,
        rewardDistributor.data.parsed.rewardMint,
        wallet.publicKey,
        wallet.publicKey,
        true
      )
      if (isStakePoolV2(stakePool.data.parsed)) {
        const program = rewardsCenterProgram(connection, wallet)
        const ix = await program.methods
          .closeRewardDistributor()
          .accounts({
            rewardDistributor: rewardDistributor.data.pubkey,
            stakePool: stakePool.data.pubkey,
            rewardMint: rewardDistributor.data.parsed?.rewardMint,
            rewardDistributorTokenAccount: poolAta,
            authorityTokenAccount: authorityAta,
            signer: wallet.publicKey,
            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .instruction()
        transaction.add(ix)
      } else {
        await withCloseRewardDistributor(transaction, connection, wallet, {
          stakePoolId: stakePool.data.pubkey,
        })
      }
      return executeTransaction(connection, wallet, transaction, {})
    },
    {
      onSuccess: (txid) => {
        notify({
          message: `Successfully reclaimed funds from pool`,
          txid,
          type: 'success',
        })
        rewardDistributor.remove()
        stakePool.refetch()
      },
      onError: (e) => {
        notify({
          message: 'Failed to reclaim funds from pool',
          description: `${e}`,
        })
      },
    }
  )
}
