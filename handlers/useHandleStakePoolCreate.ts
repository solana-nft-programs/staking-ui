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

import type { StakePoolUpdateForm } from '@/components/admin/StakePoolUpdate'

import { useEnvironmentCtx } from '../providers/EnvironmentProvider'

export const useHandleStakePoolCreate = () => {
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

      // format pubkeys
      const collectionPublicKeys = values.requireCollections
        .map((c) => tryPublicKey(c))
        .filter((c) => c) as PublicKey[]
      const creatorPublicKeys = values.requireCreators
        .map((c) => tryPublicKey(c))
        .filter((c) => c) as PublicKey[]

      console.log(values)
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
          endDate: values.endDateSeconds ? new BN(values.endDateSeconds) : null,
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
