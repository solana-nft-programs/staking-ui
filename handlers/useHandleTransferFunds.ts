import {
  executeTransaction,
  withFindOrInitAssociatedTokenAccount,
  withWrapSol,
} from '@cardinal/common'
import {
  createTransferCheckedInstruction,
  getAssociatedTokenAddressSync,
  NATIVE_MINT,
} from '@solana/spl-token'
import { useWallet } from '@solana/wallet-adapter-react'
import { Transaction } from '@solana/web3.js'
import { useMutation } from '@tanstack/react-query'
import { notify } from 'common/Notification'
import { asWallet } from 'common/Wallets'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { useRewardMintInfo } from 'hooks/useRewardMintInfo'

import { useStakePoolData } from '../hooks/useStakePoolData'
import { useEnvironmentCtx } from '../providers/EnvironmentProvider'

export const useHandleTransferFunds = () => {
  const wallet = asWallet(useWallet())
  const { connection } = useEnvironmentCtx()
  const stakePool = useStakePoolData()
  const rewardDistributor = useRewardDistributorData()
  const rewardMintInfo = useRewardMintInfo()

  return useMutation(
    async ({
      transferAmount,
    }: {
      transferAmount: number | undefined
    }): Promise<string> => {
      if (!wallet) throw 'Wallet not found'
      if (!stakePool.data || !stakePool.data.parsed) throw 'No stake pool found'
      if (!rewardDistributor.data || !rewardDistributor.data.parsed)
        throw 'No reward distributor found'
      if (!rewardMintInfo.data) throw 'No reward mint info found'
      if (!transferAmount) throw 'Transfer amount missing'

      const transaction = new Transaction()
      if (
        rewardDistributor.data.parsed.rewardMint.toString() ===
        NATIVE_MINT.toString()
      ) {
        await withWrapSol(transaction, connection, wallet, transferAmount)
      }
      const ownerAtaId = getAssociatedTokenAddressSync(
        rewardDistributor.data.parsed?.rewardMint,
        wallet.publicKey,
        true
      )
      const poolAtaId = await withFindOrInitAssociatedTokenAccount(
        transaction,
        connection,
        rewardDistributor.data.parsed?.rewardMint,
        rewardDistributor.data.pubkey,
        wallet.publicKey,
        true
      )

      transaction.add(
        createTransferCheckedInstruction(
          ownerAtaId,
          rewardDistributor.data.parsed?.rewardMint,
          poolAtaId,
          wallet.publicKey,
          transferAmount,
          rewardMintInfo.data.mintInfo.decimals
        )
      )

      return executeTransaction(connection, transaction, wallet, {})
    },
    {
      onSuccess: (txid) => {
        notify({
          message: `Successfully transferred funds to pool`,
          txid,
          type: 'success',
        })
      },
      onError: (e) => {
        notify({
          message: 'Failed to transfer funds to pool',
          description: `${e}`,
        })
      },
    }
  )
}
