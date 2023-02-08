import type { Mint } from '@solana/spl-token'
import { getMint } from '@solana/spl-token'
import { PublicKey } from '@solana/web3.js'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useQuery } from '@tanstack/react-query'

export const useMintInfo = (mint: PublicKey | undefined) => {
  const isSol = mint?.toString() === PublicKey.default.toString()

  const { secondaryConnection } = useEnvironmentCtx()
  return useQuery<Mint | undefined>(
    ['useRewardMintInfo', mint?.toString()],
    async () => {
      if (!mint) return
      if (isSol) {
        const mint: Mint = {
          address: PublicKey.default,
          decimals: 9,
          isInitialized: true,
          mintAuthority: null,
          supply: BigInt(0),
          freezeAuthority: null,
          tlvData: Buffer.from(''),
        }

        return mint
      }
      const mintInfo = await getMint(secondaryConnection, mint)
      return mintInfo
    },
    {
      enabled: !!mint,
    }
  )
}
