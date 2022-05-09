import { useStakePoolId } from './useStakePoolId'
import { stakePoolMetadatas } from 'api/mapping'

export const useStakePoolMaxStaked = () => {
  const stakePoolId = useStakePoolId()
  const addressMapping = stakePoolMetadatas.find((p) =>
    stakePoolId?.equals(p.stakePoolAddress)
  )
  return addressMapping?.maxStaked || 0
}
