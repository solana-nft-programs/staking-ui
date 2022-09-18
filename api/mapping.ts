import { ReceiptType } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { sizeHeight, width } from '@mui/system'
import { PublicKey } from '@solana/web3.js'
import { relative } from 'path'
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
   {
     name: 'steamland',
     displayName: 'Harvesting - Steamland',
     stakePoolAddress: new PublicKey(
       '5n9G7o9ZZFmfx4dcbd4HgNYcGWFiQ2wGKaKHYT8bWDf7'
     ),
     maxStaked: 2222,
     receiptType: ReceiptType.Original,
     websiteUrl: 'https://steamland.io',
     hostname: 'harvest.steamland.io',
     imageUrl: '/steamland_logo.png' ,
     hidden: true,
     styles: {
      fontFamily: 'Industry, sans-serif',
      fontWeight: 500,
    },
    backgroundImage:
      '/harvesting.png',
      tokenStandard: TokenStandard.NonFungible,
      hideAllowedTokens: true,
      colors: {
      primary: '#1A1A1D',
      secondary: '#9e333f',
      accent: '#313063',
      fontColor: '#FFFFFF',
      fontColorSecondary: '#FFFFFF',
      backgroundSecondary: '#4E4E50',
    },
<<<<<<< HEAD
   },
