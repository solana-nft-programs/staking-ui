import { chunkArray } from '@cardinal/common'
import { useWallet } from '@solana/wallet-adapter-react'
import type { Transaction } from '@solana/web3.js'
import { sendAndConfirmRawTransaction } from '@solana/web3.js'
import { notify } from 'common/Notification'
import { asWallet } from 'common/Wallets'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import type { Dispatch, SetStateAction } from 'react'
import { useMutation } from 'react-query'

const BATCH_SIZE = 50

export const useHandleExecuteTransactions = () => {
  const wallet = asWallet(useWallet())
  const { connection } = useEnvironmentCtx()
  return useMutation(
    async ({
      transactions,
      setFailedTxs,
    }: {
      transactions: Transaction[]
      setFailedTxs: Dispatch<SetStateAction<Transaction[]>>
    }): Promise<(string | null)[]> => {
      if (!wallet.publicKey) throw 'Wallet is not connected'
      let allTxids = []
      const failedTxs: Transaction[] = []

      const unsignedChunks = chunkArray(transactions, BATCH_SIZE)
      const unsignedTransactions: Transaction[] = []
      const recentBlockhash = (await connection.getRecentBlockhash('max'))
        .blockhash
      for (let i = 0; i < unsignedChunks.length; i++) {
        const txs = unsignedChunks[i]!
        for (const tx of txs) {
          tx.feePayer = wallet.publicKey
          tx.recentBlockhash = recentBlockhash
        }
        unsignedTransactions.push(...txs)
      }

      const signedTransactions = await wallet.signAllTransactions(
        unsignedTransactions
      )

      const signedChunks = chunkArray(signedTransactions, BATCH_SIZE)
      for (let i = 0; i < signedChunks.length; i++) {
        const txs = signedChunks[i]!
        const txids = await Promise.all(
          txs.map(async (tx) => {
            try {
              const txid = await sendAndConfirmRawTransaction(
                connection,
                tx.serialize()
              )
              return txid
            } catch (e) {
              failedTxs.push(tx)
              console.log('e', e)
            }
          })
        )
        allTxids.push(...txids)
      }

      setFailedTxs(failedTxs)
      allTxids = allTxids.filter((x): x is string => x !== undefined)
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
