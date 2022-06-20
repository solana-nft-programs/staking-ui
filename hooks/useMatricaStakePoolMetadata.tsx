import { StakePoolMetadata, stakePoolMetadatas } from 'api/mapping'
import { useQuery } from 'react-query'
import { useStakePoolId } from './useStakePoolId'

export const useMatricaStakePoolMetadata = () => {
  const stakePoolId = useStakePoolId()
  return useQuery<StakePoolMetadata | undefined>(
    ['useMatricaStakePoolMetadata', stakePoolId?.toString()],
    async () => {
      if (!stakePoolId) return;

      const f = await fetch(`http://localhost:5001/api/staking/${stakePoolId.toBase58()}`).then(res => {
        return res.json();
      });

      console.log(f);

      return f;
    }
  )
}
