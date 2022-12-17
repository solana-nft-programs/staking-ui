import type { IdlAccountData } from '@cardinal/rewards-center'
import { rewardsCenterProgram } from '@cardinal/rewards-center'
import { getActiveStakeEntriesForPool } from '@cardinal/staking/dist/cjs/programs/stakePool/accounts'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { stakeEntryDataToV2 } from 'api/fetchStakeEntry'
import { asWallet } from 'common/Wallets'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useQuery } from 'react-query'

import { TOKEN_DATAS_KEY } from './useAllowedTokenDatas'
import { isStakePoolV2, useStakePoolData } from './useStakePoolData'

export const useStakePoolEntries = () => {
  const { secondaryConnection } = useEnvironmentCtx()
  const { data: stakePoolData } = useStakePoolData()
  const wallet = useWallet()

  return useQuery<
    Pick<IdlAccountData<'stakeEntry'>, 'pubkey' | 'parsed'>[] | undefined
  >(
    [TOKEN_DATAS_KEY, 'useStakePoolEntries', stakePoolData?.pubkey?.toString()],
    async () => {
      if (stakePoolData?.pubkey && stakePoolData?.parsed) {
        if (isStakePoolV2(stakePoolData.parsed)) {
          const program = rewardsCenterProgram(
            secondaryConnection,
            asWallet(wallet)
          )
          const stakeEntries = await program.account.stakeEntry.all([
            {
              memcmp: {
                offset: 10,
                bytes: stakePoolData.pubkey.toString(),
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
            await getActiveStakeEntriesForPool(
              secondaryConnection,
              stakePoolData?.pubkey
            )
          ).map((entry) => {
            return {
              pubkey: entry.pubkey,
              parsed: stakeEntryDataToV2(entry.parsed),
            }
          })
        }
      }
    },
    { enabled: !!stakePoolData?.pubkey }
  )
}
