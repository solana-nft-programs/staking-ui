import { useQuery } from 'react-query'

import { useAllStakePools } from './useAllStakePools'
import { useStakePoolId } from './useStakePoolId'

export const useStakePoolMaxStaked = () => {
  const { data: stakePoolId } = useStakePoolId()
  const allStakePools = useAllStakePools()

  return useQuery<number | undefined>(
    ['useStakePoolMaxStaked', stakePoolId?.toString()],
    async () => {
      const addressMapping = allStakePools.data?.stakePoolsWithMetadata.find(
        (p) => stakePoolId?.toString() === p.stakePoolMetadata?.stakePoolAddress
      )
      return addressMapping?.stakePoolMetadata?.maxStaked
    },
    {
      enabled: !!stakePoolId && !!allStakePools.isFetched,
    }
  )
}
