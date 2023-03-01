import { PublicKey } from '@solana/web3.js'
import { useQuery } from '@tanstack/react-query'
import { useTokenList } from 'hooks/useTokenList'

import { useMintMetadata } from './useMintMetadata'

export const useMintSymbol = (mint: PublicKey | undefined) => {
  const isSol = mint?.toString() === PublicKey.default.toString()
  const tokenList = useTokenList()
  const mintMetadata = useMintMetadata(mint)

  return useQuery<string | undefined>(
    ['useRewardMintSymbol', mint?.toString()],
    async () => {
      if (!mint) return
      if (isSol) return 'SOL'
      if (mintMetadata.data) {
        return mintMetadata.data.data.symbol.replace(/\0/g, '')
      }
      const token = await tokenList?.data?.find((token) => {
        return token.address === mint.toString()
      })
      return token?.symbol
    },
    {
      enabled: mintMetadata.isFetched && tokenList.isFetched && !!mint,
    }
  )
}
