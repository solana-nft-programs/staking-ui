import { useDataHook } from './useDataHook'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useWalletId } from './useWalletId'
import { getStakePoolsByAuthority } from 'api/stakeApi'
import { AccountData } from '@cardinal/common'
import { StakePoolData } from '@cardinal/staking/dist/cjs/programs/stakePool'

export const useStakePoolsByAuthority = () => {
  const { connection } = useEnvironmentCtx()
  const walletId = useWalletId()

  return useDataHook<AccountData<StakePoolData>[]>(
    async () => {
      if (!walletId) return
      return getStakePoolsByAuthority(connection, walletId)
    },
    [walletId?.toString()],
    { name: 'useStakePoolsByAuthority' }
  )
}
