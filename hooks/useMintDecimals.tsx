import type { PublicKey } from '@solana/web3.js'
import { useQuery } from '@tanstack/react-query'
import { useMintInfo } from 'hooks/useMintInfo'

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
