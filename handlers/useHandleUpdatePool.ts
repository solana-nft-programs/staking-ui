import { findAta, tryPublicKey } from '@cardinal/common'
import {
  rewardsCenterProgram,
  SOL_PAYMENT_INFO,
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
import { Transaction } from '@solana/web3.js'
import { handleError } from 'common/errors'
import { notify } from 'common/Notification'
import { asWallet } from 'common/Wallets'
import type { CreationForm } from 'components/StakePoolForm'
import {
  isRewardDistributorV2,
  useRewardDistributorData,
} from 'hooks/useRewardDistributorData'
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
      if (
        values.rewardDistributorKind !== rewardDistributor.data?.parsed?.kind
      ) {
        if (values.rewardDistributorKind === 0) {
          if (rewardDistributor.data && rewardDistributor.data.parsed) {
            if (isRewardDistributorV2(rewardDistributor.data.parsed)) {
              const rewardDistributorAta = await findAta(
                rewardDistributor.data.parsed.rewardMint,
                rewardDistributor.data.pubkey,
                true
              )
              const authorityAta = await findAta(
                rewardDistributor.data.parsed.rewardMint,
                rewardDistributor.data.parsed.authority,
                true
              )
              const ix = await program.methods
                .closeRewardDistributor()
                .accounts({
                  rewardDistributor: rewardDistributor.data.pubkey,
                  stakePool: rewardDistributor.data.parsed.stakePool,
                  rewardMint: rewardDistributor.data.parsed.rewardMint,
                  rewardDistributorTokenAccount: rewardDistributorAta,
                  authorityTokenAccount: authorityAta,
                  signer: wallet.publicKey,
                  tokenProgram: TOKEN_PROGRAM_ID,
                })
                .instruction()
              transaction.add(ix)
            } else {
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
          }
        } else {
          const ix = await program.methods
            .initRewardDistributor({
              rewardAmount: values.rewardAmount
                ? new BN(values.rewardAmount)
                : new BN(1),
              rewardDurationSeconds: values.rewardDurationSeconds
                ? new BN(values.rewardDurationSeconds)
                : new BN(1),
              identifier: new BN(0),
              supply: null,
              defaultMultiplier: values.defaultMultiplier
                ? new BN(values.defaultMultiplier)
                : null,
              multiplierDecimals: values.multiplierDecimals
                ? Number(values.multiplierDecimals)
                : null,
              maxRewardSecondsReceived: values.maxRewardSecondsReceived
                ? new BN(values.maxRewardSecondsReceived)
                : null,
              claimRewardsPaymentInfo: SOL_PAYMENT_INFO, // TODO CHANGE
            })
            .accounts({})
            .instruction()
          transaction.add(ix)
          notify({
            message: 'Initializing reward distributor for pool',
            type: 'info',
          })
        }
      } else if (rewardDistributor.data && rewardDistributor.data.parsed) {
        if (isRewardDistributorV2(rewardDistributor.data.parsed)) {
          const ix = await program.methods
            .updateRewardDistributor({
              defaultMultiplier: values.defaultMultiplier
                ? new BN(values.defaultMultiplier)
                : rewardDistributor.data.parsed.defaultMultiplier,
              multiplierDecimals: values.multiplierDecimals
                ? Number(values.multiplierDecimals)
                : rewardDistributor.data.parsed.multiplierDecimals,
              rewardAmount: values.rewardAmount
                ? new BN(values.rewardAmount)
                : rewardDistributor.data.parsed.rewardAmount,
              rewardDurationSeconds: values.rewardDurationSeconds
                ? new BN(values.rewardDurationSeconds)
                : rewardDistributor.data.parsed.rewardDurationSeconds,
              maxRewardSecondsReceived: values.maxRewardSecondsReceived
                ? new BN(values.maxRewardSecondsReceived)
                : rewardDistributor.data.parsed.maxRewardSecondsReceived,
              claimRewardsPaymentInfo: SOL_PAYMENT_INFO,
            })
            .accounts({})
            .instruction()
          transaction.add(ix)
        } else {
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
        }
        notify({
          message: `Updating reward distributor`,
          type: 'info',
        })
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
            stakePaymentInfo: SOL_PAYMENT_INFO,
            unstakePaymentInfo: SOL_PAYMENT_INFO,
          })
          .accounts({})
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
          message:
            'Successfully updated stake pool and reward distributor with ID: ' +
            stakePool.data?.pubkey.toString(),
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
