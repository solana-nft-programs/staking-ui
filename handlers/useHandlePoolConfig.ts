import { tryGetAccount } from '@cardinal/common'
import { getConfigEntry } from '@cardinal/configs/dist/cjs/programs/accounts'
import { configsProgram } from '@cardinal/configs/dist/cjs/programs/constants'
import { findConfigEntryId } from '@cardinal/configs/dist/cjs/programs/pda'
import { executeTransaction } from '@cardinal/staking'
import { useWallet } from '@solana/wallet-adapter-react'
import { SystemProgram, Transaction } from '@solana/web3.js'
import { handleError } from 'common/errors'
import { notify } from 'common/Notification'
import { asWallet } from 'common/Wallets'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { useMutation } from 'react-query'

import { useStakePoolData } from '../hooks/useStakePoolData'
import { useEnvironmentCtx } from '../providers/EnvironmentProvider'

export const useHandlePoolConfig = () => {
  const wallet = asWallet(useWallet())
  const { connection, environment } = useEnvironmentCtx()
  const stakePool = useStakePoolData()
  const rewardDistributor = useRewardDistributorData()

  return useMutation(
    async ({ config }: { config: string }): Promise<string> => {
      if (!stakePool.data) throw 'No stake pool data found'
      if (!wallet || !wallet.publicKey) throw 'Wallet is not connected'
      const program = configsProgram(connection)
      const transaction = new Transaction()
      const key = 'stake-pool'
      const configAccount = stakePool.data.pubkey
      const configEntryId = findConfigEntryId(key, configAccount)

      const checkConfigEntry = tryGetAccount(() =>
        getConfigEntry(connection, key, configAccount)
      )

      if (!checkConfigEntry) {
        const ix = await program.methods
          .initConfigEntry({
            key: key,
            value: config,
            configAccount: configAccount,
            extends: [],
          })
          .accountsStrict({
            configEntry: configEntryId,
            authority: wallet.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .instruction()
        transaction.add(ix)
      } else {
        const ix = await program.methods
          .updateConfigEntry({
            value: config,
            extends: [],
          })
          .accountsStrict({
            configEntry: configEntryId,
            authority: wallet.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .instruction()
        transaction.add(ix)
      }

      const txid = await executeTransaction(connection, wallet, transaction, {})

      return txid
    },
    {
      onSuccess: (txid) => {
        notify({
          message: 'Success',
          description: `Successfully updated config ${stakePool.data?.pubkey.toString()}`,
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
        if (`${e}`.includes('RangeError') || `${e}`.includes('too large')) {
          notify({
            message: 'Failed to update config',
            description: 'Config is too large',
          })
        } else {
          notify({
            message: 'Failed to update config',
            description: handleError(e, `${e}`),
          })
        }
      },
    }
  )
}
