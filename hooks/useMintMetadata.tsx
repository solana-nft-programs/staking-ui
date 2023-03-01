import { Metadata } from '@metaplex-foundation/mpl-token-metadata'
import type { PublicKey } from '@solana/web3.js'
import { useQuery } from '@tanstack/react-query'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'

export const useMintMetadata = (mint: PublicKey | undefined) => {
  const { connection } = useEnvironmentCtx()
  return useQuery(
    ['useMintMetadata', mint?.toString()],
    async () => {
      if (!mint) return
      const metadata = await Metadata.fromAccountAddress(connection, mint)
      return metadata
    },
    {
      enabled: !!mint,
    }
  )
}
