import { AccountData } from '@cardinal/common'
import { StakeEntryData } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { getAllStakeEntries } from '@cardinal/staking/dist/cjs/programs/stakePool/accounts'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useQuery } from 'react-query'
import { useStakePoolId } from './useStakePoolId'

export const useAllStakeEntries = () => {
  const { secondaryConnection } = useEnvironmentCtx()
  const stakePoolId = useStakePoolId()
  return useQuery<AccountData<StakeEntryData>[] | undefined>(
    ['useAllStakeEntries', stakePoolId?.toString()],
    async () => {
      return getAllStakeEntries(secondaryConnection)
    }
  )
}
