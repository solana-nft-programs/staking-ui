import { StakePoolMetadata, stakePoolMetadatas } from 'api/mapping'
import { PublicKey } from '@solana/web3.js'
import { useQuery } from 'react-query'

export const useStakePoolsMetadatas = (mintIds: PublicKey[] | undefined) => {
  return useQuery<{ [mintId: string]: StakePoolMetadata }>(
    ['useStakePoolsMetadatas', mintIds?.toString()],
    async () =>
      (mintIds || []).reduce((acc, mintId) => {
        const stakePoolMetadata = stakePoolMetadatas.find(
          (md) => md.stakePoolAddress.toString() === mintId.toString()
        )
        return { ...acc, [mintId.toString()]: stakePoolMetadata }
      }, {})
  )
}
