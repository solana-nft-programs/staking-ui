import { chunkArray, tryNull } from '@cardinal/common'
import { getConfigEntry } from '@cardinal/configs/dist/cjs/programs/accounts'
import { configsProgram } from '@cardinal/configs/dist/cjs/programs/constants'
import { findConfigEntryId } from '@cardinal/configs/dist/cjs/programs/pda'
import { useWallet } from '@solana/wallet-adapter-react'
import {
  sendAndConfirmRawTransaction,
  SystemProgram,
  Transaction,
} from '@solana/web3.js'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { StakePoolMetadata } from 'api/mapping'
import { handleError } from 'common/errors'
import { notify } from 'common/Notification'
import { asWallet } from 'common/Wallets'

import { useStakePoolData } from '../hooks/useStakePoolData'
import { useEnvironmentCtx } from '../providers/EnvironmentProvider'

const CONFIG_VALUE_LIMIT = 790

export const useHandlePoolConfig = () => {
  const wallet = asWallet(useWallet())
  const { connection, environment } = useEnvironmentCtx()
  const stakePool = useStakePoolData()
  const queryClient = useQueryClient()

  return useMutation(
    async ({ config }: { config: StakePoolMetadata }): Promise<string[]> => {
      if (!stakePool.data) throw 'No stake pool data found'
      if (!config.name || config.name === '') throw 'Name is missing'
      if (!wallet || !wallet.publicKey) throw 'Wallet is not connected'
      const program = configsProgram(connection)
      const prefixBuffer = Buffer.from('s', 'utf-8')
      const keyBuffer = Buffer.from(config.name, 'utf-8')
      const reverseKeyBuffer = stakePool.data.pubkey.toBuffer()

      const configEntryId = findConfigEntryId(prefixBuffer, keyBuffer)
      const reverseConfigEntryId = findConfigEntryId(
        prefixBuffer,
        reverseKeyBuffer
      )
      const checkConfigEntry = await tryNull(
        getConfigEntry(connection, prefixBuffer, keyBuffer)
      )

      // reorder
      const { stakePoolAddress: _, ...otherObject } = config
      const configString = JSON.stringify({
        stakePoolAddress: stakePool.data.pubkey.toString(),
        ...otherObject,
      })
      // configString = `Lorem Ipsum is simply dummy textsimply dummy textsimply dummy textsimply dummy textsimplytextsimplytextsimplytextsimplytextsimplytextsimplytextsimplytextsimplytextsimply dummy textsimply dummy textsimply dummy textsimply dummy textsimply dummy textsimply dummy textsimply dummy textsimply dummy textsimply dummy textsimply textsimply textsimply textsimply textsimply textsimply textsimply textsimply textsimply textsimply textsimply textsimply textsimply textsimply textsimpl  of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`
      const configChunks = chunkArray(
        configString.split(''),
        CONFIG_VALUE_LIMIT
      ).map((chunk) => chunk.join(''))

      const txids: string[] = []
      const transactions: Transaction[] = []
      if (!checkConfigEntry?.parsed) {
        const transaction = new Transaction()
        const initIx = await program.methods
          .initConfigEntry({
            prefix: prefixBuffer,
            key: keyBuffer,
            value: configChunks[0]!,
            extends: [],
          })
          .accountsStrict({
            configEntry: configEntryId,
            authority: wallet.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .remainingAccounts([
            {
              pubkey: stakePool.data.pubkey,
              isSigner: false,
              isWritable: false,
            },
          ])
          .instruction()
        const reverseMappingIx = await program.methods
          .initConfigEntry({
            prefix: prefixBuffer,
            key: reverseKeyBuffer,
            value: '',
            extends: [configEntryId],
          })
          .accountsStrict({
            configEntry: reverseConfigEntryId,
            authority: wallet.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .remainingAccounts([
            {
              pubkey: stakePool.data.pubkey,
              isSigner: false,
              isWritable: false,
            },
          ])
          .instruction()
        transaction.instructions = [
          ...transaction.instructions,
          initIx,
          reverseMappingIx,
        ]
        transactions.push(transaction)

        for (let index = 1; index < configChunks.length; index++) {
          const transaction = new Transaction()
          const updateIx = await program.methods
            .updateConfigEntry({
              value: configChunks[index]!,
              extends: [],
              append: true,
            })
            .accountsStrict({
              configEntry: configEntryId,
              authority: wallet.publicKey,
              systemProgram: SystemProgram.programId,
            })
            .remainingAccounts([
              {
                pubkey: stakePool.data.pubkey,
                isSigner: false,
                isWritable: false,
              },
            ])
            .instruction()
          transaction.add(updateIx)
          transactions.push(transaction)
        }
      } else {
        for (let index = 0; index < configChunks.length; index++) {
          const configChunk = configChunks[index]!
          const transaction = new Transaction()
          const updateIx = await program.methods
            .updateConfigEntry({
              value: configChunk,
              extends: [],
              append: !(index === 0),
            })
            .accountsStrict({
              configEntry: configEntryId,
              authority: wallet.publicKey,
              systemProgram: SystemProgram.programId,
            })
            .remainingAccounts([
              {
                pubkey: stakePool.data.pubkey,
                isSigner: false,
                isWritable: false,
              },
            ])
            .instruction()
          transaction.add(updateIx)
          transactions.push(transaction)
        }
      }

      const recentBlockhash = (await connection.getRecentBlockhash('max'))
        .blockhash
      for (const tx of transactions) {
        tx.feePayer = wallet.publicKey
        tx.recentBlockhash = recentBlockhash
      }
      const signedTransactions = await wallet.signAllTransactions(transactions)
      for (const signedTx of signedTransactions) {
        const txid = await sendAndConfirmRawTransaction(
          connection,
          signedTx.serialize()
        )
        txids.push(txid)
      }

      return txids
    },
    {
      onSuccess: (txids) => {
        notify({
          message: 'Success',
          description: `Successfully updated config ${stakePool.data?.pubkey.toString()}`,
          txids: txids,
          cluster: environment.label,
          type: 'success',
        })
        queryClient.resetQueries()
      },
      onError: (e) => {
        if (`${e}`.includes('RangeError') || `${e}`.includes('too large')) {
          notify({
            message: 'Failed to update config',
            description: 'Config is too large',
          })
        } else {
          notify({
            message: 'Failed to update config',
            description: handleError(e, `${e}`),
          })
        }
      },
    }
  )
}
