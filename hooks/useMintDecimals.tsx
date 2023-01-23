import type { PublicKey } from '@solana/web3.js'
import { useMintInfo } from 'hooks/useMintInfo'
import { useQuery } from 'react-query'

export const useMintDecimals = (mint: PublicKey | undefined) => {
  const mintInfo = useMintInfo(mint)

  return useQuery<number | undefined>(
    ['useRewardMintDecimals', mint?.toString()],
    async () => {
      if (!mint) return
      return mintInfo.data?.decimals ?? 9
    },
    {
      enabled: mintInfo.isFetched,
    }
  )
}
