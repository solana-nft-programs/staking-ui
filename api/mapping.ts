import { AirdropMetadata } from './../common/Airdrop';
import { PublicKey } from '@solana/web3.js'

export type StakePoolMetadata = {
  name: string
  displayName: string
  pubkey: PublicKey
  filters?: {
    type: 'creators' | 'symbol' | 'issuer'
    value: string | string[]
  }[],
  airdrops?: AirdropMetadata[],
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
  // {
  //   name: 'dev-portals',
  //   displayName: 'Devnet Portals',
  //   pubkey: new PublicKey('5d95j6oKikwbLfB1EeHGZMzNk5UrKoKaqPJgD23kBfhi'),
  //   filters: [
  //     {
  //       type: 'creators',
  //       value: ['5grvMeoBqv5ZdHq9JMy5RrxLPNAt1nzc9cpqYWFUwizz'],
  //     },
  //   ],
  //   airdrops: [
  //     {
  //       name: 'Portals',
  //       symbol: 'PRTL',
  //       uri: 'https://arweave.net/-QsrbBfmFy4Fxp-BtSnSFiajm_KECo5ctRXR6uSBS5k',
  //     },
  //     {
  //       name: 'Portals',
  //       symbol: 'PRTL',
  //       uri: 'https://arweave.net/RewRYM3lf-1Ry1hitgsiXuqsuERSujlTAChgl9S483c',
  //     },
  //     {
  //       name: 'Portals',
  //       symbol: 'PRTL',
  //       uri: 'https://arweave.net/6ZcTxyREtg0WsOSGSBq-CSyQ3DPlU1k4R_A7mrgehRE',
  //     },
  //   ],
  // },
  {
    name: 'portals',
    displayName: 'Portals',
    pubkey: new PublicKey('5pTqPBTBvbueU6PQWcthcyAwKBjcu89GoPRNtD3AKEJZ'),
    maxStaked: 10000,
  },
]
