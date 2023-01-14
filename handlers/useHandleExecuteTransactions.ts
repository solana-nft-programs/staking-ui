import { useWallet } from '@solana/wallet-adapter-react'
import type { Transaction } from '@solana/web3.js'
import { sendAndConfirmRawTransaction } from '@solana/web3.js'
import { notify } from 'common/Notification'
import { asWallet } from 'common/Wallets'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useMutation } from 'react-query'

const BATCH_SIZE = 100

export const chunkArray = (arr: any[], size: number): any[][] =>
  arr.length > size
    ? [arr.slice(0, size), ...chunkArray(arr.slice(size), size)]
    : [arr]

export const useHandleExecuteTransactions = () => {
  const wallet = asWallet(useWallet())
  const { connection } = useEnvironmentCtx()
  return useMutation(
    async ({
      transactions,
    }: {
      transactions: Transaction[]
    }): Promise<(string | null)[]> => {
      const chunks = chunkArray(transactions, BATCH_SIZE)
      const allTxids = []
      for (let i = 0; i < chunks.length; i++) {
        const txs = chunks[i]!
        const recentBlockhash = (await connection.getRecentBlockhash('max'))
          .blockhash
        for (const tx of txs) {
          tx.feePayer = wallet.publicKey
          tx.recentBlockhash = recentBlockhash
        }
        await wallet.signAllTransactions(txs)
        const txids = await Promise.all(
          txs.map((tx, j) =>
            sendAndConfirmRawTransaction(connection, tx.serialize(), {
              commitment: 'confirmed',
            }).catch((e) => {
              notify({
                message: `${'Failed transaction'} ${j + i * BATCH_SIZE}/${
                  transactions.length
                }`,
                description: `Transaction failed: ${e}`,
                txid: '',
                type: 'error',
              })
              return null
            })
          )
        )
        allTxids.push(...txids)
      }

      notify({
        message: `${'Successful transactions'} ${
          allTxids.filter((txid) => !!txid).length
        }/${transactions.length}`,
        txid: '',
      })
      return allTxids
    }
  )
}
