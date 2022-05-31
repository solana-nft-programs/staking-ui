import { useQuery } from 'react-query'

export type TokenListData = {
  chainId: number
  address: string
  symbol: string
  name: string
  decimals: number
  logoURI: string
  tags: string[]
}

export const useTokenList = () => {
  return useQuery<TokenListData[] | undefined>(
    ['useTokenList'],
    async () => {
      return await fetch(
        'https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json'
      )
        .then((response) => response.json())
        .then((data) => data['tokens'])
    },
    {
      retry: 2,
    }
  )
}
