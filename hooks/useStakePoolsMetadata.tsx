import { useDataHook } from './useDataHook'
import { StakePoolMetadata, stakePoolMetadatas } from 'api/mapping'
import { PublicKey } from '@solana/web3.js'

export const useStakePoolsMetadatas = (mintIds: PublicKey[] | undefined) => {
  return useDataHook<{ [mintId: string]: StakePoolMetadata }>(
    async () =>
      (mintIds || []).reduce((acc, mintId) => {
        const stakePoolMetadata = stakePoolMetadatas.find(
          (md) => md.pubkey.toString() === mintId.toString()
        )
        return { ...acc, [mintId.toString()]: stakePoolMetadata }
      }, {}),
    [mintIds?.toString()],
    { name: 'useStakePoolsMetadatas' }
  )
}
