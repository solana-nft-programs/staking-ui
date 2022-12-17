import {
  DEFAULT_PAYMENT_INFO,
  findRewardDistributorId,
  rewardsCenterProgram,
} from '@cardinal/rewards-center'
import { executeTransaction } from '@cardinal/staking'
import { withInitRewardDistributor } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/transaction'
import { BN } from '@project-serum/anchor'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction } from '@solana/web3.js'
import { handleError } from 'common/errors'
import { notify } from 'common/Notification'
import { asWallet } from 'common/Wallets'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { isStakePoolV2, useStakePoolData } from 'hooks/useStakePoolData'
import { useMutation } from 'react-query'

import type { RewardDistributorForm } from '@/components/admin/RewardDistributorUpdate'

import { useEnvironmentCtx } from '../providers/EnvironmentProvider'

export const useHandleRewardDistributorCreate = () => {
  const wallet = asWallet(useWallet())
  const { connection } = useEnvironmentCtx()
  const stakePool = useStakePoolData()
  const rewardDistributor = useRewardDistributorData()
  return useMutation(
    async ({ values }: { values: RewardDistributorForm }): Promise<string> => {
      if (!wallet) throw 'Wallet not found'
      if (
        wallet.publicKey?.toString() !==
        stakePool.data?.parsed?.authority.toString()
      ) {
        throw 'You are not the pool authority'
      }
      if (
        !values.rewardAmount ||
        !values.rewardDurationSeconds ||
        !values.rewardMintAddress
      ) {
        throw 'Reward distributor params missing'
      }

      const program = rewardsCenterProgram(connection, wallet)
      const transaction = new Transaction()
      if (isStakePoolV2(stakePool.data.parsed)) {
        /////////////////// V1 ///////////////////
        const rewardDistributorId = findRewardDistributorId(
          stakePool.data.pubkey
        )
        const ix = await program.methods
          .initRewardDistributor({
            identifier: new BN(0),
            defaultMultiplier: values.defaultMultiplier
              ? new BN(values.defaultMultiplier)
              : new BN(1),
            multiplierDecimals: Number(values.multiplierDecimals),
            rewardAmount: new BN(values.rewardAmount),
            rewardDurationSeconds: new BN(values.rewardDurationSeconds),
            maxRewardSecondsReceived: values.maxRewardSecondsReceived
              ? new BN(values.maxRewardSecondsReceived)
              : null,
            supply: null,
            claimRewardsPaymentInfo: DEFAULT_PAYMENT_INFO,
          })
          .accounts({
            stakePool: stakePool.data.pubkey,
            rewardMint: new PublicKey(values.rewardMintAddress),
            rewardDistributor: rewardDistributorId,
            authority: wallet.publicKey,
          })
          .instruction()

        transaction.add(ix)
      } else {
        /////////////////// V1 ///////////////////

        await withInitRewardDistributor(transaction, connection, wallet, {
          stakePoolId: stakePool.data.pubkey,
          defaultMultiplier: values.defaultMultiplier
            ? new BN(values.defaultMultiplier)
            : undefined,
          rewardMintId: new PublicKey(values.rewardMintAddress),
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

      return executeTransaction(connection, wallet, transaction, {})
    },
    {
      onSuccess: (txid) => {
        notify({
          message: 'Success',
          description: `Successfully created reward distributor for pool ${stakePool.data?.pubkey.toString()}`,
          txid,
          type: 'success',
        })
        rewardDistributor.remove()
        stakePool.refetch()
      },
      onError: (e) => {
        notify({
          message: 'Failed to create reward distributor',
          description: handleError(e, `${e}`),
        })
      },
    }
  )
}
