import { stakePoolMetadatas } from 'api/mapping'

import { useStakePoolId } from './useStakePoolId'

export const useStakePoolMaxStaked = () => {
  const stakePoolId = useStakePoolId()
  const addressMapping = stakePoolMetadatas.find((p) =>
    stakePoolId?.equals(p.stakePoolAddress)
  )
  return addressMapping?.maxStaked || 0
}
