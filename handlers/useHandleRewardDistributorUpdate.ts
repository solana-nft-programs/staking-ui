import { executeTransaction } from '@cardinal/common'
import { rewardsCenterProgram } from '@cardinal/rewards-center'
import { rewardDistributorProgram } from '@cardinal/staking/dist/cjs/programs/rewardDistributor'
import { BN } from '@coral-xyz/anchor'
import { useWallet } from '@solana/wallet-adapter-react'
import { Transaction } from '@solana/web3.js'
import { useMutation } from '@tanstack/react-query'
import { handleError } from 'common/errors'
import { notify } from 'common/Notification'
import { asWallet } from 'common/Wallets'
import {
  isRewardDistributorV2,
  useRewardDistributorData,
} from 'hooks/useRewardDistributorData'
import { useStakePoolData } from 'hooks/useStakePoolData'

import type { RewardDistributorForm } from '@/components/admin/fungible-rewards/RewardDistributorUpdate'

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
        /////////////////// V2 ///////////////////
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
        const ix = await rewardDistributorProgram(connection, wallet)
          .methods.updateRewardDistributor({
            defaultMultiplier: new BN(values.defaultMultiplier),
            multiplierDecimals: Number(values.multiplierDecimals),
            rewardAmount: new BN(values.rewardAmount),
            rewardDurationSeconds: new BN(values.rewardDurationSeconds),
            maxRewardSecondsReceived: values.maxRewardSecondsReceived
              ? new BN(values.maxRewardSecondsReceived)
              : null,
          })
          .accounts({
            rewardDistributor: rewardDistributor.data?.pubkey,
            authority: wallet.publicKey,
          })
          .instruction()
        transaction.add(ix)
      }

      return executeTransaction(connection, transaction, wallet, {})
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
