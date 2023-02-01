import type { PublicKey } from '@solana/web3.js'
import type { StakePoolMetadata } from 'api/mapping'
import { useQuery } from 'react-query'

import { useAllStakePools } from './useAllStakePools'

export const useStakePoolsMetadatas = (
  stakePoolIds: PublicKey[] | undefined
) => {
  const allStakePools = useAllStakePools()
  return useQuery<{ [mintId: string]: StakePoolMetadata }>(
    ['useStakePoolsMetadatas', stakePoolIds?.toString()],
    async () =>
      (stakePoolIds || []).reduce((acc, mintId) => {
        const stakePoolMetadata =
          allStakePools.data?.stakePoolsWithMetadata.find(
            (md) =>
              md.stakePoolMetadata?.stakePoolAddress.toString() ===
              mintId.toString()
          )
        return { ...acc, [mintId.toString()]: stakePoolMetadata }
      }, {}),
    {
      enabled: !!allStakePools.isFetched,
    }
  )
}
