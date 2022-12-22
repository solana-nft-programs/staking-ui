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

const additionalMints = [
  {
    address: '3kTyEHWsBZRv1JYD9cpqXszxN9QKQcGwatZypc8Jd1rJ',
    chainId: 101,
    decimals: 6,
    logoURI: '/logos/parcl-brooklyn.png',
    name: 'Brooklyn',
    symbol: 'BKLYN',
  },
  {
    address: 'AHy2PUr792akfDJwpm4s48eq3QfiNLAaSqzTCADWMp2x',
    chainId: 101,
    decimals: 6,
    logoURI: '/logos/parcl-san-francisco.png',
    name: 'San Francisco',
    symbol: 'SFO',
  },
  {
    address: '5AHQCZR4dM1y2uhpaZfK4FKXtKf2pXs9NHZi89WCH3Bg',
    chainId: 101,
    decimals: 6,
    logoURI: '/logos/parcl-manhattan.png',
    name: 'Manhattan',
    symbol: 'MANH',
  },
  {
    address: '6Ex3NmEvL3aqEovWGgjaW8qaKkcZgmfb8cNSoPPspCET',
    chainId: 101,
    decimals: 6,
    logoURI: '/logos/parcl-phoenix.png',
    name: 'Phoenix',
    symbol: 'PHX',
  },
  {
    address: 'HpPh8TBTB9tECEFzPpryurFCZbgwWcrkx44kw35zHZtX',
    chainId: 101,
    decimals: 6,
    logoURI: '/logos/parcl-los-angeles.png',
    name: 'Los Angeles',
    symbol: 'LAX',
  },
  {
    address: 'GbGbPxqoeJjq3AaesnWLEFnLvnmfxCcNk6rrJUqj5KYQ',
    chainId: 101,
    decimals: 6,
    logoURI: '/logos/parcl-miami.png',
    name: 'Miami',
    symbol: 'MIA',
  },
  {
    address: '4Up16GyRmybEEDfaCsDszkzkvtWgoKDtS4cUyBEjvPBM',
    chainId: 101,
    name: 'Vandal City Vault',
    symbol: 'VAULT',
    verified: true,
    decimals: 9,
    logoURI:
      'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/4Up16GyRmybEEDfaCsDszkzkvtWgoKDtS4cUyBEjvPBM/logo.png',
    tags: ['gaming-token', 'social-token'],
  },
]

export const useTokenList = () => {
  return useQuery<TokenListData[] | undefined>(
    ['useTokenList'],
    async () => {
      return await fetch('https://token-list-api.solana.cloud/v1/list')
        .then((response) => response.json())
        .then((data) => {
          return [...additionalMints, ...data['content']]
        })
    },
    {
      retry: false,
    }
  )
}
