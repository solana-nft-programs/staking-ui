import { tryPublicKey } from '@cardinal/common'
import {
  DEFAULT_PAYMENT_INFO,
  findRewardDistributorId,
  findStakePoolId,
  rewardsCenterProgram,
} from '@cardinal/rewards-center'
import { executeTransaction } from '@cardinal/staking'
import { BN } from '@project-serum/anchor'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import { handleError } from 'common/errors'
import { notify } from 'common/Notification'
import { asWallet } from 'common/Wallets'
import type { CreationForm } from 'components/StakePoolForm'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { useMutation } from 'react-query'

import { useStakePoolData } from '../hooks/useStakePoolData'
import { useEnvironmentCtx } from '../providers/EnvironmentProvider'

export const useHandleCreatePool = () => {
  const wallet = asWallet(useWallet())
  const { connection } = useEnvironmentCtx()
  const stakePool = useStakePoolData()
  const rewardDistributor = useRewardDistributorData()

  return useMutation(
    async ({
      values,
    }: {
      values: CreationForm
    }): Promise<[string, PublicKey]> => {
      if (!wallet || !wallet.publicKey) {
        throw 'Wallet not connected'
      }
      if (
        (!values.rewardAmount && values.rewardDurationSeconds) ||
        (values.rewardAmount && !values.rewardDurationSeconds)
      ) {
        throw 'Both reward amount and reward duration must be specified'
      }
      if (
        !values.rewardAmount &&
        !values.rewardMintAddress &&
        values.rewardDistributorKind
      ) {
        throw 'Reward distribution must be specified (cannot be none)'
      }
      if (
        (values.rewardAmount ||
          values.rewardMintAddress ||
          values.rewardDistributorKind) &&
        (!values.rewardAmount || !values.rewardMintAddress)
      ) {
        throw 'Please fill out all the fields for reward distribution paramters'
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
        allowedCollections:
          collectionPublicKeys.length > 0 ? collectionPublicKeys : undefined,
        allowedCreators:
          creatorPublicKeys.length > 0 ? creatorPublicKeys : undefined,
        requiresAuthorization: values.requiresAuthorization,
        resetOnStake: values.resetOnStake,
        minStakeSeconds: values.minStakeSeconds || null,
        // overlayText: values.overlayText || undefined,
        cooldownSeconds: values.cooldownPeriodSeconds || null,
        endDate: dateInNum ? new BN(dateInNum / 1000) : null,
      }

      const transaction = new Transaction()
      const program = rewardsCenterProgram(connection, wallet)
      const identifier = `pool-name-${Math.random()}`
      const stakePoolId = findStakePoolId(identifier)
      const ix = await program.methods
        .initPool({
          identifier: identifier,
          allowedCollections: stakePoolParams.allowedCollections ?? [],
          allowedCreators: stakePoolParams.allowedCreators ?? [],
          requiresAuthorization: stakePoolParams.requiresAuthorization ?? false,
          authority: wallet.publicKey,
          resetOnUnstake: stakePoolParams.resetOnStake ?? false,
          cooldownSeconds: stakePoolParams.cooldownSeconds,
          minStakeSeconds: stakePoolParams.minStakeSeconds,
          endDate: stakePoolParams.endDate,
          stakePaymentInfo: DEFAULT_PAYMENT_INFO,
          unstakePaymentInfo: DEFAULT_PAYMENT_INFO,
        })
        .accounts({
          stakePool: stakePoolId,
          payer: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .instruction()
      transaction.add(ix)
      // const [transaction, stakePoolPK] = await createStakePool(
      //   connection,
      //   asWallet(wallet),
      //   stakePoolParams
      // )

      if (values.rewardMintAddress) {
        if (Number(values.rewardDurationSeconds) < 1) {
          throw 'RewardDurationSeconds needs to greater or equal to 1'
        }
        const rewardDistributorKindParams = {
          stakePoolId: stakePoolId,
          rewardMintId: new PublicKey(values.rewardMintAddress!.trim())!,
          rewardAmount: values.rewardAmount
            ? new BN(values.rewardAmount)
            : undefined,
          rewardDurationSeconds: values.rewardDurationSeconds
            ? new BN(values.rewardDurationSeconds)
            : undefined,
          kind: 0,
          // supply: values.rewardMintSupply
          //   ? new BN(values.rewardMintSupply)
          //   : undefined,
          multiplerDecimals: values.multiplierDecimals
            ? parseInt(values.multiplierDecimals)
            : undefined,
          defaultMultiplier: values.defaultMultiplier
            ? new BN(values.defaultMultiplier)
            : undefined,
          maxRewardSecondsReceived: values.maxRewardSecondsReceived
            ? new BN(values.maxRewardSecondsReceived)
            : undefined,
        }

        const rewardDistributorId = findRewardDistributorId(stakePoolId)
        const rwdix = await program.methods
          .initRewardDistributor({
            identifier: new BN(0),
            rewardAmount: new BN(rewardDistributorKindParams.rewardAmount ?? 0),
            rewardDurationSeconds: new BN(
              rewardDistributorKindParams.rewardDurationSeconds ?? 0
            ),
            supply: null,
            defaultMultiplier: new BN(
              rewardDistributorKindParams.defaultMultiplier ?? 1
            ),
            multiplierDecimals:
              rewardDistributorKindParams.multiplerDecimals ?? 0,
            maxRewardSecondsReceived:
              rewardDistributorKindParams.maxRewardSecondsReceived
                ? new BN(rewardDistributorKindParams.maxRewardSecondsReceived)
                : null,
            claimRewardsPaymentInfo: DEFAULT_PAYMENT_INFO,
          })
          .accounts({
            rewardDistributor: rewardDistributorId,
            stakePool: stakePoolId,
            rewardMint: rewardDistributorKindParams.rewardMintId,
            authority: wallet.publicKey,
            payer: wallet.publicKey,
          })
          .instruction()
        transaction.add(rwdix)
      }

      const txid = await executeTransaction(connection, wallet, transaction, {
        silent: false,
        signers: [],
      })
      return [txid, stakePoolId]
    },
    {
      onSuccess: ([txid, stakePoolId]) => {
        notify({
          message: 'Success',
          description: `Successfully created stake pool ${stakePoolId.toString()} ${
            rewardDistributor.data?.parsed
              ? 'and reward distributor ' +
                rewardDistributor.data.pubkey.toString()
              : ''
          }`,
          txid,
          type: 'success',
        })
        setTimeout(() => {
          stakePool.refetch()
          rewardDistributor.refetch()
        }, 1000)
      },
      onError: (e) => {
        notify({
          message: 'Failed to create pool',
          description: handleError(e, `Error creating stake pool: ${e}`),
        })
      },
    }
  )
}
