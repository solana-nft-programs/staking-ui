import { tryPublicKey } from '@cardinal/common'
import {
  DEFAULT_PAYMENT_INFO,
  findRewardDistributorId,
  findStakePoolId,
  rewardsCenterProgram,
} from '@cardinal/rewards-center'
import { createStakePool, executeTransaction } from '@cardinal/staking'
import { RewardDistributorKind } from '@cardinal/staking/dist/cjs/programs/rewardDistributor'
import { withInitRewardDistributor } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/transaction'
import { BN } from '@project-serum/anchor'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import { handleError } from 'common/errors'
import { notify } from 'common/Notification'
import { asWallet } from 'common/Wallets'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { useMutation } from 'react-query'
import type { Mint } from 'spl-token-v3'

import type { CreationForm } from '@/components/stake-pool-creation/Schema'

import { useStakePoolData } from '../hooks/useStakePoolData'
import { useEnvironmentCtx } from '../providers/EnvironmentProvider'

export const useHandleCreationForm = () => {
  const wallet = asWallet(useWallet())
  const { connection, environment } = useEnvironmentCtx()
  const stakePool = useStakePoolData()
  const rewardDistributor = useRewardDistributorData()

  return useMutation(
    async ({
      values,
      version = 2,
    }: {
      values: CreationForm
      version?: 1 | 2
      mintInfo?: Mint
    }): Promise<[string, PublicKey]> => {
      if (!wallet || !wallet.publicKey) {
        throw 'Wallet not connected'
      }
      if (
        !!values.rewardMintAddress &&
        (!values.rewardAmount || !values.rewardDurationSeconds)
      ) {
        throw 'Reward distirbutor selected but values missing'
      }

      const collectionPublicKeys = values.requireCollections
        .map((c) => tryPublicKey(c))
        .filter((c) => c) as PublicKey[]
      const creatorPublicKeys = values.requireCreators
        .map((c) => tryPublicKey(c))
        .filter((c) => c) as PublicKey[]

      // format date
      let endDateSeconds: number | undefined =
        new Date(values.endDate?.toString() || '').getTime() / 1000
      if (endDateSeconds < Date.now() / 1000) {
        endDateSeconds = undefined
      }
      if (version === 1) {
        /////////////////// V1 ///////////////////
        const [transaction, stakePoolId] = await createStakePool(
          connection,
          wallet,
          {
            overlayText: 'STAKED',
            requiresCollections:
              collectionPublicKeys.length > 0
                ? collectionPublicKeys
                : undefined,
            requiresCreators:
              creatorPublicKeys.length > 0 ? creatorPublicKeys : undefined,
            requiresAuthorization: values.requiresAuthorization,
            resetOnStake: values.resetOnStake,
            cooldownSeconds: values.cooldownPeriodSeconds,
            minStakeSeconds: values.minStakeSeconds,
            endDate: endDateSeconds ? new BN(endDateSeconds) : undefined,
            doubleOrResetEnabled: false,
          }
        )
        if (!!values.rewardMintAddress) {
          /////////////////// V1 Reward Distribution ///////////////////
          if (Number(values.rewardDurationSeconds) < 1) {
            throw 'RewardDurationSeconds needs to greater or equal to 1'
          }
          await withInitRewardDistributor(transaction, connection, wallet, {
            stakePoolId: stakePoolId,
            rewardMintId: new PublicKey(values.rewardMintAddress!.trim())!,
            rewardAmount: values.rewardAmount
              ? new BN(values.rewardAmount)
              : undefined,
            rewardDurationSeconds: values.rewardDurationSeconds
              ? new BN(values.rewardDurationSeconds)
              : undefined,
            kind: RewardDistributorKind.Treasury,
            supply: values.rewardMintSupply
              ? new BN(values.rewardMintSupply)
              : undefined,
            multiplierDecimals: values.multiplierDecimals
              ? parseInt(values.multiplierDecimals)
              : undefined,
            defaultMultiplier: values.defaultMultiplier
              ? new BN(values.defaultMultiplier)
              : undefined,
            maxRewardSecondsReceived: values.maxRewardSecondsReceived
              ? new BN(values.maxRewardSecondsReceived)
              : undefined,
          })
        }
        const txid = await executeTransaction(
          connection,
          wallet,
          transaction,
          {}
        )
        return [txid, stakePoolId]
      } else {
        /////////////////// V2 ///////////////////
        const transaction = new Transaction()
        const program = rewardsCenterProgram(connection, wallet)
        const identifier = `pool-name-${Math.random()}`
        const stakePoolId = findStakePoolId(identifier)
        const ix = await program.methods
          .initPool({
            identifier: identifier,
            allowedCollections: collectionPublicKeys,
            allowedCreators: creatorPublicKeys,
            requiresAuthorization: values.requiresAuthorization ?? false,
            authority: wallet.publicKey,
            resetOnUnstake: values.resetOnStake ?? false,
            cooldownSeconds: values.cooldownPeriodSeconds || null,
            minStakeSeconds: values.minStakeSeconds || null,
            endDate: endDateSeconds ? new BN(endDateSeconds) : null,
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

        if (!!values.rewardMintAddress) {
          /////////////////// V2 Reward Distribution ///////////////////
          if (Number(values.rewardDurationSeconds) < 1) {
            throw 'RewardDurationSeconds needs to greater or equal to 1'
          }
          const rewardMintId = new PublicKey(values.rewardMintAddress!.trim())!
          const rewardDistributorId = findRewardDistributorId(stakePoolId)
          const rwdix = await program.methods
            .initRewardDistributor({
              identifier: new BN(0),
              rewardAmount: new BN(values.rewardAmount ?? 0),
              rewardDurationSeconds: new BN(values.rewardDurationSeconds ?? 0),
              supply: null,
              defaultMultiplier: new BN(values.defaultMultiplier ?? 1),
              multiplierDecimals: values.multiplierDecimals
                ? parseInt(values.multiplierDecimals)
                : 0,
              maxRewardSecondsReceived: values.maxRewardSecondsReceived
                ? new BN(values.maxRewardSecondsReceived)
                : null,
              claimRewardsPaymentInfo: DEFAULT_PAYMENT_INFO,
            })
            .accounts({
              rewardDistributor: rewardDistributorId,
              stakePool: stakePoolId,
              rewardMint: rewardMintId,
              authority: wallet.publicKey,
              payer: wallet.publicKey,
            })
            .instruction()
          transaction.add(rwdix)
        }
        const txid = await executeTransaction(
          connection,
          wallet,
          transaction,
          {}
        )
        return [txid, stakePoolId]
      }
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
          cluster: environment.label,
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
          description: handleError(e, `${e}`),
        })
      },
    }
  )
}
