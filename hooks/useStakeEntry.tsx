import type { IdlAccountData } from '@solana-nft-programs/rewards-center'
import {
  fetchIdlAccount,
  findStakeEntryId as findStakeEntryIdV2,
} from '@solana-nft-programs/rewards-center'
import { getStakeEntry } from '@solana-nft-programs/staking/dist/cjs/programs/stakePool/accounts'
import { findStakeEntryId } from '@solana-nft-programs/staking/dist/cjs/programs/stakePool/pda'
import type { PublicKey } from '@solana/web3.js'
import { useQuery } from '@tanstack/react-query'
import { stakeEntryDataToV2 } from 'api/fetchStakeEntry'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'

import { isStakePoolV2, useStakePoolData } from './useStakePoolData'
import { useWalletId } from './useWalletId'

export const useStakeEntry = (mintId: PublicKey | null) => {
  const walletId = useWalletId()
  const { data: stakePoolData } = useStakePoolData()
  const { connection } = useEnvironmentCtx()

  return useQuery<Pick<
    IdlAccountData<'stakeEntry'>,
    'pubkey' | 'parsed'
  > | null>(
    ['useStakeEntry', mintId?.toString()],
    async () => {
      if (!stakePoolData) return null
      if (!mintId) return null
      if (isStakePoolV2(stakePoolData.parsed)) {
        const stakeEntryId = findStakeEntryIdV2(stakePoolData?.pubkey, mintId)
        return fetchIdlAccount(connection, stakeEntryId, 'stakeEntry')
      } else {
        const stakeEntryId = findStakeEntryId(
          walletId ?? stakePoolData?.pubkey,
          stakePoolData?.pubkey,
          mintId,
          false
        )
        const stakeEntry = await getStakeEntry(connection, stakeEntryId)
        return {
          pubkey: stakeEntryId,
          parsed: stakeEntryDataToV2(stakeEntry.parsed),
        }
      }
    },
    {
      enabled: !!stakePoolData?.parsed && !!mintId,
    }
  )
}
