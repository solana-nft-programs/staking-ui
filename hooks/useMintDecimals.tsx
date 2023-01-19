import { PublicKey } from '@solana/web3.js'
import { useMintInfo } from 'hooks/useMintInfo'
import { useQuery } from 'react-query'

export const useMintDecimals = (mint: PublicKey | undefined) => {
  const { data: mintInfo } = useMintInfo(
    mint?.toString() === PublicKey.default.toString() ? undefined : mint
  )

  const isSol = () => {
    return mint?.toString() === PublicKey.default.toString()
  }

  return useQuery<number | undefined>(
    ['useRewardMintInfo', mint?.toString()],
    async () => {
      if (!mint) return

      if (isSol()) return 9

      return mintInfo?.decimals
    },
    {
      enabled: !!mint, // make sure u have mintInfo.isFetched as a boolean for whether useMintDEcimals is enabled
    }
  )
}
