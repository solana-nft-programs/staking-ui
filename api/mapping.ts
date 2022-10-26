import { ReceiptType } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { PublicKey } from '@solana/web3.js'
import type { CSSProperties } from 'react'

import type { AirdropMetadata } from '../common/Airdrop'

export enum TokenStandard {
  // Fungible, can have more than 1
  Fungible = 1,
  // Non fungible are all unique
  NonFungible = 2,
  // No receipt
  None = 3,
}

export type Analytic = {
  metadata?: {
    key: string
    type: 'staked'
    totals?: {
      key: string
      value: number
    }[]
  }
}

export type StakePoolMetadata = {
  // Name of this stake pool used as an id. Should be in lower-case kebab-case since it is used in the URL as /{name}
  // https://www.theserverside.com/blog/Coffee-Talk-Java-News-Stories-and-Opinions/Why-you-should-make-kebab-case-a-URL-naming-convention-best-practice
  name: string
  // Display name to be displayed in the header. Often the same as name but with capital letters and spaces
  displayName: string
  // Whether or not to show name in header, defaults false
  nameInHeader?: boolean
  // Publickey for this stake pool
  stakePoolAddress: PublicKey
  // Description for this stake pool
  description?: string
  // Default receipt type. Setting this will remove the option for the user to choose which receipt type to use
  receiptType?: ReceiptType
  // Default empty. Setting this will tell the UI to only show tokens of that standard. Supports fungible or non-fungible
  tokenStandard?: TokenStandard
  // Optional config to hide this pool from the main page
  hidden?: boolean
  // Optional config to disable finding this pool
  notFound?: boolean
  // Optional hostname to remap
  hostname?: string
  // Optional hide footer
  hideFooter?: boolean
  // Optional config to link redirect to page when you click on this pool
  redirect?: string
  // Hide allowed tokens style
  hideAllowedTokens?: boolean
  // styles to apply to the whole stake pool
  styles?: CSSProperties
  // Contrast homepage background
  contrastHomepageBkg?: boolean
  // Colors object to style the stake page
  colors?: {
    primary: string
    secondary: string
    accent?: string
    fontColor?: string
    fontColorSecondary?: string
    backgroundSecondary?: string
  }
  // Disallow regions based on IP address
  disallowRegions?: { code: string; subdivision?: string }[]
  // If the logo should be displayed with paddding
  logoPadding?: boolean
  // Optional social links
  socialLinks?: []
  // Image url to be used as the icon in the pool selector and the header
  imageUrl?: string
  // Secondary image url to be used next to the icon in the pool selector and the header
  secondaryImageUrl?: string
  // Background image for pool
  backgroundImage?: string
  // Website url if specified will be navigated to when the image in the header is clicked
  websiteUrl?: string
  // Max staked is used to compute percentage of total staked
  maxStaked?: number
  // Links to show at the top right of the page
  links?: { text: string; value: string }[]
  // On devnet when you click the airdrop button on this page it will clone NFTs with this metadata and airdrop to the user. These will not contain verified creators
  airdrops?: AirdropMetadata[]
  // Analytics to show at the top of stake pool. supports trait based analytics and overall tokens data
  analytics?: Analytic[]
}

export const defaultSecondaryColor = 'rgba(29, 78, 216, 255)'

export const stakePoolMetadatas: StakePoolMetadata[] = [
  // {
  //   name: 'cardinal',
  //   displayName: 'Cardinal',
  //   stakePoolAddress: new PublicKey(
  //     'AxHiaxZeoDsyjD8Eyj5tQtrajkxYk5xebEK1QNQ1LSE7'
  //   ),
  //   imageUrl: '/logo-colored.png',
  //   colors: {
  //     primary: 'rgb(54,21,38,0.9)',
  //     secondary: 'rgb(157,120,138, 0.6)',
  //   },
  // },
{
    name: 'MetaMercs',
    displayName: 'METAMERCS',
    nameInHeader: true,
    stakePoolAddress: new PublicKey(
      'G9nryHatSzQQ93ehjNejhiZpmgzQsRxZVTzLSxiDp8uU'
    ),
    hostname: 'vaults.metacreed.com',
    hideFooter: true,
    hideAllowedTokens: true,
    websiteUrl: 'https://www.metacreed.com/',
    receiptType: ReceiptType.Original,
    tokenStandard: TokenStandard.NonFungible,
    // styles to apply to the whole stake pool
    styles: {
      fontFamily: 'Industry, sans-serif',
      fontWeight: 500,
    },
    // Colors object to style the stake page
    colors: {
      primary: '#181818',
      secondary: '#177b7b',
      backgroundSecondary: 'rgb(24 24 24 / 90%)',
      fontColor: '#F2F2F2',
    },
    imageUrl:
      'https://tz7u3k2viityfxxdjyjaqlvuan4doqvfzin6jbvp5cbiivqk25ja.arweave.net/nn9Nq1VCJ4Le404SCC60A3g3QqXKG-SGr-iChFYK11I',
    // Background image for poolq
    backgroundImage:
      'https://raw.githubusercontent.com/DicersN00b/loots-logo/main/BG%20STAKING.png',

    // Website url if specified will be navigated to when the image in the header is clicked
    maxStaked: 777,
    links: [
      {
        text: 'MetaCreed',
        value: 'https://www.metacreed.com/',
      },
      {
        text: 'Twitter',
        value: 'https://twitter.com/metacreed',
      },
      {
        text: 'Discord',
        value: 'https://discord.com/invite/metacreed',
      },
      {
        text: 'Buy MetaMercs',
        value: 'https://hyperspace.xyz/collection/4Wo6Yuv9Den1DHuv8GmFDhA8cwGa28ToaXRwLwCRUqAX',  
      },
      },
    ]
