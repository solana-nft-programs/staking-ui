import { chunkArray, findMintMetadataId } from '@solana-nft-programs/common'
import {
  BASIS_POINTS_DIVISOR,
  fetchIdlAccountDataById,
  findStakeEntryId,
  remainingAccountsForAuthorization,
  rewardsCenterProgram,
} from '@solana-nft-programs/rewards-center'
import { BN } from '@coral-xyz/anchor'
import { useWallet } from '@solana/wallet-adapter-react'
import type { PublicKey } from '@solana/web3.js'
import { SystemProgram, Transaction } from '@solana/web3.js'
import { notify } from 'common/Notification'
import { asWallet } from 'common/Wallets'
import { useMutation } from 'react-query'

import { isStakePoolV2, useStakePoolData } from '../hooks/useStakePoolData'
import { useEnvironmentCtx } from '../providers/EnvironmentProvider'

export const useGenerateStakeEntryMultiplierTxs = () => {
  const wallet = asWallet(useWallet())
  const { connection } = useEnvironmentCtx()
  const stakePool = useStakePoolData()
  return useMutation(
    async ({
      entryDatas,
      batchSize = 3,
    }: {
      entryDatas: { mintId: PublicKey; multiplierBasisPoints: number }[]
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

      console.log(`\n1/3 Fetching data...`)
      const stakeEntriesById = await fetchIdlAccountDataById(
        connection,
        chunkData.map((i) => i.stakeEntryId)
      )

      console.log(`\n2/3 Building transactions...`)
      const txs = []
      const chunks = chunkArray(chunkData, batchSize)
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i]!
        const tx = new Transaction()
        console.log(`> ${i}/${chunks.length}`)
        for (let j = 0; j < chunk.length; j++) {
          const { mintId, stakeEntryId, multiplierBasisPoints } = chunk[j]!
          console.log(`>>[${j}/${chunk.length}] ${mintId.toString()}`)
          const stakeEntry = stakeEntriesById[stakeEntryId.toString()]
          if (!stakeEntry?.parsed) {
            const authorizationAccounts = remainingAccountsForAuthorization(
              stakePool.data,
              mintId,
              // assuming its either using requires authorization or creators/collections but not both to avoid looking up the metadata
              null
            )
            const ix = await rewardsCenterProgram(connection, wallet)
              .methods.initEntry(wallet.publicKey)
              .accountsStrict({
                stakeEntry: stakeEntryId,
                stakePool: stakePoolId,
                stakeMint: mintId,
                stakeMintMetadata: findMintMetadataId(mintId),
                payer: wallet.publicKey,
                systemProgram: SystemProgram.programId,
              })
              .remainingAccounts(authorizationAccounts)
              .instruction()
            tx.add(ix)
            console.log(
              `>>[${i + 1}/${chunks.length}][${j + 1}/${
                chunk.length
              }] 1. initEntry`
            )
          }

          if (
            !stakeEntry ||
            (stakeEntry.type === 'stakeEntry' &&
              stakeEntry.parsed.multiplierBasisPoints?.toNumber() !==
                multiplierBasisPoints)
          ) {
            const ix = await rewardsCenterProgram(connection, wallet)
              .methods.setStakeEntryMultiplier(new BN(multiplierBasisPoints))
              .accountsStrict({
                stakeEntry: stakeEntryId,
                stakePool: stakePoolId,
                authority: wallet.publicKey,
              })
              .instruction()
            tx.add(ix)
            console.log(
              `>>[${i + 1}/${chunks.length}][${j + 1}/${chunk.length}] 2. ${
                stakeEntry?.parsed.multiplierBasisPoints
                  ? stakeEntry?.parsed.multiplierBasisPoints.toNumber() /
                    BASIS_POINTS_DIVISOR
                  : 'N/A'
              } ==> ${multiplierBasisPoints / BASIS_POINTS_DIVISOR}`
            )
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
            message: 'No multipliers to update',
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
