import { tryPublicKey } from '@cardinal/common'
import { PublicKey } from '@solana/web3.js'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'

import { useStakePoolMetadata } from './useStakePoolMetadata'

export const useStakePoolId = () => {
  const stakePoolMetadata = useStakePoolMetadata()
  const {
    query: { stakePoolId },
  } = useRouter()

  return useQuery<PublicKey | undefined>(
    ['useStakePoolId', stakePoolId?.toString()],
    async () => {
      if (stakePoolMetadata.data)
        return new PublicKey(stakePoolMetadata.data.stakePoolAddress)
      return tryPublicKey(stakePoolId) ?? undefined
    },
    {
      enabled: !!stakePoolId && !!stakePoolMetadata.isFetched,
    }
  )
}