=======
  },
  {
    name: 'thornode-elite',
    displayName: 'Elite Pass',
    stakePoolAddress: new PublicKey(
      'J79xX6CYxXZzXQSy6g6hkBnnfFs7pRDjqy4nFKjnXvu9'
    ),
    websiteUrl: 'https://stake.thornode.io',
    receiptType: ReceiptType.Original,
    maxStaked: 33, // update with collection size
    imageUrl:
      'https://v4pnvyuwfsaiymwlmqr4mvemptw2lmqyrwmilxg2prlw7qrqf3qq.arweave.net/rx7a4pYsgIwyy2QjxlSMfO2lshiNmIXc2nxXb8IwLuE?ext=gif',
    tokenStandard: TokenStandard.NonFungible,
    hideAllowedTokens: false,
    hidden: false,
    styles: {
      fontFamily: 'anton',
      fontWeight: 500,
    },
    colors: {
      primary: '#040a05',
      secondary: '#40834b',
      accent: 'rgba(31,207,101,0.11)',
      fontColor: '#e8e8e8',
    },
  },
  {
    name: 'thornode-classic',
    displayName: 'Classic Pass',
    stakePoolAddress: new PublicKey(
      '54LKhj2FY5Vg5uR6NBEQ4SiLJNRYCUX1oWxTZcUXZ8cE'
    ),
    websiteUrl: 'https://stake.thornode.io',
    receiptType: ReceiptType.Original,
    maxStaked: 300, // update with collection size
    imageUrl: 'https://i.ibb.co/fxZqZWR/lossy-compressed-3.gif',
    tokenStandard: TokenStandard.NonFungible,
    hideAllowedTokens: false,
    hidden: false,
    styles: {
      fontFamily: 'anton',
      fontWeight: 500,
    },
    colors: {
      primary: '#0e1b3a',
      secondary: '#b287e1',
      accent: 'rgba(31,207,101,0.11)',
      fontColor: '#e8e8e8',
    },
  },
  {
    name: 'onespace',
    displayName: 'ONESPACE',
    stakePoolAddress: new PublicKey(
      'FBTqpPynmDdVsYP4eep6pJonwMsFoVhaXcCpah3yYLZY'
    ),
    websiteUrl: 'https://1space.me/',
    receiptType: ReceiptType.Original,
    hostname: 'stake.1space.me',
    hideFooter: true,
    imageUrl: 'https://1space.me/images/os-logo-white.jpeg',
    maxStaked: 200,
    links: [
      {
        text: 'ONEHERO NFT',
        value: 'https://nft.1space.me/',
      },
      {
        text: 'MINT',
        value: 'https://nft.1space.me/#mint',
      },
    ],
    styles: {
      fontFamily: 'Industry, sans-serif',
      fontWeight: 400,
    },
    colors: {
      primary: '#121429',
      secondary: '#00b7ff',
      accent: '#2b3645',
      fontColor: '#FFFFFF',
    },
  },
  {
    name: 'trust-in-pat',
    displayName: 'Trust in Pat',
    nameInHeader: true,
    stakePoolAddress: new PublicKey(
      '84zubayRdBg8s47QUDLfmHUZekmmBktKptwfagGNHjjL'
    ),
    websiteUrl: 'https://trustinpat.com/',
    receiptType: ReceiptType.Receipt,
    tokenStandard: TokenStandard.NonFungible,
    imageUrl: '/logos/trust-in-pat.png',
    maxStaked: 4096,
    links: [
      {
        text: 'Twitter',
        value: 'https://twitter.com/TrustInPat',
      },
      {
        text: 'Discord',
        value: 'https://t.co/drNhCgyOwz',
      },
    ],
    colors: {
      primary: '#ffffff',
      secondary: '#BBBBBB',
      accent: '#ffffff',
      fontColor: '#000',
      backgroundSecondary: '#f4f5f7',
    },
  },
  {
    name: 'KingChipsRoyale',
    displayName: 'KingChipsRoyale',
    nameInHeader: true,
    stakePoolAddress: new PublicKey(
      'Du8zgvZ6dNZ2GmDJ18e6kQNxYeqg8oSTFqsekXyNy533'
    ),
    websiteUrl: 'https://www.kingchips.xyz/',
    receiptType: ReceiptType.Original,
    tokenStandard: TokenStandard.NonFungible,
    imageUrl: 'https://i.ibb.co/wzhXTTZ/400x400logo.png',
    maxStaked: 1109,
    links: [
      {
        text: 'Twitter',
        value: 'https://twitter.com/KingChipsRoyale',
      },
      {
        text: 'Discord',
        value: 'discord.gg/2ZZhyuebUg',
      },
    ],
    colors: {
      primary: '#000000',
      secondary: '#4da1de',
      accent: '#1fcfb11c',
      fontColor: '#FFFFFF',
    },
  },
  {
    name: 'cyborgeddon-fueling-station',
    displayName: 'Borg Fueling Station',
    nameInHeader: true,
    stakePoolAddress: new PublicKey(
      '9muf4BWmQntjgsU3wx5cxqiZoXqRaCMxyEH7Gx8J1erG'
    ),
    websiteUrl: 'https://cyborgeddon.com/',
    receiptType: ReceiptType.Original,
    tokenStandard: TokenStandard.NonFungible,
    imageUrl: 'https://media1.giphy.com/media/a81pt8QhDpZbMqX97G/giphy.gif',
    maxStaked: 4096,
    backgroundImage:
      'https://firebasestorage.googleapis.com/v0/b/nft-anybodies.appspot.com/o/images%2F5Cyon.gif-1659579607552?alt=media&token=cd90dcf8-5fe2-4b99-a5d1-9dfb94301fee',
    colors: {
      primary: '#000000',
      secondary: '#37b24a',
      accent: '#37b24a',
      fontColor: '#37b24a',
      fontColorSecondary: '#000000',
      backgroundSecondary: '#000000',
    },
  },
  {
    name: 'koala-koalition',
    displayName: 'Koala Koalition Eucalyptus Tree',
    nameInHeader: true,
    stakePoolAddress: new PublicKey(
      'FB4365jze3wkBGKMQqFyJMDryQBzknpZp61niKsjUNW6'
    ),
    websiteUrl: 'https://www.koalakoalition.com',
    receiptType: ReceiptType.Original,
    tokenStandard: TokenStandard.NonFungible,
    imageUrl:
      'https://www.koalakoalition.com/static/media/talking-head.a114ee10.gif',
    maxStaked: 1111,
    backgroundImage:
      'https://www.koalakoalition.com/static/media/hero-bg.4c9c5032.gif',
    colors: {
      primary: '#000000',
      secondary: '#37b24a',
      accent: '#37b24a',
      fontColor: '#37b24a',
      fontColorSecondary: '#000000',
      backgroundSecondary: '#000000',
    },
  },
  {
    name: 'rebellionbots',
    displayName: 'The Rebellion Bots',
    stakePoolAddress: new PublicKey(
      'AzFdEKtqanvPeQ7chcKNXJHAzcZRLc8GbkSzG8JUrT4W'
    ),
    hostname: 'stake.rebellionbots.io',
    hideFooter: true,
    websiteUrl: 'https://www.rebellionbots.io',
    receiptType: ReceiptType.Original,
    maxStaked: 801, // update with collection size
    imageUrl: '/logos/rebellion-bots.jpeg',
    secondaryImageUrl: '/logos/secondary-rebellion-bots.png',
    tokenStandard: TokenStandard.NonFungible,
    hideAllowedTokens: true,
    styles: {
      fontFamily: 'Industry, sans-serif',
      fontWeight: 500,
    },
    colors: {
      primary: '#0d0d0d',
      secondary: '#fb40b2',
      accent: '#0d0d0d',
      fontColor: '#fb40b2',
      fontColorSecondary: '#161616',
    },
  },
  {
    name: 'sentries',
    displayName: 'Sentries',
    stakePoolAddress: new PublicKey(
      '3WS5GJSUAPXeLBbcPQRocxDYRtWbcX9PXb87J1TzFnmX'
    ),
    websiteUrl: 'https://www.sentries.io/',
    receiptType: ReceiptType.Original,
    maxStaked: 8000, // update with collection size
    imageUrl: '/logos/sentries-logo.svg',
    tokenStandard: TokenStandard.NonFungible,
    colors: {
      primary: '#383838',
      secondary: '#fff',
      accent: '#0d0d0d',
      fontColor: '#fff',
      fontColorSecondary: '#000',
    },
  },
  {
    name: 'Soulless-AI',
    displayName: 'Soulless-AI',
    stakePoolAddress: new PublicKey(
      '4mW9Q1PxiBzs2YqdWBfS51yMcP3A1r2aQsBoSvQUhtjJ'
    ),
    styles: {
      fontFamily: 'Multivac Interference',
    },
    colors: {
      primary: '#000',
      secondary: '#34c674',
      accent: '#34c674',
      fontColor: '#FFF',
      fontColorSecondary: '#FFF',
      backgroundSecondary: '#000',
    },
    websiteUrl: 'https://stake.soulless-ai.io',
    receiptType: ReceiptType.Original,
    hidden: false,
    notFound: true,
    imageUrl:
      'https://uploads-ssl.webflow.com/62e97328e35e46351183d1a9/62fe72a2b0f5f3605fd803f1_Untitled-10.png',
  },
  {
    name: 'slayerz',
    displayName: 'Slayerz',
    stakePoolAddress: new PublicKey(
      '2f3Sdr7hgf3RnJMxKW8oYgmKRRkD8eaVGeDZyprUstM6'
    ),
    websiteUrl: 'https://www.dragonslayerz.io/',
    receiptType: ReceiptType.Original,
    maxStaked: 4332,
    imageUrl: 'https://raw.githubusercontent.com/Don-73/Slyerz/main/logo.png',
    colors: {
      primary: '#212186',
      secondary: '#c33764',
      accent: '#00FFA3',
      fontColor: '#FFFFFF',
    },
  },
  {
    name: 'hoa-referral',
    displayName: 'Parcl HOA Referral Program',
    stakePoolAddress: new PublicKey(
      '3JXoAsm4YZGzC2VGtSBdN8EX36wW8uuoXX9nWFqamUu2'
    ),
    hidden: true,
    websiteUrl: 'https://www.hoa.house/',
    receiptType: ReceiptType.Original,
    tokenStandard: TokenStandard.NonFungible,
    hideAllowedTokens: true,
    nameInHeader: true,
    maxStaked: 7777,
    imageUrl: '/logos/parcl.png',
    backgroundImage: '/logos/parcl-bg.png',
    colors: {
      primary: '#0d1939',
      secondary: '#10abf0',
      backgroundSecondary: '#182443',
    },
  },
  {
    name: 'the-suites',
    displayName: 'The Suites',
    nameInHeader: true,
    stakePoolAddress: new PublicKey(
      '2AbgA81PK3E5k6n7yfhp3k6jUE1tMXdSGWsCT17uGpUc'
    ),
    websiteUrl: 'https://thesuites.app/',
    receiptType: ReceiptType.Original,
    tokenStandard: TokenStandard.NonFungible,
    imageUrl:
      'https://assets.thirdtimegames.com/images/The%20Suites_Primary_White_Gold_Square_1200.png',
    maxStaked: 4932,
    links: [
      {
        text: 'Twitter',
        value: 'https://twitter.com/TheSuitesNFT',
      },
      {
        text: 'Discord',
        value: 'https://discord.gg/zhzYGxtx9D',
      },
    ],
    colors: {
      primary: '#242a36',
      secondary: '#4f2a89',
      accent: '#b69b68',
      fontColor: '#e6e7e8',
    },
  },
  {
    name: 'meta-hunters',
    displayName: 'Meta Hunters',
    nameInHeader: true,
    stakePoolAddress: new PublicKey(
      'AjuWPVKFZBLZSSJS2xso9zBsfKSzXt14ebEMH6DbAAKg'
    ),
    websiteUrl: 'https://www.doubleupnft.com/',
    receiptType: ReceiptType.Original,
    tokenStandard: TokenStandard.NonFungible,
    imageUrl:
      'https://pbs.twimg.com/profile_images/1536554684172734464/T9A_Y2wl_400x400.jpg',
    links: [
      {
        text: 'Twitter',
        value: 'https://twitter.com/metahuntersnft?lang=en',
      },
      {
        text: 'Discord',
        value: 'https://discord.com/invite/Xyzt8qpM',
      },
    ],
    colors: {
      primary: '#020208',
      secondary: '#166ca4',
      fontColor: '#e6e7e8',
    },
  },
  {
    name: 'moonshine-labs',
    displayName: 'Moonshine Labs',
    nameInHeader: true,
    stakePoolAddress: new PublicKey(
      '79ZGVZuP93wChsjiqvpCUZtTq6xYc8Edaid4ng8BHxp1'
    ),
    websiteUrl: 'https://warp.moonshinelabs.io/caps',
    receiptType: ReceiptType.Original,
    tokenStandard: TokenStandard.NonFungible,
    imageUrl:
      'https://www.arweave.net/IoihJxVlVjKp2x46GpnoQNi1pRWNJiLBI4FQiXK0SPA?ext=png',
    maxStaked: 3546,
    backgroundImage:
      'https://shdw-drive.genesysgo.net/5aWZWB6vXbZrf1CNmiM3rAWnzf36Bpuq8rxRYHBzGeGq/msl_caps_card_1.png',
    styles: {
      fontFamily: 'Roboto Serif',
    },
    colors: {
      primary: '#7928CA',
      secondary: '#4a148c',
      accent: '#DE38C8',
      fontColor: '#FFFFFF',
      // fontColorSecondary: '#DE38C8',
      // backgroundSecondary: '#DE38C8',
    },
    analytics: [
      {
        metadata: {
          key: 'Pass Type',
          type: 'staked',
          totals: [
            {
              key: 'Bronze',
              value: 2352,
            },
            {
              key: 'Silver',
              value: 1085,
            },
            {
              key: 'Gold',
              value: 98,
            },
            {
              key: 'Platinum',
              value: 7,
            },
          ],
        },
      },
    ],
    links: [
      {
        text: 'HOME',
        value: 'https://warp.moonshinelabs.io/caps-home',
      },
      {
        text: 'GAME',
        value: 'https://warp.moonshinelabs.io/caps-game',
      },
      {
        text: 'MINT',
        value: 'https://warp.moonshinelabs.io/caps-mint',
      },
      {
        text: 'BUY',
        value: 'https://warp.moonshinelabs.io/caps-buy',
      },
      {
        text: 'TWITTER',
        value: 'https://warp.moonshinelabs.io/caps-twitter',
      },
      {
        text: 'DISCORD',
        value: 'https://warp.moonshinelabs.io/caps-discord',
      },
    ],
  },
  {
    name: 'computation-units',
    displayName: 'Computation Units',
    nameInHeader: true,
    stakePoolAddress: new PublicKey(
      '4Nmq5mM747qbA53Yik6KFw4G4nvoSRPsJqRSSGJUwWVa'
    ),
    websiteUrl: 'https://warp.moonshinelabs.io/cu',
    receiptType: ReceiptType.None,
    tokenStandard: TokenStandard.NonFungible,
    imageUrl:
      'https://www.arweave.net/VYTqLwXIWw4BoI11xJdNfmLv4FcBYaF9nFpQH2ejdek?ext=png',
    maxStaked: 4000,
    backgroundImage:
      'https://shdw-drive.genesysgo.net/5aWZWB6vXbZrf1CNmiM3rAWnzf36Bpuq8rxRYHBzGeGq/swrm_cu_card_1.png',
    colors: {
      primary: '#1EC1E1',
      secondary: '#BBBBBB',
      accent: '#DE38C8',
      fontColor: '#FFFFFF',
    },
    links: [
      {
        text: 'HOME',
        value: 'https://warp.moonshinelabs.io/cu-home',
      },
      {
        text: 'GAME',
        value: 'https://warp.moonshinelabs.io/cu-game',
      },
      {
        text: 'MINT',
        value: 'https://warp.moonshinelabs.io/cu-mint',
      },
      {
        text: 'BUY',
        value: 'https://warp.moonshinelabs.io/cu-buy',
      },
      {
        text: 'TWITTER',
        value: 'https://warp.moonshinelabs.io/cu-twitter',
      },
      {
        text: 'DISCORD',
        value: 'https://warp.moonshinelabs.io/cu-discord',
      },
    ],
  },
  {
    name: '666starmoon',
    displayName: '666starmoon',
    hidden: true,
    stakePoolAddress: new PublicKey(
      'B72Unafq2Y5DqkeN4BGSZ7gyqVTfXjigNrQkgDPxSCjo'
    ),
    websiteUrl: 'https://666starmoon.my.id/',
    receiptType: ReceiptType.Original,
    maxStaked: 666,
    imageUrl:
      'https://blogger.googleusercontent.com/img/a/AVvXsEgpLctWRvkvrx4lNx2grm2vFx746c8MBf2JxRgpAntlNROCcrRHuysa4cpLgUYprHunkUnK-dNFqu9FKZF8oQEHappoLlTkzIfv4nJa1ozJzhR0VLmo8hr6N7qGpSlMuyyigMoZkyWgIgrmzkAMsYWGesXA0zIPdi6pY3Y0uAZpxgkuJOr0Zc-j5g=s150',
    colors: {
      primary: '#698a5e',
      secondary: '#74c48e',
      fontColor: '#f2edd4',
    },
  },
  {
    name: 'Sweet-Apocalypse',
    displayName: 'Sweet Apocalypse',
    nameInHeader: true,
    stakePoolAddress: new PublicKey(
      'GzmFJFc7rZpULuJMhs8XRRxnEFFCJi4U5YFnUPZsuHPN'
    ),
    receiptType: ReceiptType.Original,
    tokenStandard: TokenStandard.NonFungible,
    hideAllowedTokens: true,
    // styles to apply to the whole stake pool
    styles: {
      fontFamily: 'Industry, sans-serif',
      fontWeight: 700,
      fontSize: '22px',
      font: '#000000',
      color: '#000000',
    },
    // Colors object to style the stake page
    colors: {
      primary: 'rgb(120 122 108 / 80%)',
      secondary: '#F9C90C',
      backgroundSecondary: 'rgb(61 169 211 / 65%)',
      fontColor: '#ffff',
      fontColorSecondary: '#000000',
    },
    imageUrl:
      'https://bafkreie5parsjwtmnk7cyixtdoznifdk3hx2kjazzrvecc3mgjrwvr6tfy.ipfs.nftstorage.link/',
    // Background image for poolq
    backgroundImage:
      'https://bafybeifddabmgm3rinrdngbzanttwxp2qfr5ffpu7itgradc4sxplpjvc4.ipfs.nftstorage.link/',

    // Website url if specified will be navigated to when the image in the header is clicked
    websiteUrl: 'https://www.sweetapocalypse.org/',
    maxStaked: 6666,
    links: [
      {
        text: 'Twitter',
        value: 'https://twitter.com/sweetapocaIypse',
      },
      {
        text: 'Discord',
        value: 'https://discord.gg/sweetapocalypse',
      },
      {
        text: 'Sweet Apocalypse',
        value: 'https://www.sweetapocalypse.org/',
      },
      {
        text: 'MINT',
        value: 'https://www.sweetapomint.org/',
      },
    ],
  },
  {
    name: 'annoyed-rex-udder-chaos',
    displayName: 'Annoyed Rex Club x Udder Chaos',
    stakePoolAddress: new PublicKey(
      '9NvrvM3Ji5RbbJtuAqXAzQL6cwHAv7n4KQQoUyUHqgT1'
    ),
    websiteUrl: 'https://udderchaos.io/',
    imageUrl:
      'https://oh66ydzlqmacybmraeswa7nxlpv4fogsvikmihqosj3rel6qixfa.arweave.net/cf3sDyuDACwFkQElYH23W-vCuNKqFMQeDpJ3Ei_QRco',
    maxStaked: 500,
    receiptType: ReceiptType.Original,
    tokenStandard: TokenStandard.NonFungible,
    hideAllowedTokens: true,
    links: [
      {
        text: 'Discord',
        value: 'https://discord.gg/udderchaos',
      },
      {
        text: 'Buy',
        value: 'https://magiceden.io/marketplace/arcxuc',
      },
    ],
    colors: {
      primary: '#000000',
      secondary: '#BD38F3',
      accent: '#8B2AB4',
      fontColor: '#FFFFFF',
    },
  },
  {
    name: 'steamland',
    displayName: 'Harvesting - Steamland',
    stakePoolAddress: new PublicKey(
      '5n9G7o9ZZFmfx4dcbd4HgNYcGWFiQ2wGKaKHYT8bWDf7'
    ),
    maxStaked: 2222,
    receiptType: ReceiptType.Original,
    websiteUrl: 'https://steamland.io',
    hostname: 'harvest.steamland.io',
    imageUrl: 'https://raw.githubusercontent.com/Steamland/images/main/harvest_logo.png' ,
    hidden: true,
    styles: {
     fontFamily: 'Industry, sans-serif',
     fontWeight: 500,
   },
   backgroundImage:
     'https://raw.githubusercontent.com/Steamland/images/main/harvesting_background.png',
     tokenStandard: TokenStandard.NonFungible,
     hideAllowedTokens: true,
     colors: {
     primary: '#1A1A1D',
     secondary: '#9e333f',
     accent: '#313063',
     fontColor: '#FFFFFF',
     fontColorSecondary: '#FFFFFF',
     backgroundSecondary: '#4E4E50',
   },
  },
>>>>>>> ea3eacccee43ae16c2f7e82c5d37604a0fa38bad
]
