import type { IdlAccountData } from '@cardinal/rewards-center'
import { rewardsCenterProgram } from '@cardinal/rewards-center'
import { getActiveStakeEntriesForPool } from '@cardinal/staking/dist/cjs/programs/stakePool/accounts'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { useMutation } from '@tanstack/react-query'
import { stakeEntryDataToV2 } from 'api/fetchStakeEntry'
import { notify } from 'common/Notification'
import { asWallet } from 'common/Wallets'

import { isStakePoolV2, useStakePoolData } from '../hooks/useStakePoolData'
import { useEnvironmentCtx } from '../providers/EnvironmentProvider'

export const useHandlePoolSnapshot = () => {
  const wallet = asWallet(useWallet())
  const { connection } = useEnvironmentCtx()
  const stakePool = useStakePoolData()

  return useMutation(
    async (): Promise<
      Pick<IdlAccountData<'stakeEntry'>, 'pubkey' | 'parsed'>[]
    > => {
      if (!wallet) throw 'Wallet not found'
      if (!stakePool.data || !stakePool.data.parsed) throw 'No stake pool found'

      if (isStakePoolV2(stakePool.data.parsed)) {
        const program = rewardsCenterProgram(connection, wallet)
        const stakeEntries = await program.account.stakeEntry.all([
          {
            memcmp: {
              offset: 10,
              bytes: stakePool.data.pubkey.toString(),
            },
          },
        ])
        return stakeEntries
          .filter(
            (entry) =>
              entry.account.lastStaker.toString() !==
              PublicKey.default.toString()
          )
          .map((e) => {
            return { pubkey: e.publicKey, parsed: e.account }
          })
      } else {
        return (
          await getActiveStakeEntriesForPool(connection, stakePool.data.pubkey)
        ).map((entry) => {
          return {
            pubkey: entry.pubkey,
            parsed: stakeEntryDataToV2(entry.parsed),
          }
        })
      }
    },
    {
      onSuccess: () => {
        notify({
          message: `Successfully created snapshot`,
          type: 'success',
        })
      },
      onError: (e) => {
        notify({
          message: 'Failed to create snapshot',
          description: `${e}`,
        })
      },
    }
  )
}
