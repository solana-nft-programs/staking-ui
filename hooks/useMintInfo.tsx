import type { PublicKey } from '@solana/web3.js'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useQuery } from 'react-query'
import type { Mint } from 'spl-token-v3'
import { getMint } from 'spl-token-v3'

export const useMintInfo = (mint: PublicKey | undefined) => {
  const { secondaryConnection } = useEnvironmentCtx()
  return useQuery<Mint | undefined>(
    ['useRewardMintInfo', mint?.toString()],
    async () => {
      if (!mint) return
      const mintInfo = await getMint(secondaryConnection, mint)
      return mintInfo
    },
    {
      enabled: !!mint,
    }
  )
}
