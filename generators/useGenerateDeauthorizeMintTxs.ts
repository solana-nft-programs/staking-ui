import { chunkArray } from '@solana-nft-programs/common'
import {
  fetchIdlAccountDataById,
  findStakeAuthorizationRecordId,
  rewardsCenterProgram,
} from '@solana-nft-programs/rewards-center'
import { findStakeAuthorizationId } from '@solana-nft-programs/staking/dist/cjs/programs/stakePool/pda'
import { withDeauthorizeStakeEntry } from '@solana-nft-programs/staking/dist/cjs/programs/stakePool/transaction'
import { useWallet } from '@solana/wallet-adapter-react'
import type { PublicKey } from '@solana/web3.js'
import { Transaction } from '@solana/web3.js'
import { notify } from 'common/Notification'
import { asWallet } from 'common/Wallets'
import { useMutation } from 'react-query'

import { isStakePoolV2, useStakePoolData } from '../hooks/useStakePoolData'
import { useEnvironmentCtx } from '../providers/EnvironmentProvider'

export const useGenerateDeauthorizeMintTxs = () => {
  const wallet = asWallet(useWallet())
  const { connection } = useEnvironmentCtx()
  const { data: stakePoolData } = useStakePoolData()
  return useMutation(
    async ({
      entryDatas,
      batchSize = 10,
    }: {
      entryDatas: { mintId: PublicKey }[]
      batchSize?: number
    }): Promise<Transaction[]> => {
      console.log('---------')
      if (!wallet.publicKey) throw 'Wallet is not connected'
      if (!stakePoolData?.parsed) throw 'No stake pool found'
      const stakePoolId = stakePoolData.pubkey
      const chunkData = entryDatas.map((e) => ({
        ...e,
        stakeAuthorizationRecordId: isStakePoolV2(stakePoolData.parsed)
          ? findStakeAuthorizationRecordId(stakePoolId, e.mintId)
          : findStakeAuthorizationId(stakePoolId, e.mintId),
      }))

      console.log(`\n1/3 Fetching data...`)
      const accountDataById = await fetchIdlAccountDataById(
        connection,
        chunkData.map((i) => i.stakeAuthorizationRecordId)
      )

      console.log(`\n2/3 Building transactions...`)
      const txs = []
      const chunks = chunkArray(chunkData, batchSize)
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i]!
        const tx = new Transaction()
        console.log(`> ${i}/${chunks.length}`)
        for (let j = 0; j < chunk.length; j++) {
          const { mintId, stakeAuthorizationRecordId } = chunk[j]!
          const stakeAuthorizationRecordInfos =
            accountDataById[stakeAuthorizationRecordId.toString()]
          if (stakeAuthorizationRecordInfos) {
            if (isStakePoolV2(stakePoolData.parsed)) {
              const ix = await rewardsCenterProgram(connection, wallet)
                .methods.deauthorizeMint()
                .accountsStrict({
                  stakePool: stakePoolId,
                  stakeAuthorizationRecord: stakeAuthorizationRecordId,
                  authority: wallet.publicKey,
                })
                .instruction()
              tx.add(ix)
              console.log(`>>[${j}/${chunk.length}] ${mintId.toString()}`)
            } else {
              await withDeauthorizeStakeEntry(tx, connection, wallet, {
                stakePoolId: stakePoolId,
                originalMintId: mintId,
              })
            }
          }
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
            message: 'No mint to update',
            description:
              'All authorizations have already been set appropriately.',
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
