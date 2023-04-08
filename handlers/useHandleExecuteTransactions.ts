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
      setFailedTxIxs,
      setSuccessfulTxIxs,
    }: {
      transactions: Transaction[]
      setFailedTxIxs: Dispatch<SetStateAction<number[]>>
      setSuccessfulTxIxs: Dispatch<SetStateAction<number[]>>
    }): Promise<(string | null)[]> => {
      if (!wallet.publicKey) throw 'Wallet is not connected'
      const allTxids = []
      const recentBlockhash = (await connection.getRecentBlockhash('max'))
        .blockhash
      const unsignedTransactions: Transaction[] = transactions.map((tx) => {
        tx.feePayer = wallet.publicKey
        tx.recentBlockhash = recentBlockhash
        return tx
      })
      const signedTransactions = await wallet.signAllTransactions(
        unsignedTransactions
      )

      const txChunks = chunkArray(signedTransactions, BATCH_SIZE)
      const failedTxIxs: number[] = []
      const successfulTxIxs: number[] = []
      for (let i = 0; i < txChunks.length; i++) {
        const txs = txChunks[i]!
        const txids = await Promise.all(
          txs.map(async (tx, j) => {
            const txix = i * BATCH_SIZE + j
            try {
              const txid = await sendAndConfirmRawTransaction(
                connection,
                tx.serialize()
              )
              successfulTxIxs.push(txix)
              return txid
            } catch (e) {
              failedTxIxs.push(txix)
              console.log('e', e)
              return null
            }
          })
        )
        allTxids.push(...txids)
      }

      setFailedTxIxs((v) => [...v, ...failedTxIxs])
      setSuccessfulTxIxs((v) => [...v, ...successfulTxIxs])
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
