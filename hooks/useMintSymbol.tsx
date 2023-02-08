import { PublicKey } from '@solana/web3.js'
import { useTokenList } from 'hooks/useTokenList'
import { useQuery } from '@tanstack/react-query'

export const useMintSymbol = (mint: PublicKey | undefined) => {
  const isSol = mint?.toString() === PublicKey.default.toString()
  const tokenList = useTokenList()

  return useQuery<string | undefined>(
    ['useRewardMintSymbol', mint?.toString()],
    async () => {
      if (!mint) return
      if (isSol) return 'SOL'
      const token = await tokenList?.data?.find((token) => {
        return token.address === mint.toString()
      })

      return token?.symbol
    },
    {
      enabled: tokenList.isFetched && !!mint,
    }
  )
}
