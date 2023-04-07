import { chunkArray } from '@cardinal/common'
import {
  findStakeEntryId,
  rewardsCenterProgram,
} from '@cardinal/rewards-center'
import { BN } from '@coral-xyz/anchor'
import { useWallet } from '@solana/wallet-adapter-react'
import type { PublicKey } from '@solana/web3.js'
import { Transaction } from '@solana/web3.js'
import { notify } from 'common/Notification'
import { asWallet } from 'common/Wallets'
import { useMutation } from 'react-query'

import { isStakePoolV2, useStakePoolData } from '../hooks/useStakePoolData'
import { useEnvironmentCtx } from '../providers/EnvironmentProvider'

export const useGenerateIncrementMultiplierStakeSecondsTxs = () => {
  const wallet = asWallet(useWallet())
  const { connection } = useEnvironmentCtx()
  const stakePool = useStakePoolData()
  return useMutation(
    async ({
      entryDatas,
      batchSize = 3,
    }: {
      entryDatas: { mintId: PublicKey; multiplierStakeSeconds: number }[]
      batchSize?: number
    }): Promise<Transaction[]> => {
      if (!wallet.publicKey) throw 'Wallet is not connected'
      if (!stakePool.data || !stakePool.data.parsed || !stakePool.data.pubkey) {
        throw 'No stake pool found'
      }
      if (!isStakePoolV2(stakePool.data.parsed)) {
        throw 'Upgrade stake pool version'
      }
      const stakePoolId = stakePool.data.pubkey
      const chunkData = entryDatas.map((e) => ({
        ...e,
        stakeEntryId: findStakeEntryId(stakePoolId, e.mintId),
      }))

      const txs = []
      const chunks = chunkArray(chunkData, batchSize)
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i]!
        const tx = new Transaction()
        console.log(`> ${i}/${chunks.length}`)
        for (let j = 0; j < chunk.length; j++) {
          const { mintId, stakeEntryId, multiplierStakeSeconds } = chunk[j]!
          console.log(`>>[${j}/${chunk.length}] ${mintId.toString()}`)
          const ix = await rewardsCenterProgram(connection, wallet)
            .methods.incrementStakeEntryMultiplierStakeSeconds(
              new BN(multiplierStakeSeconds)
            )
            .accountsStrict({
              stakeEntry: stakeEntryId,
              stakePool: stakePoolId,
              authority: wallet.publicKey,
            })
            .instruction()
          tx.add(ix)
        }
        if (tx.instructions.length > 0) {
          txs.push(tx)
        }
      }

      return txs
    },
    {
      onSuccess: (txs) => {
        if (txs.length === 0) {
          notify({
            message: 'No stake entries to update',
            description: 'All have already been set appropriately.',
          })
        } else {
          notify({
            message: `Successfully generated ${txs.length} transactions`,
          })
        }
      },
      onError: (e) => {
        notify({
          message: 'Failed to generate transactions',
          description: `${e}`,
        })
      },
    }
  )
}
