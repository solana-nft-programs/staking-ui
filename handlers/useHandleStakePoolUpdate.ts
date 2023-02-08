import { executeTransaction, tryPublicKey } from '@cardinal/common'
import { rewardsCenterProgram } from '@cardinal/rewards-center'
import { withUpdateStakePool } from '@cardinal/staking/dist/cjs/programs/stakePool/transaction'
import { BN } from '@project-serum/anchor'
import { useWallet } from '@solana/wallet-adapter-react'
import type { PublicKey } from '@solana/web3.js'
import { SystemProgram, Transaction } from '@solana/web3.js'
import { useMutation } from '@tanstack/react-query'
import { handleError } from 'common/errors'
import { notify } from 'common/Notification'
import { asWallet } from 'common/Wallets'

import type { StakePoolUpdateForm } from '@/components/admin/StakePoolUpdate'

import { isStakePoolV2, useStakePoolData } from '../hooks/useStakePoolData'
import { useEnvironmentCtx } from '../providers/EnvironmentProvider'

export const useHandleStakePoolUpdate = () => {
  const wallet = asWallet(useWallet())
  const { connection } = useEnvironmentCtx()
  const stakePool = useStakePoolData()
  return useMutation(
    async ({ values }: { values: StakePoolUpdateForm }): Promise<string> => {
      if (!wallet) throw 'Wallet not found'
      if (!stakePool.data) throw 'No stake pool found'
      if (
        wallet.publicKey?.toString() !==
        stakePool.data?.parsed?.authority.toString()
      ) {
        throw 'You are not the pool authority'
      }
      if (!stakePool.data?.pubkey) {
        throw 'Stake pool pubkey not found'
      }

      const program = rewardsCenterProgram(connection, wallet)
      const transaction = new Transaction()

      const collectionPublicKeys = values.requireCollections
        .map((c) => tryPublicKey(c))
        .filter((c) => c) as PublicKey[]
      const creatorPublicKeys = values.requireCreators
        .map((c) => tryPublicKey(c))
        .filter((c) => c) as PublicKey[]

      if (isStakePoolV2(stakePool.data.parsed)) {
        /////////////////// V2 ///////////////////
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
            endDate: values.endDateSeconds
              ? new BN(values.endDateSeconds)
              : stakePool.data.parsed.endDate,
            stakePaymentInfo: stakePool.data.parsed.stakePaymentInfo,
            unstakePaymentInfo: stakePool.data.parsed.unstakePaymentInfo,
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
        /////////////////// V1 ///////////////////
        await withUpdateStakePool(transaction, connection, wallet, {
          stakePoolId: stakePool.data.pubkey,
          requiresCollections:
            collectionPublicKeys ?? stakePool.data.parsed.allowedCreators,
          requiresCreators:
            creatorPublicKeys ?? stakePool.data.parsed.allowedCollections,
          requiresAuthorization:
            values.requiresAuthorization ??
            stakePool.data.parsed.requiresAuthorization,
          overlayText: '',
          resetOnStake:
            values.resetOnStake ?? stakePool.data.parsed.resetOnUnstake,
          cooldownSeconds:
            values.cooldownPeriodSeconds ??
            (stakePool.data.parsed.cooldownSeconds || undefined),
          minStakeSeconds:
            values.minStakeSeconds ??
            (stakePool.data.parsed.minStakeSeconds || undefined),
          endDate: values.endDateSeconds
            ? new BN(values.endDateSeconds)
            : stakePool.data.parsed.endDate || undefined,
          doubleOrResetEnabled: false, // TODO
        })
      }

      return executeTransaction(connection, transaction, wallet, {})
    },
    {
      onSuccess: (txid) => {
        notify({
          message: 'Success',
          description: `Successfully updated stake pool ${stakePool.data?.pubkey.toString()}`,
          txid,
          type: 'success',
        })
        stakePool.refetch()
      },
      onError: (e) => {
        notify({
          message: 'Failed to update pool',
          description: handleError(e, `${e}`),
        })
      },
    }
  )
}
