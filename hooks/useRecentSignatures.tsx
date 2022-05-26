import { ConfirmedSignatureInfo, PublicKey } from '@solana/web3.js'
import { Connection } from '@solana/web3.js'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'

import { useDataHook } from './useDataHook'

export const useRecentSignatures = (address: PublicKey | undefined) => {
  const { environment } = useEnvironmentCtx()
  const connection = new Connection(environment.primary, {
    commitment: 'confirmed',
  })
  return useDataHook<ConfirmedSignatureInfo[] | undefined>(
    async () => {
      if (!address) return
      return connection.getSignaturesForAddress(
        address,
        { limit: 10 },
        'confirmed'
      )
    },
    [address?.toString()],
    { name: 'useRecentSignatures', refreshInterval: 3000 }
  )
}
