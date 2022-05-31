import type { Wallet } from '@saberhq/solana-contrib'
import {
  ConfirmOptions,
  Connection,
  sendAndConfirmRawTransaction,
  SendTransactionError,
  Signer,
  Transaction,
} from '@solana/web3.js'

export const executeAllTransactions = async (
  connection: Connection,
  wallet: Wallet,
  transactions: Transaction[],
  config: {
    silent?: boolean
    signers?: Signer[]
    confirmOptions?: ConfirmOptions
    callback?: (success: boolean) => void
  }
) => {
  await Promise.all(
    transactions.map(async (transaction) => {
      transaction.feePayer = wallet.publicKey
      transaction.recentBlockhash = (
        await connection.getRecentBlockhash('max')
      ).blockhash
    })
  )

  await wallet.signAllTransactions(transactions)

  const txIds = await Promise.all(
    transactions.map(async (transaction) => {
      try {
        if (config.signers && config.signers.length > 0) {
          transaction.partialSign(...config.signers)
        }
        const promise = sendAndConfirmRawTransaction(
          connection,
          transaction.serialize(),
          config.confirmOptions
        )
        config.callback && config.callback(true)
        return promise
      } catch (e: unknown) {
        console.log('Failed transaction: ', (e as SendTransactionError).logs, e)
        config.callback && config.callback(false)
        if (!config.silent) {
          throw e
        }
      }
    })
  )
  console.log('Successful transactions', txIds)
  return txIds
}
