import { AirdropMetadata } from './../common/Airdrop'
import { PublicKey } from '@solana/web3.js'
import { ReceiptType } from '@cardinal/staking/dist/cjs/programs/stakePool'

export type StakePoolMetadata = {
  name: string
  displayName: string
  pubkey: PublicKey
  filters?: {
    type: 'creators' | 'symbol' | 'issuer'
    value: string | string[]
  }[]
  receiptType?: ReceiptType
  colors?: {
    primary: string
    secondary: string
    accent?: string
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
    imageUrl: '/logo-colored.png',
    colors: {
      primary: 'rgb(54,21,38,0.9)',
      secondary: 'rgb(157,120,138, 0.6)',
    },
  },
  {
    name: 'MetaOps',
    displayName: 'MetaOps Founders Passes Vault',
    pubkey: new PublicKey('BeunK2rKRNXbL6YsMkKDPD4f24Ms4dcj2JpsN6KCjBjY'),
    websiteUrl: 'https://metaopsgaming.com/',
    receiptType: ReceiptType.Original,
    imageUrl:
      'https://www.metaopsvault.com/img/staking_hub_header_logo.0b7bc420.png',
    maxStaked: 2000,
    colors: {
      primary: '#000000',
      secondary: '#4da1de',
      accent: '#1fcfb11c',
      fontColor: '#FFFFFF',
    },
  },
]
