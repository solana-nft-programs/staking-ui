import { AccountData } from '@cardinal/common'
import { StakeEntryData } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { getActiveStakeEntriesForPool } from '@cardinal/staking/dist/cjs/programs/stakePool/accounts'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useQuery } from 'react-query'
import { useStakePoolId } from './useStakePoolId'

export const useStakePoolEntries = () => {
  const { connection } = useEnvironmentCtx()
  const stakePoolId = useStakePoolId()
  return useQuery<AccountData<StakeEntryData>[] | undefined>(
    ['useStakePoolEntries', stakePoolId?.toString()],
    async () => {
      if (stakePoolId) {
        return getActiveStakeEntriesForPool(connection, stakePoolId)
      }
    },
    { enabled: !!stakePoolId }
  )
}
