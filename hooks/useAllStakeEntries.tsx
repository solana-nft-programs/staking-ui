import type { IdlAccountData } from '@cardinal/rewards-center'
import { rewardsCenterProgram } from '@cardinal/rewards-center'
import { getAllStakeEntries } from '@cardinal/staking/dist/cjs/programs/stakePool/accounts'
import { useWallet } from '@solana/wallet-adapter-react'
import { stakeEntryDataToV2 } from 'api/fetchStakeEntry'
import { asEmptyAnchorWallet } from 'common/Wallets'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useQuery } from 'react-query'

import { useStakePoolId } from './useStakePoolId'

export const useAllStakeEntries = () => {
  const { secondaryConnection } = useEnvironmentCtx()
  const stakePoolId = useStakePoolId()
  const wallet = useWallet()

  return useQuery<
    Pick<IdlAccountData<'stakeEntry'>, 'pubkey' | 'parsed'>[] | undefined
  >(['useAllStakeEntries', stakePoolId?.toString()], async () => {
    const stakeEntriesV1 = await getAllStakeEntries(secondaryConnection)
    const program = rewardsCenterProgram(
      secondaryConnection,
      asEmptyAnchorWallet(wallet)
    )
    const stakeEntriesV2 = await program.account.stakeEntry.all()
    const allStakePoolDatas = [
      ...stakeEntriesV1.map((entry) => {
        return {
          pubkey: entry.pubkey,
          parsed: stakeEntryDataToV2(entry.parsed),
        }
      }),
      ...stakeEntriesV2.map((entry) => {
        return {
          pubkey: entry.publicKey,
          parsed: entry.account,
        }
      }),
    ]
    return allStakePoolDatas
  })
}
