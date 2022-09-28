import { stakePoolMetadatas } from 'api/mapping'

import { useStakePoolId } from './useStakePoolId'

export const useStakePoolMaxStaked = () => {
  const stakePoolId = useStakePoolId()
  const addressMapping = stakePoolMetadatas.find(
    (p) => stakePoolId?.toString() === p.stakePoolAddress.toString()
  )
  return addressMapping?.maxStaked
}
