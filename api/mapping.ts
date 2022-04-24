import { AirdropMetadata } from './../common/Airdrop'
import { PublicKey } from '@solana/web3.js'

export type StakePoolMetadata = {
  name: string
  displayName: string
  pubkey: PublicKey
  filters?: {
    type: 'creators' | 'symbol' | 'issuer'
    value: string | string[]
  }[]
  colors?: {
    primary: string
    secondary: string
    fontColor?: string
  }
  airdrops?: AirdropMetadata[]
  imageUrl?: string
  websiteUrl?: string
  maxStaked?: number
}

export const defaultSecondaryColor = 'rgba(29, 78, 216, 255)'

export const stakePoolMetadatas: StakePoolMetadata[] = [
  {
    name: 'cardinal',
    displayName: 'Cardinal',
    pubkey: new PublicKey('4bsRsyCSSMgFSNJAi5wvh4UX9vMZDf1MwUrHUszfmLbb'),
    imageUrl: './logo-colored.png',
    colors: {
      primary: 'rgb(54,21,38,0.9)',
      secondary: 'rgb(157,120,138, 0.6)',
    },
  },
  {
    name: 'jambo',
    displayName: 'Jambo Mambo',
    pubkey: new PublicKey('9L86DUzzHDQtWyhooEj7d6g44aSqCGYf49WFRkdTyJnt'),
    maxStaked: 4444,
  },
  {
    name: 'portals',
    displayName: 'Portals',
    pubkey: new PublicKey('5pTqPBTBvbueU6PQWcthcyAwKBjcu89GoPRNtD3AKEJZ'),
    imageUrl: './logos/portals.svg',
    maxStaked: 10000,
    colors: {
      primary: 'rgba(0,1,1,255)',
      secondary: 'rgba(129,221,238,255)',
      fontColor: 'rgba(0,0,0,255)',
    },
  },
]
