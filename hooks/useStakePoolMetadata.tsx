import { StakePoolMetadata, stakePoolMetadatas } from 'api/mapping'
import { useDataHook } from './useDataHook'
import { useStakePoolId } from './useStakePoolId'

export const useStakePoolMetadata = () => {
  const stakePoolId = useStakePoolId()
  return useDataHook<StakePoolMetadata | undefined>(
    async () => {
      if (!stakePoolId) return
      return stakePoolMetadatas.find(
        (p) => p.pubkey.toString() === stakePoolId.toString()
      )
    },
    [stakePoolId?.toString()],
    { name: 'stakePoolMetadata' }
  )
}
