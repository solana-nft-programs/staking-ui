import { tryPublicKey } from '@cardinal/common'
import { PublicKey } from '@solana/web3.js'
import { useRouter } from 'next/router'
import { useStakePoolMetadataCtx } from 'providers/StakePoolMetadataProvider'
import { useQuery } from '@tanstack/react-query'

export const useStakePoolId = () => {
  const stakePoolMetadata = useStakePoolMetadataCtx()
  const {
    query: { stakePoolId },
  } = useRouter()

  return useQuery<PublicKey | undefined>(
    [
      'useStakePoolId',
      stakePoolId?.toString(),
      stakePoolMetadata.data?.stakePoolAddress.toString(),
    ],
    async () => {
      if (stakePoolMetadata.data)
        return new PublicKey(stakePoolMetadata.data.stakePoolAddress)
      return tryPublicKey(stakePoolId) ?? undefined
    }
  )
}
