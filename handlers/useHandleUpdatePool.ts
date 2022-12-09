import { tryPublicKey } from '@cardinal/common'
import {
  DEFAULT_PAYMENT_INFO,
  findRewardDistributorId,
  rewardsCenterProgram,
} from '@cardinal/rewards-center'
import { executeTransaction } from '@cardinal/staking'
import {
  withCloseRewardDistributor,
  withUpdateRewardDistributor,
} from '@cardinal/staking/dist/cjs/programs/rewardDistributor/transaction'
import { withUpdateStakePool } from '@cardinal/staking/dist/cjs/programs/stakePool/transaction'
import { BN } from '@project-serum/anchor'
import { TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token'
import { useWallet } from '@solana/wallet-adapter-react'
import type { PublicKey } from '@solana/web3.js'
import { SystemProgram, Transaction } from '@solana/web3.js'
import { handleError } from 'common/errors'
import { notify } from 'common/Notification'
import { asWallet } from 'common/Wallets'
import type { CreationForm } from 'components/StakePoolForm'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { useMutation } from 'react-query'

import { isStakePoolV2, useStakePoolData } from '../hooks/useStakePoolData'
import { useEnvironmentCtx } from '../providers/EnvironmentProvider'

export const useHandleUpdatePool = () => {
  const wallet = asWallet(useWallet())
  const { connection } = useEnvironmentCtx()
  const stakePool = useStakePoolData()
  const rewardDistributor = useRewardDistributorData()

  return useMutation(
    async ({ values }: { values: CreationForm }): Promise<void> => {
      if (!wallet) throw 'Wallet not found'
      if (!stakePool.data) throw 'No stake pool found'
      if (
        wallet.publicKey?.toString() !==
        stakePool.data?.parsed?.authority.toString()
      ) {
        notify({
          message: 'You are not the pool authority.',
          type: 'error',
        })
        return
      }
      if (!stakePool.data?.pubkey) {
        throw 'Stake pool pubkey not found'
      }

      const program = rewardsCenterProgram(connection, wallet)
      const transaction = new Transaction()

      if (isStakePoolV2(stakePool.data.parsed)) {
        if (rewardDistributor.data?.parsed) {
          if (
            !values.defaultMultiplier ||
            !values.rewardAmount ||
            !values.rewardDurationSeconds
          ) {
            throw 'Reward distributor params missing'
          }
          const ix = await program.methods
            .updateRewardDistributor({
              defaultMultiplier: new BN(values.defaultMultiplier),
              multiplierDecimals: Number(values.multiplierDecimals),
              rewardAmount: new BN(values.rewardAmount),
              rewardDurationSeconds: new BN(values.rewardDurationSeconds),
              maxRewardSecondsReceived: values.maxRewardSecondsReceived
                ? new BN(values.maxRewardSecondsReceived)
                : null,
              claimRewardsPaymentInfo: DEFAULT_PAYMENT_INFO,
            })
            .accounts({
              rewardDistributor: rewardDistributor.data.pubkey,
              authority: wallet.publicKey,
            })
            .instruction()
          transaction.add(ix)
        } else if (values.rewardMintAddress) {
          const rewardsDistributorId = findRewardDistributorId(
            stakePool.data.pubkey,
            new BN(0)
          )
          const ix = await program.methods
            .initRewardDistributor({
              rewardAmount: new BN(values.rewardAmount ?? 0),
              rewardDurationSeconds: new BN(values.rewardDurationSeconds ?? 0),
              identifier: new BN(0),
              supply: null,
              defaultMultiplier: new BN(values.defaultMultiplier ?? 1),
              multiplierDecimals: Number(values.multiplierDecimals) ?? 0,
              maxRewardSecondsReceived: values.maxRewardSecondsReceived
                ? new BN(values.maxRewardSecondsReceived)
                : null,
              claimRewardsPaymentInfo: DEFAULT_PAYMENT_INFO,
            })
            .accounts({
              rewardDistributor: rewardsDistributorId,
              stakePool: stakePool.data.pubkey,
              rewardMint: values.rewardMintAddress,
              authority: wallet.publicKey,
              payer: wallet.publicKey,
              tokenProgram: TOKEN_PROGRAM_ID,
              systemProgram: SystemProgram.programId,
            })
            .instruction()
          transaction.add(ix)
        }
      }

      if (!isStakePoolV2(stakePool.data.parsed)) {
        if (
          values.rewardDistributorKind !== rewardDistributor.data?.parsed?.kind
        ) {
          if (values.rewardDistributorKind === 0) {
            if (rewardDistributor.data && rewardDistributor.data.parsed) {
              await withCloseRewardDistributor(
                transaction,
                connection,
                wallet,
                {
                  stakePoolId: stakePool.data.pubkey,
                }
              )
            }
            notify({
              message: 'Removing reward distributor for pool',
              type: 'info',
            })
          } else {
            throw 'Cannot create deprecated reward distributor'
          }
        } else if (rewardDistributor.data && rewardDistributor.data.parsed) {
          await withUpdateRewardDistributor(transaction, connection, wallet, {
            stakePoolId: stakePool.data.pubkey,
            defaultMultiplier: values.defaultMultiplier
              ? new BN(values.defaultMultiplier)
              : undefined,
            multiplierDecimals: values.multiplierDecimals
              ? Number(values.multiplierDecimals)
              : undefined,
            rewardAmount: values.rewardAmount
              ? new BN(values.rewardAmount)
              : undefined,
            rewardDurationSeconds: values.rewardDurationSeconds
              ? new BN(values.rewardDurationSeconds)
              : undefined,
            maxRewardSecondsReceived: values.maxRewardSecondsReceived
              ? new BN(values.maxRewardSecondsReceived)
              : undefined,
          })
          notify({
            message: `Updating reward distributor`,
            type: 'info',
          })
        }
      }

      const collectionPublicKeys = values.requireCollections
        .map((c) => tryPublicKey(c))
        .filter((c) => c) as PublicKey[]
      const creatorPublicKeys = values.requireCreators
        .map((c) => tryPublicKey(c))
        .filter((c) => c) as PublicKey[]

      // format date
      let dateInNum: number | undefined = new Date(
        values.endDate?.toString() || ''
      ).getTime()
      if (dateInNum < Date.now()) {
        dateInNum = undefined
      }

      const stakePoolParams = {
        stakePoolId: stakePool.data.pubkey,
        allowedCollections: collectionPublicKeys,
        allowedCreators: creatorPublicKeys,
        requiresAuthorization: values.requiresAuthorization,
        resetOnStake: values.resetOnStake,
        // overlayText: values.overlayText,
        cooldownSeconds: values.cooldownPeriodSeconds,
        minStakeSeconds: values.minStakeSeconds,
        endDate: dateInNum ? new BN(dateInNum / 1000) : undefined,
      }

      if (isStakePoolV2(stakePool.data.parsed)) {
        const ix = await program.methods
          .updatePool({
            allowedCollections: collectionPublicKeys,
            allowedCreators: creatorPublicKeys,
            requiresAuthorization:
              values.requiresAuthorization ??
              stakePool.data.parsed.requiresAuthorization,
            authority: wallet.publicKey,
            resetOnUnstake:
              values.resetOnStake ?? stakePool.data.parsed.resetOnUnstake,
            cooldownSeconds: values.cooldownPeriodSeconds
              ? Number(values.cooldownPeriodSeconds)
              : stakePool.data.parsed.cooldownSeconds,
            minStakeSeconds: values.minStakeSeconds
              ? Number(values.minStakeSeconds)
              : stakePool.data.parsed.minStakeSeconds,
            endDate: values.endDate
              ? new BN(values.endDate)
              : stakePool.data.parsed.endDate,
            stakePaymentInfo: DEFAULT_PAYMENT_INFO,
            unstakePaymentInfo: DEFAULT_PAYMENT_INFO,
          })
          .accounts({
            stakePool: stakePool.data.pubkey,
            authority: wallet.publicKey,
            payer: wallet.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .instruction()
        transaction.add(ix)
      } else {
        await withUpdateStakePool(
          transaction,
          connection,
          wallet,
          stakePoolParams
        )
      }

      await executeTransaction(connection, wallet, transaction, {})
    },
    {
      onSuccess: () => {
        notify({
          message: `Successfully updated stake pool ${stakePool.data?.pubkey.toString()} ${
            rewardDistributor.data?.parsed
              ? 'and reward distributor ' +
                rewardDistributor.data.pubkey.toString()
              : ''
          }`,
          type: 'success',
        })
        setTimeout(() => {
          stakePool.refetch()
          rewardDistributor.refetch()
        }, 1000)
      },
      onError: (e) => {
        notify({
          message: 'Failed to update pool',
          description: handleError(e, `Error updating stake pool: ${e}`),
        })
      },
    }
  )
}
