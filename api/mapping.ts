import { AirdropMetadata } from './../common/Airdrop'
import { PublicKey } from '@solana/web3.js'
import { ReceiptType } from '@cardinal/staking/dist/cjs/programs/stakePool'

export type StakePoolMetadata = {
  name: string
  displayName: string
  stakePoolAddress: PublicKey
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
    stakePoolAddress: new PublicKey(
      '4bsRsyCSSMgFSNJAi5wvh4UX9vMZDf1MwUrHUszfmLbb'
    ),
    imageUrl: '/logo-colored.png',
    colors: {
      primary: 'rgb(54,21,38,0.9)',
      secondary: 'rgb(157,120,138, 0.6)',
    },
  },
  {
    name: 'blockasset',
    displayName: 'Blockasset',
    stakePoolAddress: new PublicKey(
      '3BZCupFU6X3wYJwgTsKS2vTs4VeMrhSZgx4P2TfzExtP'
    ),
    websiteUrl: 'https://blockasset.co/',
    receiptType: ReceiptType.Original,
    imageUrl:
      'https://blockasset.co/static/logo-e51ac9985ba7aef4ac8c1b1ae1c00511.png',
    maxStaked: 11791,
    colors: {
      primary: '#000000',
      secondary: '#4da1de',
      accent: '#1fcfb11c',
      fontColor: '#FFFFFF',
    },
    airdrops: [
      {
        name: 'Blockasset Legends',
        symbol: 'LEGENDS',
        uri: 'https://arweave.net/Q5y8_OehSOYCkGiX-hV1H6qiczoDaVdk4Eyi4lhhdQE',
      },
    ],
    filters: [
      {
        type: 'creators',
        value: [
          'GghbWF9xtKmJCp7JMSo4HNZ8dwGkSjRyWm1vNC58jZES',
          'H2oh994VjarQ5m69wUSaahQrHLefmjRa1WoipV7brWqd',
        ],
      },
    ],
  },
  {
    name: 'meta-ops',
    displayName: 'MetaOps PFP Vault',
    stakePoolAddress: new PublicKey(
      'FP9BRAohGJDximSTa9HR3UNCd9KA5QUApyctMpASrsJp'
    ),
    websiteUrl: 'https://metaopsgaming.com/',
    receiptType: ReceiptType.Original,
    imageUrl:
      'https://www.metaopsvault.com/img/staking_hub_header_logo.0b7bc420.png',
    maxStaked: 5555,
    colors: {
      primary: '#000000',
      secondary: '#4da1de',
      accent: '#1fcfb11c',
      fontColor: '#FFFFFF',
    },
  },
  {
    name: 'meta-ops-founders-vault',
    displayName: 'MetaOps Founders Passes Vault',
    stakePoolAddress: new PublicKey(
      'BeunK2rKRNXbL6YsMkKDPD4f24Ms4dcj2JpsN6KCjBjY'
    ),
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
  {
    name: 'okaybulls',
    displayName: 'Okaybulls',
    stakePoolAddress: new PublicKey(
      '34Mu6xQSWzJDwyXrQcbmuRA6JjJQEWwwzhFubmrGD2qx'
    ),
    websiteUrl: 'https://okaybulls.com/',
    receiptType: ReceiptType.Original,
    imageUrl:
      'https://rawcdn.githack.com/okaybulls/token/114a638611c6564e7aa4c7cd70d2b5359a6968c5/logo.png',
    maxStaked: 10000,
    colors: {
      primary: '#1C1C1C',
      secondary: '#F4431C',
      accent: '#F4431C',
      fontColor: '#FFFFFF',
    },
  },
]
