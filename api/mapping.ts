import { PublicKey } from '@solana/web3.js'

export type StakePoolMetadata = {
  name: string
  displayName: string
  pubkey: PublicKey
  imageUrl?: string
}

export const stakePoolMetadatas: StakePoolMetadata[] = [
  {
    name: 'cardinal',
    displayName: 'Cardinal',
    pubkey: new PublicKey('4bsRsyCSSMgFSNJAi5wvh4UX9vMZDf1MwUrHUszfmLbb'),
    imageUrl: './logo.svg',
  },
  {
    name: 'jambo',
    displayName: 'Jambo Mambo',
    pubkey: new PublicKey('9L86DUzzHDQtWyhooEj7d6g44aSqCGYf49WFRkdTyJnt'),
  },
]
