import { tryPublicKey } from '@cardinal/namespaces-components'
import { stakePoolMetadatas } from 'api/mapping'
import { useRouter } from 'next/router'

export const useStakePoolId = () => {
  const {
    query: { stakePoolId },
  } = useRouter()
  const nameMapping = stakePoolMetadatas.find((p) => p.name === stakePoolId)
  const addressMapping = stakePoolMetadatas.find(
    (p) => p.stakePoolAddress.toString() === stakePoolId
  )
  const publicKey =
    nameMapping?.stakePoolAddress ||
    addressMapping?.stakePoolAddress ||
    tryPublicKey(stakePoolId)

  return publicKey
}
