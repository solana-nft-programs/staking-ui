import { PublicKey } from '@solana/web3.js'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useQuery } from 'react-query'
import type { Mint } from 'spl-token-v3'
import { getMint } from 'spl-token-v3'

export const useMintInfo = (mint: PublicKey | undefined) => {
  const isSol = mint?.toString() === PublicKey.default.toString()

  const { secondaryConnection } = useEnvironmentCtx()
  return useQuery<Mint | undefined>(
    ['useRewardMintInfo', mint?.toString()],
    async () => {
      if (!mint) return
      console.log('mint', mint.toString())
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
