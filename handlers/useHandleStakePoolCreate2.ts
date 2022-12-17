import { tryPublicKey } from '@cardinal/common'
import {
  DEFAULT_PAYMENT_INFO,
  findStakePoolId,
  rewardsCenterProgram,
} from '@cardinal/rewards-center'
import { executeTransaction } from '@cardinal/staking'
import { BN } from '@project-serum/anchor'
import { useWallet } from '@solana/wallet-adapter-react'
import type { PublicKey } from '@solana/web3.js'
import { SystemProgram, Transaction } from '@solana/web3.js'
import { handleError } from 'common/errors'
import { notify } from 'common/Notification'
import { asWallet } from 'common/Wallets'
import { useMutation, useQueryClient } from 'react-query'

import type { StakePoolUpdateForm } from '@/components/StakePoolUpdate'

import { useEnvironmentCtx } from '../providers/EnvironmentProvider'

export const useHandleStakePoolCreate2 = () => {
  const wallet = asWallet(useWallet())
  const { connection } = useEnvironmentCtx()
  const queryClient = useQueryClient()
  return useMutation(
    async ({
      values,
    }: {
      values: StakePoolUpdateForm
    }): Promise<[string, PublicKey]> => {
      if (!wallet || !wallet.publicKey) {
        throw 'Wallet not connected'
      }

      const collectionPublicKeys = values.requireCollections
        .map((c) => tryPublicKey(c))
        .filter((c) => c) as PublicKey[]
      const creatorPublicKeys = values.requireCreators
        .map((c) => tryPublicKey(c))
        .filter((c) => c) as PublicKey[]

      console.log(values)
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
          description: `Successfully created stake pool ${stakePoolId.toString()}`,
          txid,
          type: 'success',
        })
        queryClient.resetQueries()
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
