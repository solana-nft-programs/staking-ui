import { handleError } from '@cardinal/staking'
import type { Wallet } from '@saberhq/solana-contrib'
import {
  ConfirmOptions,
  Connection,
  sendAndConfirmRawTransaction,
  SendTransactionError,
  Signer,
  Transaction,
} from '@solana/web3.js'
import { notify } from 'common/Notification'

export const executeAllTransactions = async (
  connection: Connection,
  wallet: Wallet,
  transactions: Transaction[],
  config: {
    throwIndividualError?: boolean
    signers?: Signer[][]
    confirmOptions?: ConfirmOptions
    notificationConfig?: {
      individualSuccesses?: boolean
      successSummary?: boolean
      message?: string
      errorMessage?: string
      description?: string
    }
    callback?: (success: boolean) => void
  }
): Promise<(string | null)[]> => {
  if (transactions.length === 0) return []

  const recentBlockhash = (await connection.getRecentBlockhash('max')).blockhash
  for (let tx of transactions) {
    tx.feePayer = wallet.publicKey
    tx.recentBlockhash = recentBlockhash
  }
  await wallet.signAllTransactions(transactions)

  const txIds = await Promise.all(
    transactions.map(async (tx, index) => {
      try {
        if (
          config.signers &&
          config.signers.length > 0 &&
          config.signers[index]
        ) {
          tx.partialSign(...config.signers[index]!)
        }
        const txid = await sendAndConfirmRawTransaction(
          connection,
          tx.serialize(),
          config.confirmOptions
        )
        config.notificationConfig &&
          config.notificationConfig.individualSuccesses &&
          notify({
            message: `${config.notificationConfig.message} ${index + 1}/${
              transactions.length
            }`,
            description: config.notificationConfig.message,
            txid,
          })
        return txid
      } catch (e) {
        console.log('Failed transaction: ', (e as SendTransactionError).logs, e)
        config.notificationConfig &&
          notify({
            message: `${
              config.notificationConfig.errorMessage ?? 'Failed transaction'
            } ${index + 1}/${transactions.length}`,
            description: handleError(e, `Transaction failed: ${e}`),
            txid: '',
            type: 'error',
          })
        if (config.throwIndividualError) throw new Error(`${e}`)
        return null
      }
    })
  )
  console.log('Successful txs', txIds)
  const successfulTxids = txIds.filter((txid) => txid)
  config.notificationConfig &&
    successfulTxids.length > 0 &&
    notify({
      message: `${config.notificationConfig.message} ${successfulTxids.length}/${transactions.length}`,
      description: config.notificationConfig.description,
      // Consider linking all transactions
      txid: '',
    })
  config.callback && config.callback(true)
  return txIds
}
