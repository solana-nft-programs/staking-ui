import { executeTransaction } from '@cardinal/staking'
import { withUpdateRewardEntry } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/transaction'
import { findStakeEntryIdFromMint } from '@cardinal/staking/dist/cjs/programs/stakePool/utils'
import { BN } from '@project-serum/anchor'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction } from '@solana/web3.js'
import { notify } from 'common/Notification'
import { asWallet } from 'common/Wallets'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { useMutation } from 'react-query'

import { useStakePoolData } from '../hooks/useStakePoolData'
import { useEnvironmentCtx } from '../providers/EnvironmentProvider'

export const useHandleSetMultipliers = () => {
  const wallet = asWallet(useWallet())
  const { connection } = useEnvironmentCtx()
  const stakePool = useStakePoolData()
  const rewardDistributor = useRewardDistributorData()

  return useMutation(
    async ({
      multiplierMints,
      multipliers,
    }: {
      multiplierMints: (string | undefined)[] | undefined
      multipliers: (string | undefined)[] | undefined
    }): Promise<void> => {
      if (!wallet) throw 'Wallet not found'
      if (!stakePool.data) throw 'No stake pool found'
      if (!rewardDistributor.data) throw 'No reward distributor found'
      if (!multiplierMints) throw 'Invalid multiplier mints'
      if (!multipliers) throw 'Invalid multipliers'
      if (multipliers.length !== multiplierMints.length) {
        notify({
          message: `Error: Multiplier and mints aren't 1:1`,
          type: 'error',
        })
        return
      }

      if (multiplierMints.toString() === [''].toString()) multiplierMints = []
      if (multipliers.toString() === [''].toString()) multipliers = []
      const pubKeysToSetMultiplier = []
      for (let i = 0; i < multiplierMints.length; i++) {
        if (multiplierMints[i] !== '' && multipliers[i] !== '') {
          pubKeysToSetMultiplier.push(new PublicKey(multiplierMints[i]!))
        } else {
          notify({
            message: `Error: Invalid multiplier mint "${multiplierMints[
              i
            ]!}" or multiplier "${multipliers[i]!}"`,
          })
          return
        }
      }

      if (pubKeysToSetMultiplier.length === 0) {
        notify({ message: `Info: No mints inserted` })
      }
      if (multipliers.length === 0) {
        notify({ message: `Info: No multiplier inserted` })
      }

      for (let i = 0; i < pubKeysToSetMultiplier.length; i++) {
        const mint = pubKeysToSetMultiplier[i]!
        const [stakeEntryId] = await findStakeEntryIdFromMint(
          connection,
          wallet.publicKey!,
          stakePool.data.pubkey,
          mint
        )
        const transaction = await withUpdateRewardEntry(
          new Transaction(),
          connection,
          wallet,
          {
            stakePoolId: stakePool.data.pubkey,
            rewardDistributorId: rewardDistributor.data.pubkey,
            stakeEntryId: stakeEntryId,
            multiplier: new BN(multipliers[i]!),
          }
        )
        await executeTransaction(connection, wallet, transaction, {
          silent: false,
          signers: [],
        })
        notify({
          message: `Successfully set multiplier ${i + 1}/${
            pubKeysToSetMultiplier.length
          }`,
          type: 'success',
        })
      }
    },
    {
      onError: (e) => {
        notify({ message: 'Failed to authorize mints', description: `${e}` })
      },
    }
  )
}
