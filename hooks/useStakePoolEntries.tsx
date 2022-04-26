import { AccountData } from '@cardinal/common'
import { StakeEntryData } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { getActiveStakeEntriesForPool } from '@cardinal/staking/dist/cjs/programs/stakePool/accounts'
import { useDataHook } from './useDataHook'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useStakePoolData } from './useStakePoolData'

export const useStakePoolEntries = () => {
  const { connection } = useEnvironmentCtx()
  const stakePool = useStakePoolData()

  return useDataHook<AccountData<StakeEntryData>[] | undefined>(async () => {
    if (stakePool?.data?.pubkey) {
      return getActiveStakeEntriesForPool(connection, stakePool.data.pubkey)
    }
  }, [stakePool?.data?.pubkey.toString()])
}
