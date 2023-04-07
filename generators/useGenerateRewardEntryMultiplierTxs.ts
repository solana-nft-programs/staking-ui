import {
  chunkArray,
  findMintMetadataId,
  tryDecodeIdlAccount,
} from '@cardinal/common'
import type { CardinalRewardsCenter } from '@cardinal/rewards-center'
import {
  fetchIdlAccountDataById,
  findRewardEntryId,
  findStakeEntryId,
  remainingAccountsForAuthorization,
  REWARDS_CENTER_IDL,
  rewardsCenterProgram,
} from '@cardinal/rewards-center'
import * as v1 from '@cardinal/staking'
import {
  withInitRewardEntry,
  withUpdateRewardEntry,
} from '@cardinal/staking/dist/cjs/programs/rewardDistributor/transaction'
import { withInitStakeEntry } from '@cardinal/staking/dist/cjs/programs/stakePool/transaction'
import { BN } from '@coral-xyz/anchor'
import { useWallet } from '@solana/wallet-adapter-react'
import type { PublicKey } from '@solana/web3.js'
import { SystemProgram, Transaction } from '@solana/web3.js'
import { notify } from 'common/Notification'
import { asWallet } from 'common/Wallets'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { useMutation } from 'react-query'

import { isStakePoolV2, useStakePoolData } from '../hooks/useStakePoolData'
import { useEnvironmentCtx } from '../providers/EnvironmentProvider'

