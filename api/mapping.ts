import { PublicKey } from '@solana/web3.js'

export type StakePoolMetadata = {
  name: string
  displayName: string
  pubkey: PublicKey
  imageUrl?: string
  websiteUrl?: string
  maxStaked?: number
}

export const stakePoolMetadatas: StakePoolMetadata[] = [
  {
    name: 'cardinal',
    displayName: 'Cardinal',
    pubkey: new PublicKey('4bsRsyCSSMgFSNJAi5wvh4UX9vMZDf1MwUrHUszfmLbb'),
    imageUrl: './logo-colored.png',
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
    maxStaked: 10000
  },
]
