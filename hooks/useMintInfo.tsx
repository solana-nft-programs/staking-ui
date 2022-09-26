import * as splToken from '@solana/spl-token'
import type { PublicKey } from '@solana/web3.js'
import { Keypair } from '@solana/web3.js'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useQuery } from 'react-query'

export const useMintInfo = (mint: PublicKey | undefined) => {
  const { secondaryConnection } = useEnvironmentCtx()
  return useQuery<splToken.MintInfo | undefined>(
    ['useRewardMintInfo', mint?.toString()],
    async () => {
      if (!mint) return
      const mintResult = new splToken.Token(
        secondaryConnection,
        mint,
        splToken.TOKEN_PROGRAM_ID,
        Keypair.generate() // not used
      )
      const mintInfo = await mintResult.getMintInfo()
      return mintInfo
    },
    {
      enabled: !!mint,
    }
  )
}
