import { tryPublicKey } from '@cardinal/namespaces-components'
import { stakePoolMetadatas } from 'api/mapping'
import { useRouter } from 'next/router'

export const useStakePoolId = () => {
  const {
    query: { stakePoolId },
  } = useRouter()
 
  const publicKey = tryPublicKey(stakePoolId)

  return publicKey
}

 // const nameMapping = stakePoolMetadatas.find((p) => p.name === stakePoolId)
  // const addressMapping = stakePoolMetadatas.find(
  //   (p) => p.stakePoolAddress.toString() === stakePoolId
  // )