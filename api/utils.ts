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
): Promise<string> => {
  let txid = ''
  try {
    for (let tx of transactions) {
      tx.feePayer = wallet.publicKey
      tx.recentBlockhash = (
        await connection.getRecentBlockhash('max')
      ).blockhash
    }
    await wallet.signAllTransactions(transactions)
    for (let tx of transactions) {
      if (config.signers && config.signers.length > 0) {
        tx.partialSign(...config.signers)
      }
      txid = await sendAndConfirmRawTransaction(
        connection,
        tx.serialize(),
        config.confirmOptions
      )
      config.callback && config.callback(true)
      console.log('Successful tx', txid)
    }
  } catch (e: unknown) {
    console.log('Failed transaction: ', (e as SendTransactionError).logs, e)
    config.callback && config.callback(false)
    if (!config.silent) {
      throw e
    }
  }
  return txid
}
