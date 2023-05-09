import type { AccountData } from '@cardinal/common'
import { chunkArray, getBatchedMultipleAccounts } from '@cardinal/common'
import type { IdlAccountData } from '@cardinal/rewards-center'
import { claimRewards } from '@cardinal/rewards-center'
import {
  REWARD_MANAGER,
  rewardDistributorProgram,
} from '@cardinal/staking/dist/cjs/programs/rewardDistributor'
import { findRewardEntryId } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/pda'
import type { StakeEntryData } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { getActiveStakeEntriesForPool } from '@cardinal/staking/dist/cjs/programs/stakePool/accounts'
import { withUpdateTotalStakeSeconds } from '@cardinal/staking/dist/cjs/programs/stakePool/transaction'
import {
  createAssociatedTokenAccountIdempotentInstruction,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token'
import { useWallet } from '@solana/wallet-adapter-react'
import { SystemProgram, Transaction } from '@solana/web3.js'
import { notify } from 'common/Notification'
import { asWallet } from 'common/Wallets'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { useRewardMintInfo } from 'hooks/useRewardMintInfo'
import { getActiveStakePoolEntriesV2 } from 'hooks/useStakePoolEntries'
import { useMutation } from 'react-query'

import { isStakePoolV2, useStakePoolData } from '../hooks/useStakePoolData'
import { useEnvironmentCtx } from '../providers/EnvironmentProvider'

const LOOKUP_BATCH_SIZE = 5000

export const useGenerateClaimRewardsForHoldersTxs = () => {
  const wallet = asWallet(useWallet())
  const { connection } = useEnvironmentCtx()
  const stakePool = useStakePoolData()
  const rewardDistributor = useRewardDistributorData()
  const rewardMintInfo = useRewardMintInfo()

  return useMutation(
    async ({
      batchSize = 4,
    }: {
      batchSize?: number
    }): Promise<Transaction[]> => {
      if (!wallet.publicKey) throw 'Wallet is not connected'
      if (!stakePool.data || !stakePool.data.parsed || !stakePool.data.pubkey) {
        throw 'No stake pool found'
      }
      if (!rewardDistributor.data) throw 'No reward distributor found'
      if (!rewardMintInfo.data) throw 'No reward mint info found'

      const stakePoolId = stakePool.data.pubkey
      let stakeEntriesV1: AccountData<StakeEntryData>[] = []
      let stakeEntriesV2: Pick<
        IdlAccountData<'stakeEntry'>,
        'pubkey' | 'parsed'
      >[] = []
      if (isStakePoolV2(stakePool.data.parsed)) {
        stakeEntriesV2 = (
          await getActiveStakePoolEntriesV2(connection, stakePool.data)
        ).filter((entry) => !entry.parsed.cooldownStartSeconds)
      } else {
        stakeEntriesV1 = (
          await getActiveStakeEntriesForPool(connection, stakePool.data.pubkey)
        ).filter((entry) => !entry.parsed.cooldownStartSeconds)
      }

      const costLog = `Estimated SOL needed to claim rewards for ${
        [...stakeEntriesV1, ...stakeEntriesV2].length
      } staked tokens:`
      0.002 * [...stakeEntriesV1, ...stakeEntriesV2].length, 'SOL'
      notify({
        message: costLog,
        type: 'info',
      })
      console.log(costLog)
      notify({
        message:
          'Transaction generation process might take a while in large size pools ...',
        type: 'info',
      })

      if (isStakePoolV2(stakePool.data.parsed)) {
        const batchStakeEntries = chunkArray(stakeEntriesV2, LOOKUP_BATCH_SIZE)
        let txs: Transaction[] = []
        for (const entries of batchStakeEntries) {
          const batchTxs = await claimRewards(
            connection,
            wallet,
            stakePool.data!.parsed.identifier,
            entries.map((entry) => {
              return {
                mintId: entry.parsed.stakeMint,
              }
            }),
            [rewardDistributor.data!.pubkey],
            true
          )
          txs = [...txs, ...batchTxs]
        }

        const batchedTxs = chunkArray(txs, batchSize)
        return batchedTxs.map((txs) => {
          const transaction = new Transaction()
          transaction.instructions = txs.map((tx) => tx.instructions).flat()
          return transaction
        })
      } else {
        const txs: Transaction[] = []
        const rewardEntryIds = stakeEntriesV1.map((e) =>
          findRewardEntryId(rewardDistributor.data!.pubkey, e.pubkey)
        )
        const rewardEntryInfos = await getBatchedMultipleAccounts(
          connection,
          rewardEntryIds
        )

        for (let i = 0; i < stakeEntriesV1.length; i++) {
          const stakeEntry = stakeEntriesV1[i]!
          const stakeEntryId = stakeEntry.pubkey
          const rewardEntryId = rewardEntryIds[i]

          const tx = new Transaction()
          const rewardMintTokenAccountId = getAssociatedTokenAddressSync(
            rewardDistributor.data.parsed.rewardMint,
            stakeEntry.parsed.lastStaker,
            true
          )
          /////// update seconds ///////
          await withUpdateTotalStakeSeconds(tx, connection, wallet, {
            stakeEntryId: stakeEntry.pubkey,
            lastStaker: wallet.publicKey,
          })
          /////// init ata ///////
          tx.add(
            createAssociatedTokenAccountIdempotentInstruction(
              wallet.publicKey,
              rewardMintTokenAccountId,
              stakeEntry.parsed.lastStaker,
              rewardDistributor.data.parsed.rewardMint
            )
          )
          /////// init entry ///////
          if (!rewardEntryInfos[i]?.data) {
            const ix = await rewardDistributorProgram(connection, wallet)
              .methods.initRewardEntry()
              .accounts({
                rewardEntry: rewardEntryId,
                stakeEntry: stakeEntryId,
                rewardDistributor: rewardDistributor.data.pubkey,
                payer: wallet.publicKey,
                systemProgram: SystemProgram.programId,
              })
              .instruction()
            tx.add(ix)
          }
          /////// claim rewards ///////
          const ix = await rewardDistributorProgram(connection, wallet)
            .methods.claimRewards()
            .accounts({
              rewardEntry: rewardEntryId,
              rewardDistributor: rewardDistributor.data.pubkey,
              stakeEntry: stakeEntryId,
              stakePool: stakePoolId,
              rewardMint: rewardDistributor.data.parsed.rewardMint,
              userRewardMintTokenAccount: rewardMintTokenAccountId,
              rewardManager: REWARD_MANAGER,
              user: wallet.publicKey,
              tokenProgram: TOKEN_PROGRAM_ID,
              systemProgram: SystemProgram.programId,
            })
            .remainingAccounts([
              {
                pubkey: getAssociatedTokenAddressSync(
                  rewardDistributor.data.parsed.rewardMint,
                  rewardDistributor.data.pubkey,
                  true
                ),
                isSigner: false,
                isWritable: true,
              },
            ])
            .instruction()
          tx.add(ix)
          txs.push(tx)
        }
        return txs
      }
    },
    {
      onSuccess: (txs) => {
        if (txs.length === 0) {
          notify({
            message: 'No pending rewards to claim for holders',
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
