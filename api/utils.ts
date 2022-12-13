import type { Wallet } from '@saberhq/solana-contrib'
import * as spl from '@solana/spl-token'
import type {
  AccountInfo,
  ConfirmOptions,
  Connection,
  ParsedAccountData,
  SendTransactionError,
  Signer,
  Transaction,
} from '@solana/web3.js'
import { PublicKey, sendAndConfirmRawTransaction } from '@solana/web3.js'
import { handleError } from 'common/errors'
import { notify } from 'common/Notification'

export const executeAllTransactions = async (
  connection: Connection,
  wallet: Wallet,
  txs: Transaction[],
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
  },
  preTx?: Transaction
): Promise<(string | null)[]> => {
  const transactions = preTx ? [preTx, ...txs] : txs
  if (transactions.length === 0) return []

  const recentBlockhash = (await connection.getRecentBlockhash('max')).blockhash
  for (const tx of transactions) {
    tx.feePayer = wallet.publicKey
    tx.recentBlockhash = recentBlockhash
  }
  await wallet.signAllTransactions(transactions)

  let txIds: string[] = []
  if (preTx) {
    const txid = await sendAndConfirmRawTransaction(
      connection,
      preTx.serialize(),
      config.confirmOptions
    )
    txIds.push(txid)
  }

  txIds = [
    ...txIds,
    ...(
      await Promise.all(
        txs.map(async (tx, index) => {
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
                message: `${config.notificationConfig.message} ${
                  index + (preTx ? 2 : 1)
                }/${transactions.length}`,
                description: config.notificationConfig.message,
                txid,
              })
            return txid
          } catch (e) {
            console.log(
              'Failed transaction: ',
              (e as SendTransactionError).logs,
              e
            )
            config.notificationConfig &&
              notify({
                message: `${
                  config.notificationConfig.errorMessage ?? 'Failed transaction'
                } ${index + (preTx ? 2 : 1)}/${transactions.length}`,
                description: handleError(e, `Transaction failed: ${e}`),
                txid: '',
                type: 'error',
              })
            if (config.throwIndividualError) throw new Error(`${e}`)
            return null
          }
        })
      )
    ).filter((x): x is string => x !== null),
  ]
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

export const deserializeMintInfo = (
  mintData: AccountInfo<Buffer | ParsedAccountData> | null
): spl.MintInfo | null => {
  if (mintData && mintData?.data && 'parsed' in mintData?.data) {
    const accountData = mintData?.data
    return accountData.parsed?.info as spl.MintInfo
  } else if (
    mintData?.data &&
    'length' in mintData?.data &&
    mintData?.data.length === spl.MintLayout.span
  ) {
    const parsed = spl.MintLayout.decode(mintData?.data)
    if (parsed.mintAuthorityOption === 0) {
      parsed.mintAuthority = null
    } else {
      parsed.mintAuthority = new PublicKey(parsed.mintAuthority)
    }
    parsed.supply = parsed.supply
    parsed.isInitialized = parsed.isInitialized !== 0
    if (parsed.freezeAuthorityOption === 0) {
      parsed.freezeAuthority = null
    } else {
      parsed.freezeAuthority = new PublicKey(parsed.freezeAuthority)
    }
    return parsed as spl.MintInfo
  }
  return null
}
