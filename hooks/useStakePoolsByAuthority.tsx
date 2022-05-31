import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useWalletId } from './useWalletId'
import { getStakePoolsByAuthority } from 'api/stakeApi'
import { AccountData } from '@cardinal/common'
import { StakePoolData } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { useQuery } from 'react-query'

export const useStakePoolsByAuthority = () => {
  const { connection } = useEnvironmentCtx()
  const walletId = useWalletId()

  return useQuery<AccountData<StakePoolData>[] | undefined>(
    ['useStakePoolsByAuthority', walletId?.toString()],
    async () => {
      if (!walletId) return
      return getStakePoolsByAuthority(connection, walletId)
    },
    {
      enabled: !!walletId,
    }
  )
}
