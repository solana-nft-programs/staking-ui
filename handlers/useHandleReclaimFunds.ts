import { findAta, withFindOrInitAssociatedTokenAccount } from '@cardinal/common'
import { rewardsCenterProgram } from '@cardinal/rewards-center'
import { executeTransaction } from '@cardinal/staking'
import { withReclaimFunds } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/transaction'
import { BN } from '@project-serum/anchor'
import { useWallet } from '@solana/wallet-adapter-react'
import { Transaction } from '@solana/web3.js'
import { notify } from 'common/Notification'
import { asWallet } from 'common/Wallets'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { useMutation } from 'react-query'
import { TOKEN_PROGRAM_ID } from 'spl-token-v3'

import { isStakePoolV2, useStakePoolData } from '../hooks/useStakePoolData'
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
      if (!stakePool.data || !stakePool.data.parsed) throw 'No stake pool found'
      if (!rewardDistributor.data) throw 'No reward distributor found'

      const transaction = new Transaction()
      if (isStakePoolV2(stakePool.data.parsed)) {
        const rewardDistributorTokenAccount = await findAta(
          rewardDistributor.data.parsed.rewardMint,
          rewardDistributor.data.pubkey,
          true
        )
        const authorityTokenAccount =
          await withFindOrInitAssociatedTokenAccount(
            transaction,
            connection,
            rewardDistributor.data.parsed.rewardMint,
            wallet.publicKey,
            wallet.publicKey,
            true
          )
        const program = rewardsCenterProgram(connection, wallet)
        const ix = await program.methods
          .reclaimFunds(new BN(reclaimAmount || 0))
          .accounts({
            rewardDistributor: rewardDistributor.data.pubkey,
            rewardDistributorTokenAccount: rewardDistributorTokenAccount,
            authorityTokenAccount: authorityTokenAccount,
            authority: wallet.publicKey,
            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .instruction()
        transaction.add(ix)
      } else {
        await withReclaimFunds(transaction, connection, wallet, {
          stakePoolId: stakePool.data.pubkey,
          amount: new BN(reclaimAmount || 0),
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
