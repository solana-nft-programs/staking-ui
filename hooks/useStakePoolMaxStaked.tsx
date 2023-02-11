import { useQuery } from '@tanstack/react-query'

import { useAllStakePools } from './useAllStakePools'
import { useStakePoolId } from './useStakePoolId'

export const useStakePoolMaxStaked = () => {
  const { data: stakePoolId } = useStakePoolId()
  const allStakePools = useAllStakePools()

  return useQuery<number | null>(
    ['useStakePoolMaxStaked', stakePoolId?.toString()],
    async () => {
      const addressMapping = allStakePools.data?.stakePoolsWithMetadata.find(
        (p) => stakePoolId?.toString() === p.stakePoolMetadata?.stakePoolAddress
      )
      return addressMapping?.stakePoolMetadata?.maxStaked ?? null
    },
    {
      enabled: !!stakePoolId && !!allStakePools.isFetched,
    }
  )
}
