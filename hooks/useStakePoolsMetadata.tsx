import { StakePoolMetadata, stakePoolMetadatas } from 'api/mapping'
import { PublicKey } from '@solana/web3.js'
import { useQuery } from 'react-query'

export const useStakePoolsMetadatas = (
  stakePoolIds: PublicKey[] | undefined
) => {
  return useQuery<{ [mintId: string]: StakePoolMetadata }>(
    ['useStakePoolsMetadatas', stakePoolIds?.toString()],
    async () =>
      (stakePoolIds || []).reduce((acc, mintId) => {
        const stakePoolMetadata = stakePoolMetadatas.find(
          (md) => md.stakePoolAddress.toString() === mintId.toString()
        )
        return { ...acc, [mintId.toString()]: stakePoolMetadata }
      }, {})
  )
}
