import { rewardsCenterProgram } from '@cardinal/rewards-center'
import { executeTransaction } from '@cardinal/staking'
import { withUpdateRewardDistributor } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/transaction'
import { BN } from '@project-serum/anchor'
import { useWallet } from '@solana/wallet-adapter-react'
import { Transaction } from '@solana/web3.js'
import { handleError } from 'common/errors'
import { notify } from 'common/Notification'
import { asWallet } from 'common/Wallets'
import {
  isRewardDistributorV2,
  useRewardDistributorData,
} from 'hooks/useRewardDistributorData'
import { useStakePoolData } from 'hooks/useStakePoolData'
import { useMutation } from 'react-query'

import type { RewardDistributorForm } from '@/components/admin/RewardDistributorUpdate'

import { useEnvironmentCtx } from '../providers/EnvironmentProvider'

export const useHandleRewardDistributorUpdate = () => {
  const wallet = asWallet(useWallet())
  const { connection } = useEnvironmentCtx()
  const rewardDistributor = useRewardDistributorData()
  const stakePool = useStakePoolData()
  return useMutation(
    async ({ values }: { values: RewardDistributorForm }): Promise<string> => {
      if (!wallet) throw 'Wallet not found'
      if (
        wallet.publicKey?.toString() !==
        rewardDistributor.data?.parsed?.authority.toString()
      ) {
        throw 'You are not the pool authority'
      }
      if (!rewardDistributor.data?.pubkey) {
        throw 'Reward distributor pubkey not found'
      }

      const program = rewardsCenterProgram(connection, wallet)
      const transaction = new Transaction()

      if (isRewardDistributorV2(rewardDistributor.data.parsed)) {
        /////////////////// V1 ///////////////////
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
            claimRewardsPaymentInfo:
              rewardDistributor.data.parsed.claimRewardsPaymentInfo,
          })
          .accounts({
            rewardDistributor: rewardDistributor.data.pubkey,
            authority: wallet.publicKey,
          })
          .instruction()

        transaction.add(ix)
      } else {
        /////////////////// V1 ///////////////////
        if (
          !values.defaultMultiplier ||
          !values.rewardAmount ||
          !values.rewardDurationSeconds
        ) {
          throw 'Reward distributor params missing'
        }
        await withUpdateRewardDistributor(transaction, connection, wallet, {
          stakePoolId: rewardDistributor.data.parsed.stakePool,
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

      return executeTransaction(connection, wallet, transaction, {})
    },
    {
      onSuccess: (txid) => {
        notify({
          message: 'Success',
          description: `Successfully updated reward distributor ${rewardDistributor.data?.pubkey.toString()}`,
          txid,
          type: 'success',
        })
        rewardDistributor.remove()
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
