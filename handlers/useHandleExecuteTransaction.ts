import { useWallet } from '@solana/wallet-adapter-react'
import type { SendTransactionError, Transaction } from '@solana/web3.js'
import { sendAndConfirmRawTransaction } from '@solana/web3.js'
import { notify } from 'common/Notification'
import { asWallet } from 'common/Wallets'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useMutation } from 'react-query'

export const useHandleExecuteTransaction = () => {
  const wallet = asWallet(useWallet())
  const { connection } = useEnvironmentCtx()
  return useMutation(
    async ({ transaction }: { transaction: Transaction }): Promise<string> => {
      const recentBlockhash = (await connection.getRecentBlockhash('max'))
        .blockhash
      transaction.feePayer = wallet.publicKey
      transaction.recentBlockhash = recentBlockhash
      await wallet.signTransaction(transaction)
      const txid = await sendAndConfirmRawTransaction(
        connection,
        transaction.serialize(),
        {
          commitment: 'confirmed',
        }
      )
      return txid
    },
    {
      onSuccess: (txid) => {
        notify({
          message: `Successful transactions`,
          txid: txid,
        })
      },
      onError: (e) => {
        console.log(e)
        const logs =
          (e as SendTransactionError)?.logs ?? [
            (e as SendTransactionError)?.message,
          ] ?? [(e as Error).toString()] ??
          []
        console.log(logs)
        notify({
          message: `Failed transactions`,
          description: `Transaction failed: ${e}`,
        })
      },
    }
  )
}