export const useGenerateRewardEntryMultiplierTxs = () => {
  const wallet = asWallet(useWallet())
  const { connection } = useEnvironmentCtx()
  const { data: stakePoolData } = useStakePoolData()
  const { data: rewardDistributorData } = useRewardDistributorData()
  return useMutation(
    async ({
      entryDatas,
      batchSize = 1,
    }: {
      entryDatas: { mintId: PublicKey; multiplier: number }[]
      batchSize?: number
    }): Promise<Transaction[]> => {
      if (!wallet.publicKey) throw 'Wallet is not connected'
      if (!stakePoolData) throw 'No stake pool found'
      if (!rewardDistributorData) throw 'No reward distributor found'
      const stakePoolId = stakePoolData.pubkey
      if (isStakePoolV2(stakePoolData.parsed)) {
        const chunkData = entryDatas.map((e) => {
          const stakeEntryId = findStakeEntryId(
            stakePoolId,
            e.mintId,
            wallet.publicKey
          )
          const rewardEntryId = findRewardEntryId(
            rewardDistributorData.pubkey,
            stakeEntryId
          )
          return {
            ...e,
            stakeEntryId,
            rewardEntryId,
          }
        })
        console.log(`\n1/3 Fetching data...`)
        const accountDataById = await fetchIdlAccountDataById(
          connection,
          chunkData.map((i) => [i.stakeEntryId, i.rewardEntryId]).flat()
        )

        console.log(`\n2/3 Building transactions...`)
        const txs = []
        const chunks = chunkArray(chunkData, batchSize)
        for (let i = 0; i < chunks.length; i++) {
          const chunk = chunks[i]!
          const tx = new Transaction()
          console.log(`> ${i}/${chunks.length}`)
          for (let j = 0; j < chunk.length; j++) {
            const { mintId, stakeEntryId, rewardEntryId, multiplier } =
              chunk[j]!
            console.log(`>>[${j}/${chunk.length}] ${mintId.toString()}`)
            const stakeEntry = accountDataById[stakeEntryId.toString()]

            // // initialize stake entry ata
            // tx.add(
            //   createAssociatedTokenAccountIdempotentInstruction(
            //     wallet.publicKey,
            //     getAssociatedTokenAddressSync(mintId, stakeEntryId, true),
            //     stakeEntryId,
            //     mintId
            //   )
            // )

            // init stake entry
            if (!stakeEntry?.parsed) {
              const authorizationAccounts = remainingAccountsForAuthorization(
                stakePoolData,
                mintId,
                // assuming its either using requires authorization or creators/collections but not both to avoid looking up the metadata
                null
              )
              const ix = await rewardsCenterProgram(connection)
                .methods.initEntry(wallet.publicKey)
                .accountsStrict({
                  stakeEntry: stakeEntryId,
                  stakePool: stakePoolData.pubkey,
                  stakeMint: mintId,
                  payer: wallet.publicKey,
                  systemProgram: SystemProgram.programId,
                  stakeMintMetadata: findMintMetadataId(mintId),
                })
                .remainingAccounts(authorizationAccounts)
                .instruction()
              tx.add(ix)
              console.log(
                `>>[${i + 1}/${chunks.length}][${j + 1}/${
                  chunk.length
                }] initStakeEntry`
              )
            }

            // init reward entry
            const rewardEntryAccountInfo =
              accountDataById[rewardEntryId.toString()]
            if (!rewardEntryAccountInfo?.parsed) {
              const ix = await rewardsCenterProgram(connection)
                .methods.initRewardEntry()
                .accountsStrict({
                  rewardEntry: rewardEntryId,
                  stakeEntry: stakeEntryId,
                  rewardDistributor: rewardDistributorData.pubkey,
                  payer: wallet.publicKey,
                  systemProgram: SystemProgram.programId,
                })
                .instruction()
              tx.add(ix)
              console.log(
                `>>[${i + 1}/${chunks.length}][${j + 1}/${
                  chunk.length
                }] initRewardEntry`
              )
            }

            // decode reward entry
            const rewardEntry = rewardEntryAccountInfo
              ? tryDecodeIdlAccount<'rewardEntry', CardinalRewardsCenter>(
                  rewardEntryAccountInfo,
                  'rewardEntry',
                  REWARDS_CENTER_IDL
                )
              : null

            // update multiplier
            if (rewardEntry?.parsed?.multiplier.toNumber() !== multiplier) {
              const ix = await await rewardsCenterProgram(connection)
                .methods.updateRewardEntry({
                  multiplier: new BN(multiplier),
                })
                .accountsStrict({
                  rewardEntry: rewardEntryId,
                  rewardDistributor: rewardDistributorData.pubkey,
                  authority: wallet.publicKey,
                })
                .instruction()
              tx.add(ix)
              console.log(
                `>>[${i + 1}/${chunks.length}][${j + 1}/${
                  chunk.length
                }] updateRewardEntry`
              )
            }
          }
          if (tx.instructions.length > 0) {
            txs.push(tx)
          }
        }

        return txs
      } else {
        const chunkData = entryDatas.map((e) => {
          const stakeEntryId = v1.stakePool.pda.findStakeEntryId(
            wallet.publicKey,
            stakePoolId,
            e.mintId,
            false
          )
          const rewardEntryId = v1.rewardDistributor.pda.findRewardEntryId(
            rewardDistributorData?.pubkey,
            stakeEntryId
          )
          return {
            ...e,
            stakeEntryId,
            rewardEntryId,
          }
        })
        console.log(`\n1/3 Fetching data...`)
        const accountDataById = await fetchIdlAccountDataById(
          connection,
          chunkData.map((i) => [i.stakeEntryId, i.rewardEntryId]).flat()
        )

        console.log(`\n2/3 Building transactions...`)
        const txs = []
        const chunks = chunkArray(chunkData, batchSize)
        for (let i = 0; i < chunks.length; i++) {
          const chunk = chunks[i]!
          const tx = new Transaction()
          console.log(`> ${i}/${chunks.length}`)
          for (let j = 0; j < chunk.length; j++) {
            const { mintId, stakeEntryId, rewardEntryId, multiplier } =
              chunk[j]!
            console.log(`>>[${j}/${chunk.length}] ${mintId.toString()}`)
            const stakeEntry = accountDataById[stakeEntryId.toString()]

            // // initialize stake entry ata
            // tx.add(
            //   createAssociatedTokenAccountIdempotentInstruction(
            //     wallet.publicKey,
            //     getAssociatedTokenAddressSync(mintId, stakeEntryId, true),
            //     stakeEntryId,
            //     mintId
            //   )
            // )

            // init stake entry
            if (!stakeEntry?.parsed) {
              await withInitStakeEntry(tx, connection, wallet, {
                stakePoolId: stakePoolData.pubkey,
                stakeEntryId: stakeEntryId,
                originalMintId: mintId,
              })
              console.log(
                `>>[${i + 1}/${chunks.length}][${j + 1}/${
                  chunk.length
                }] initStakeEntry`
              )
            }

            // init reward entry
            const rewardEntryAccountInfo =
              accountDataById[rewardEntryId.toString()]
            if (!rewardEntryAccountInfo?.parsed) {
              await withInitRewardEntry(tx, connection, wallet, {
                stakeEntryId,
                rewardDistributorId: rewardDistributorData.pubkey,
              })
              console.log(
                `>>[${i + 1}/${chunks.length}][${j + 1}/${
                  chunk.length
                }] initRewardEntry`
              )
            }

            // decode reward entry
            const rewardEntry = rewardEntryAccountInfo
              ? tryDecodeIdlAccount<
                  'rewardEntry',
                  v1.rewardDistributor.REWARD_DISTRIBUTOR_PROGRAM
                >(
                  rewardEntryAccountInfo,
                  'rewardEntry',
                  v1.rewardDistributor.REWARD_DISTRIBUTOR_IDL
                )
              : null

            // update multiplier
            if (rewardEntry?.parsed?.multiplier.toNumber() !== multiplier) {
              await withUpdateRewardEntry(tx, connection, wallet, {
                stakePoolId: stakePoolData.pubkey,
                rewardDistributorId: rewardDistributorData.pubkey,
                stakeEntryId: stakeEntryId,
                multiplier: new BN(multiplier),
              })
              console.log(
                `>>[${i + 1}/${chunks.length}][${j + 1}/${
                  chunk.length
                }] updateRewardEntry`
              )
            }
          }
          if (tx.instructions.length > 0) {
            txs.push(tx)
          }
        }

        return txs
      }
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
            description: `Use the transaction executor to execute them all below.`,
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
