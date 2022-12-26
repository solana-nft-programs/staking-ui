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
    fontColorTertiary?: string
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
    name: 'bearmarketbeavers',
    displayName: 'Bear Market Beavers',
    stakePoolAddress: new PublicKey(
      'GevXdzt3GXEZHG8TMyPyAF9KGT2zsksCfgHM2Vwpn5ks'
    ),
    websiteUrl: 'https://bearmarketbeaver.com/',
    imageUrl:
      'https://gateway.pinata.cloud/ipfs/QmW5BaXo2FDyBogVUP4WMuFFMtQ8MpQC5wUWTyPjLSinfD',
    maxStaked: 6969,
    nameInHeader: true,
    description: 'Stake your Handsome Beavers at the Dam to earn $BBALLS',
    receiptType: ReceiptType.Original,
    tokenStandard: TokenStandard.NonFungible,
    hideAllowedTokens: true,
    hideFooter: true,
    styles: {
      fontFamily: 'Paralucent',
      fontWeight: 500,
      backgroundSize: '100% auto',
    },
    links: [
      {
        text: 'Buy Now',
        value: 'https://hyperspace.xyz/collection/bear_market_beavers',
      },
    ],
    colors: {
      primary: '#000000',
      secondary: '#000000',
      accent: '#000000',
      fontColor: '#FFFFFF',
      fontColorSecondary: '#FFFFFF',
    },
    backgroundImage:
      'https://gateway.pinata.cloud/ipfs/QmYiRZFYsm3xKw6pD82LChvKZaEH2pdWqzvKzsotDjuRGj',
  },
  {
    name: 'metatattooclub',
    displayName: 'Meta Tattoo Club',
    stakePoolAddress: new PublicKey(
      '4CnsdUSFCFKa9zBupuxFesZZJm64Eq3WgrAePF2KCuXv'
    ),
    websiteUrl: 'https://metatattooclub.io/',
    imageUrl:
      'https://gateway.pinata.cloud/ipfs/QmQniSw9U7jKXk7fVJcvdkhVfqsLTyNHnukWwm7kfLEmuN',
    maxStaked: 8888,
    nameInHeader: true,
    receiptType: ReceiptType.Original,
    tokenStandard: TokenStandard.NonFungible,
    hideAllowedTokens: true,
    hideFooter: true,
    styles: {
      fontFamily: 'Industry, sans-serif',
      fontWeight: 500,
      backgroundSize: '100% auto',
    },
    links: [
      {
        text: 'Buy Now',
        value: 'https://magiceden.io/marketplace/metatattooclub',
      },
    ],
    colors: {
      primary: '#000000',
      secondary: '#d4a137E6',
      accent: '#d4a137B3',
      fontColor: '#FFFFFF',
    },
    backgroundImage:
      'https://gateway.pinata.cloud/ipfs/QmdZ6eTjxUzCzguqdNBkYP5uMeHjjpkSgQg8512ozSUvff',
  },
  {
    hidden: true,
    name: 'lotus',
    displayName: 'The Lotus',
    hostname: 'legendary.thelotus.io',
    websiteUrl: 'https://www.thelotus.io',
    stakePoolAddress: new PublicKey(
      'BeT8h9E5BcgcMBxF7Si5GSRuB6zHcSpFuMpp6uTcVRFN'
    ),
    receiptType: ReceiptType.Receipt,
  },
  {
    name: 'portals',
    displayName: 'Portals',
    stakePoolAddress: new PublicKey(
      '8Da8qPqSwc2DNenp5wwK7HWxpSrvxw8LUNoBZ2gAYjaz'
    ),
    description: 'Portals staking pool provided by The BuildersDAO.',
    imageUrl: '/logos/portals-nft.jpg',
    colors: {
      primary: '#0d1718',
      secondary: '#416460',
      accent: '#0089C1',
      fontColor: '#FFFFFF',
    },
  },
  {
    name: 'thenewexplorersclub',
    displayName: 'The New Explorers Club',
    stakePoolAddress: new PublicKey(
      '49GnPoU2eexWaSo1n7wDFJov7WLiQ71fvpLj1ZoMxTVL'
    ),
    description:
      'The New Explorers Club staking pool provided by The BuildersDAO.',
    imageUrl: '/logos/tnec-nft.jpg',
    colors: {
      primary: '#000000',
      secondary: '#6c9180',
      accent: '#BCFFE0',
      fontColor: '#FFFFFF',
    },
  },
  {
    name: 'thebuildersdao',
    displayName: 'The BuildersDAO',
    stakePoolAddress: new PublicKey(
      'FLJa7J28f2LBFJYqQLhhjaXR4WnfU2RHpSrr32p8bnSz'
    ),
    description: 'The BuildersDAO is a community of metaverse builders.',
    imageUrl: '/logos/buildersdao-nft.png',
    colors: {
      primary: '#000000',
      secondary: '#4da1de',
      accent: '#0089C1',
      fontColor: '#FFFFFF',
    },
  },
  {
    name: 'shadiesboosted',
    displayName: 'SHADIES BOOSTED 2X STAKING',
    stakePoolAddress: new PublicKey(
      '29MgtLuX8ByGMZoreUoY7hsP2YY935gJ3wRB1fhiSF8o'
    ),
    hostname: 'https://staking2x.theshadyclass.xyz',
    hidden: false,
    notFound: false,
    imageUrl:
      'https://raw.githubusercontent.com/flipthetip/test-tsc/main/newth.png',
    // secondaryImageUrl: 'https://raw.githubusercontent.com/flipthetip/test-tsc/main/arx.png',
    backgroundImage:
      'https://raw.githubusercontent.com/flipthetip/test-tsc/main/newbg.png',
    styles: {
      fontFamily: 'Franklin Gothic Medium',
      // fontWeight: 500,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    colors: {
      primary: '#000000',
      secondary: '#f34d00',
      accent: '#413F42',
      fontColor: '#FFFFFF',
      fontColorSecondary: '#FFFFFF',
    },
    // maxStaked: ,
    receiptType: ReceiptType.Original,
  },
  {
    name: 'shadiesstandard',
    displayName: 'SHADIES STANDARD STAKING',
    stakePoolAddress: new PublicKey(
      'zNt5nnEaL87rG9DT2cxvdVMf8sLBe6qEuZK8D5K4r9M'
    ),
    hostname: 'https://staking1x.theshadyclass.xyz',
    hidden: false,
    notFound: false,
    imageUrl:
      'https://raw.githubusercontent.com/flipthetip/test-tsc/main/newth.png',
    // secondaryImageUrl: 'https://raw.githubusercontent.com/flipthetip/test-tsc/main/arx.png',
    backgroundImage:
      'https://raw.githubusercontent.com/flipthetip/test-tsc/main/newbg.png',
    styles: {
      fontFamily: 'Franklin Gothic Medium',
      // fontWeight: 500,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    colors: {
      primary: '#000000',
      secondary: '#f34d00',
      accent: '#413F42',
      fontColor: '#FFFFFF',
      fontColorSecondary: '#FFFFFF',
    },
    // maxStaked: ,
    receiptType: ReceiptType.Original,
  },
  {
    name: 'Learn2Earn',
    displayName: 'Learn 2 Earn DOTS',
    stakePoolAddress: new PublicKey(
      'DgrtWV95DP3ix4GFMKDLwqMNZ213KJk9NgM6vmdPtyk1'
    ),
    contrastHomepageBkg: true,
    maxStaked: 5000,
    receiptType: ReceiptType.Original,
    websiteUrl: 'https://www.bithq.co/',
    hostname: 'Learn2Earn.io',
    imageUrl:
      'https://cdn.discordapp.com/attachments/989483399477604404/1023947734828449802/DOTS_NFT1.5.png',
    styles: {
      fontFamily: 'serif',
      fontWeight: 500,
    },
    backgroundImage:
      'https://cdn.discordapp.com/attachments/989483399477604404/1024694267282726942/ReliefBlackBackground.jpg',
    tokenStandard: TokenStandard.NonFungible,
    hideAllowedTokens: true,
    colors: {
      primary: '#000000',
      secondary: '#FFFFFF',
      accent: '#000000',
      fontColor: '#FFFFFF',
      fontColorSecondary: '#000000',
      backgroundSecondary: '#000000',
    },
  },
  {
    name: 'AOM',
    displayName: 'AOM',
    stakePoolAddress: new PublicKey(
      'Hj1xfWP4qYq7N6eJxFRFGqNDiwMFRMo361ay5rFUThbk'
    ),
    redirect: 'https://frame.artofmob.io',
    hidden: false,
    notFound: true,
    imageUrl:
      'https://pvajcmufckbozjicyp4aaltlbozv7emcj3sy6srskjm4ilq.arweave.net/fUCRM-oUSguylAsP4AC5r_C7NfkYJ_O5Y_9KMlJZxC4?ext=png',
  },
  {
    name: 'blockasset',
    displayName: 'Blockasset',
    stakePoolAddress: new PublicKey(
      '3BZCupFU6X3wYJwgTsKS2vTs4VeMrhSZgx4P2TfzExtP'
    ),
    logoPadding: true,
    description:
      'Blockasset is creating a revolutionary way for fans and athletes to interact and connect with each other by way of multiple touchpoints that provide benefits for both the fan and the athlete.',
    websiteUrl: 'https://hub.blockasset.co/nft-staking-v2',
    imageUrl: '/logos/blockasset.png',
    maxStaked: 11791,
    links: [
      {
        text: 'NFT Staking',
        value: 'https://hub.blockasset.co/nft-staking-v2',
      },
      {
        text: 'Smesh Bros',
        value: 'https://hub.blockasset.co/smesh-staking',
      },
      {
        text: 'Block Token',
        value: 'https://hub.blockasset.co/token-staking-v2',
      },
    ],
    colors: {
      primary: '#000000',
      secondary: '#4da1de',
      accent: '#2a393a',
      fontColor: '#FFFFFF',
    },
  },
  {
    name: 'blockasset-smesh-bros',
    displayName: 'Blockasset Smesh Bros',
    stakePoolAddress: new PublicKey(
      'Bce4Aq4YheBo5hENeoMhjywdvMhEMc8sUh21S87Qv4q6'
    ),
    websiteUrl: 'https://hub.blockasset.co/smesh-staking',
    receiptType: ReceiptType.Original,
    imageUrl: '/logos/blockasset.png',
    maxStaked: 4000,
    links: [
      {
        text: 'NFT Staking',
        value: 'https://hub.blockasset.co/nft-staking-v2',
      },
      {
        text: 'Smesh Bros',
        value: 'https://hub.blockasset.co/smesh-staking',
      },
      {
        text: 'Block Token',
        value: 'https://hub.blockasset.co/token-staking-v2',
      },
    ],
    colors: {
      primary: '#000000',
      secondary: '#4da1de',
      accent: '#30c2b9',
      fontColor: '#FFFFFF',
    },
    airdrops: [
      {
        name: 'Blockasset Legends',
        symbol: 'LEGENDS',
        uri: 'https://arweave.net/Q5y8_OehSOYCkGiX-hV1H6qiczoDaVdk4Eyi4lhhdQE',
      },
    ],
  },
  {
    name: 'block-token',
    displayName: 'Blockasset Token',
    stakePoolAddress: new PublicKey(
      'jhksrHQqRKBEFuker9buKw4zDDrmENGTTKnUn2QzsUD'
    ),
    websiteUrl: 'https://hub.blockasset.co/token-staking-v2',
    imageUrl: '/logos/blockasset.png',
    links: [
      {
        text: 'NFT Staking',
        value: 'https://hub.blockasset.co/nft-staking-v2',
      },
      {
        text: 'Smesh Bros',
        value: 'https://hub.blockasset.co/smesh-staking',
      },
      {
        text: 'Block Token',
        value: 'https://hub.blockasset.co/token-staking-v2',
      },
    ],
    colors: {
      primary: '#000000',
      secondary: '#4da1de',
      accent: '#2a393a',
      fontColor: '#FFFFFF',
    },
    airdrops: [],
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
    links: [
      {
        text: "Founder's Passes",
        value: '/meta-ops-founders-vault',
      },
    ],
    colors: {
      primary: '#000000',
      secondary: '#4da1de',
      accent: '#2a393a',
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
    links: [
      {
        text: 'PFP Vault',
        value: '/meta-ops',
      },
    ],
    colors: {
      primary: '#000000',
      secondary: '#4da1de',
      accent: '#2a393a',
      fontColor: '#FFFFFF',
    },
  },
  {
    name: 'META',
    displayName: 'META collections',
    stakePoolAddress: new PublicKey(
      'BCtcLrKhiZbFTRMB2W8iQWttYF82cLJzo7ZnnnkqXnnC'
    ),
    hostname: 'stake.metaladsai.com',
    websiteUrl: 'https://metaladsai.com',
    imageUrl:
      'https://raw.githubusercontent.com/poisonlab/photo/main/WhatsApp%20Image%202022-10-05%20at%2017.53.36.jpeg',
    styles: {
      fontFamily: 'serif',
      fontWeight: 500,
    },
    colors: {
      primary: '#27033d',
      secondary: '#27033d',
      accent: '#a3219f',
      fontColor: '#FFFFFF',
      fontColorSecondary: '#000000',
      backgroundSecondary: '#000000',
    },
  },
  {
    name: 'METALADS',
    displayName: 'META LADS',
    stakePoolAddress: new PublicKey(
      'CQK61z8JRqoaowTLXhM61vY2bwLct2L2fiHdTNcZZx4v'
    ),
    hostname: 'stake-lads.metaladsai.com',
    websiteUrl: 'https://metaladsai.com',
    imageUrl:
      'https://raw.githubusercontent.com/poisonlab/photo/main/WhatsApp%20Image%202022-10-06%20at%2019.58.33.jpeg',
    styles: {
      fontFamily: 'serif',
      fontWeight: 500,
    },
    colors: {
      primary: '#27033d',
      secondary: '#27033d',
      accent: '#a3219f',
      fontColor: '#FFFFFF',
      fontColorSecondary: '#000000',
      backgroundSecondary: '#000000',
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
      'https://rawcdn.githack.com/okaybulls/token/a3dc077179ac9e3f0aa1a784ef839af0f35e3f2e/bull.png',
    maxStaked: 10000,
    colors: {
      primary: '#1C1C1C',
      secondary: '#F4431C',
      accent: '#434343',
      fontColor: '#FFFFFF',
    },
  },
  {
    name: 'friendly-frogs',
    displayName: 'Friendly Frogs',
    stakePoolAddress: new PublicKey(
      'AHighyKxRsD6oo6SebbW6nQfuJ1GQBSmU2BnVFbtcFmz'
    ),
    websiteUrl: 'https://ffsc.io/',
    receiptType: ReceiptType.Original,
    maxStaked: 2121,
    imageUrl: 'https://arweave.net/MYKL6LSm8JFdqqfARCDqpmFBUlfkRplneVgIkBqyZE4',
    colors: {
      primary: '#698a5e',
      secondary: '#74c48e',
      fontColor: '#f2edd4',
    },
  },
  {
    name: 'monsta-scientist',
    displayName: 'Monsta Scientist',
    stakePoolAddress: new PublicKey(
      '4hYMymEkyvBvY5ipLjiedvZu7Dp7oTshAsXcFVJZ9Bhv'
    ),
    websiteUrl: 'https://www.monstascientist.io/',
    receiptType: ReceiptType.Original,
    maxStaked: 4444,
    imageUrl:
      'https://raw.githubusercontent.com/monstadao/logo/main/monsta-scientist.jpg',
    colors: {
      primary: '#211F20',
      secondary: '#211F20',
      accent: '#000',
    },
  },
  {
    name: 'monsta-potion',
    displayName: 'Monsta Potion',
    stakePoolAddress: new PublicKey(
      'FXuwtxvrL8BsTmW9ZBpYHyntKYciBRz9KX9z19iQjn8h'
    ),
    websiteUrl: 'https://www.monstascientist.io/',
    receiptType: ReceiptType.Original,
    maxStaked: 150,
    imageUrl:
      'https://c4cbdhxzucki34e4lofteofqngjip3dznomj22ui4en5kukyhi.arweave.net/FwQRnvmglI3wnFuLMjiwaZK_H7HlrmJ1qiOEb1VFYOs?ext=png',
    colors: {
      primary: '#211F20',
      secondary: '#211F20',
      accent: '#000',
    },
  },
  {
    name: 'gemmy',
    displayName: 'Gemmy',
    stakePoolAddress: new PublicKey(
      'GFT4PQfgB1ySCr826GhdstzTMndwvoqkBJuZsG7Uxrw1'
    ),
    websiteUrl: 'https://gemmy.club/',
    receiptType: ReceiptType.Original,
    maxStaked: 5000,
    imageUrl: 'https://arweave.net/sjCF_O89hlwQkMts0XHxoLSXGqVdZfy7PlymRvh_FgY',
    colors: {
      primary: '#7D89D8',
      secondary: '##131418',
      accent: '#2a393a',
      fontColor: '#FFFFFF',
    },
  },
  {
    name: 'seanies',
    displayName: 'Seanies',
    stakePoolAddress: new PublicKey(
      'EWfauqUC6PQTzXGR4h4LT1KMqd28W8Vjk5XLPfkLFeSA'
    ),
    websiteUrl: 'https://seanies.art/',
    receiptType: ReceiptType.Original,
    imageUrl:
      'https://raw.githubusercontent.com/dickmasterson/seanies/master/sean-logo.png',
  },
  {
    name: 'whales',
    displayName: 'Catalina Whales',
    redirect: 'https://floating.catalinawhalemixer.com/',
    stakePoolAddress: new PublicKey(
      'BrR1W8bNBfJZGqzsSvMQ8tUJL9tm963E6qR7R99YReiD'
    ),
    receiptType: ReceiptType.Original,
    imageUrl: '/logos/whales.jpg',
    colors: {
      primary: '#2472d1',
      secondary: '#eee',
      accent: '#999',
      fontColor: '#000',
    },
  },
  {
    name: 'stoned-farms',
    displayName: 'Stoned Farms',
    stakePoolAddress: new PublicKey(
      'BdqcbcwaX5YpQPDLh9m9u89QH46WXcnQB5r7vK3h54U4'
    ),
    websiteUrl: 'https://stonedfarms.io/',
    receiptType: ReceiptType.Original,
    maxStaked: 2500,
    imageUrl:
      'https://smvkptoniao6opm5dr3gwgm45tyk3hk5dhz4vrsjqyviqqlkwu.arweave.net/k_yqnzc1AHec9nRx2axmc7PCtnV0Z88rGSYYqiEFqtU',
    styles: {
      fontFamily: 'fot-udmincho-pr6n, serif',
      fontWeight: 500,
    },
    colors: {
      primary: '#1a2721',
      secondary: '#48524d',
      accent: '#FFFFFF',
      fontColor: '#FFFFFF',
    },
  },
  {
    name: 'honeyland',
    displayName: 'Honeyland',
    stakePoolAddress: new PublicKey(
      '8YMcgMZFCFNmGzBNh2458T5CX5Q4SJX3H9zojJQT8G6N'
    ),
    websiteUrl: 'https://honey.land/',
    receiptType: ReceiptType.Receipt,
    maxStaked: 5525,
    imageUrl: 'https://honey.land/images/logo.png',
    colors: {
      primary: '#4c0f00',
      secondary: '#aa6f03',
      accent: '#aa6f03',
      fontColor: '#FFFFFF',
    },
    links: [
      {
        text: 'View',
        value: 'https://incubate.honey.land/',
      },
    ],
  },
  {
    name: 'presidential-peanuts',
    displayName: 'Presidential Peanuts',
    stakePoolAddress: new PublicKey(
      '4B3sqjzhE8ceUaVgyKmMKaHcXojAVM43wfnfNzKmqoPd'
    ),
    websiteUrl: 'https://stake.presidentialpeanuts.com/',
    receiptType: ReceiptType.Original,
    imageUrl: 'https://i.ibb.co/mtbNN9x/Iype-WV3-H-400x400.jpg',
    maxStaked: 999,
    redirect: 'https://stake.presidentialpeanuts.com/',
    colors: {
      primary: 'rgb(54,21,38,0.9)',
      secondary: 'rgb(157,120,138, 0.6)',
    },
    notFound: true,
  },
  {
    name: 'plane-x',
    displayName: 'PLANE-X',
    stakePoolAddress: new PublicKey(
      '5oaTiYTSuz5HwcFSFyZ3FXGMaAtV8UgKvAUFTdi8gS7y'
    ),
    websiteUrl: 'https://plane-x.io/',
    receiptType: ReceiptType.Original,
    maxStaked: 3910,
    imageUrl: 'https://arweave.net/HpdUi39S2ixPus6cU74LeoXaKwWcxezIUTQkvVV9XKs',
    tokenStandard: TokenStandard.NonFungible,
    hideAllowedTokens: true,
    colors: {
      primary: '#000000',
      secondary: '#803499',
      accent: '#803499',
      fontColor: '#FFFFFF',
    },
  },
  {
    name: 'rogue-sharks',
    displayName: 'Rogue Sharks',
    stakePoolAddress: new PublicKey(
      '8eqFBjdYYN4f2ibFQ1SADBbGrQKPcfDuYQn32t3NuEoW'
    ),
    websiteUrl: 'https://www.roguesharks.org/',
    receiptType: ReceiptType.Original,
    hostname: 'stake.roguesharks',
    contrastHomepageBkg: true,
    hideFooter: true,
    maxStaked: 4991, // update with collection size
    imageUrl: '/logos/rogue-sharks.svg',
    tokenStandard: TokenStandard.NonFungible,
    hideAllowedTokens: true,
    styles: {
      fontFamily: 'Industry, sans-serif',
      fontWeight: 500,
    },
    colors: {
      primary: '#ffffff',
      secondary: '#cff3f9',
      accent: '#ffffff',
      fontColor: '#000',
      backgroundSecondary: '#f4f5f7',
    },
  },
  {
    name: 'cannaverse',
    displayName: 'Cannaverse',
    stakePoolAddress: new PublicKey(
      '5DoGTq3ciQ1aDFUuTFLhFLdiXuPjnWmjhTSWdzLpZkgY'
    ),
    websiteUrl: 'https://cannaverse.gg/',
    receiptType: ReceiptType.Original,
    maxStaked: 1700,
    imageUrl: './logos/cannaverse.png',
    colors: {
      primary: '#211F20',
      secondary: '#211F20',
      accent: '#000',
    },
  },
  {
    name: 'glc',
    displayName: 'Ghostlife Club',
    stakePoolAddress: new PublicKey(
      'G5YtkSQPsQKnTASbHF5XSfAsFqhTYH8Ajo4yFfCuPpLM'
    ),
    websiteUrl: 'https://ghostlifeclub.com',
    receiptType: ReceiptType.Receipt,
    maxStaked: 4444,
    imageUrl:
      'https://ghostlifeclub.mypinata.cloud/ipfs/QmV3XFK6SYvxdKD6YGHFq1ZtLYc3Gtw2X9mhSk8yXcZokT',
    colors: {
      primary: '#3A3B3C',
      secondary: '#810541',
      accent: '##00FFFF',
      fontColor: '#FFFFFF',
    },
  },
  {
    name: 'degengod',
    displayName: 'Degen God',
    stakePoolAddress: new PublicKey(
      'DU293HnmfVLw793DEB4iajgYZS4KnvuvEjbZRpKJtXXm'
    ),
    websiteUrl: 'http://www.degengod.xyz/',
    receiptType: ReceiptType.Original,
    maxStaked: 1112,
    imageUrl:
      'https://raw.githubusercontent.com/DegenGodnft/degen/main/Logo2.png',
    colors: {
      primary: '#2d0c65',
      secondary: '#ed69fa',
      accent: '#f7f6fe',
      fontColor: '#FFFFFF',
    },
  },
  {
    name: '00RR0R',
    displayName: '00RR0R C01NS',
    stakePoolAddress: new PublicKey(
      '4RMzeQMV8Dnbb3p3EH8UoF6GaK1PSU3FbJUQi1zbiSR3'
    ),
    websiteUrl: 'https://00RR0R.com/',
    receiptType: ReceiptType.Original,
    imageUrl: 'https://www.00rr0r.com/logo-stake.png',
    maxStaked: 4999,
    colors: {
      primary: '#000000',
      secondary: '#4da1de',
      accent: '#2a393a',
      fontColor: '#FFFFFF',
    },
  },
  {
    name: 'Sussy Sol Cats',
    displayName: 'Sussy Sol Cats',
    stakePoolAddress: new PublicKey(
      'EJCu7UwEsnRTTuz2qjsSksxwCZmk66aRXLGgeq7hvQUt'
    ),
    websiteUrl: 'https://thesussycats.netlify.app/',
    receiptType: ReceiptType.Original,
    imageUrl:
      'https://github.com/Zcrayzzen/asset/blob/main/New_Project_22.png?raw=true',
    maxStaked: 1111,
  },
  {
    name: 'Orbit',
    displayName: 'Orbit',
    hostname: 'stake.unfrgtn.space',
    hideFooter: true,
    stakePoolAddress: new PublicKey(
      '4TMt9ehagkdFgZJBnyBRBTNfXUD8xLX18JyPVeGDpaKb'
    ),
    websiteUrl: 'https://unfrgtn.space/',
    receiptType: ReceiptType.Original,
    imageUrl:
      'https://cdn.discordapp.com/attachments/988356861491302440/1029422494131695737/New_Project.png',
    maxStaked: 1921,
    colors: {
      primary: '#2d0c65',
      secondary: '#ed69fa',
      accent: '#f7f6fe',
      fontColor: '#FFFFFF',
    },
    links: [
      { text: 'Twitter', value: 'https://twitter.com/UnfrgtnOrbit' },
      { text: 'Discord', value: 'https://discord.gg/U2RQ8tZvV9' },
    ],
  },
  {
    name: 'The Frontier',
    displayName: 'The Frontier',
    stakePoolAddress: new PublicKey(
      'DQkaEQUH2Qwr3BfUZnCarnWoTM4mBrhDqxGNL2M5yJ2F'
    ),
    receiptType: ReceiptType.Original,
    imageUrl:
      'https://raw.githack.com/solanafrontier/logos/main/TheFrontier_logo.png',
    maxStaked: 5000,
    colors: {
      primary: '#000000',
      secondary: '#1D6152',
      accent: '#FFF6D3',
      fontColor: '#FFFFFF',
    },
  },
  {
    name: 'skatex-founders',
    displayName: 'SkateX Founders',
    stakePoolAddress: new PublicKey(
      '5cYt8tVpVc1ECPohiUhKgBVUnRAHv9mEpE3WJzSpRaSh'
    ),
    websiteUrl: 'https://www.skatex.io/',
    receiptType: ReceiptType.Original,
    imageUrl: '/logos/skatex-logo.png',
    maxStaked: 1080,
    styles: {
      fontFamily: 'Industry, sans-serif',
      fontWeight: 500,
    },
    colors: {
      primary: '#211227',
      secondary: '#c7bdcb',
      fontColor: '#ffffff',
      fontColorSecondary: '#000000',
    },
  },
  {
    name: 'skatex-c2c',
    displayName: 'SkateX Coast2Coast',
    stakePoolAddress: new PublicKey(
      'FcVePnNEFFt1SdbTT1dHWWsRft8DAeCF3TRPBZFyLGpZ'
    ),
    websiteUrl: 'https://www.skatex.io/',
    receiptType: ReceiptType.Original,
    imageUrl: '/logos/skatex-logo.png',
    maxStaked: 2222,
    styles: {
      fontFamily: 'Industry, sans-serif',
      fontWeight: 500,
    },
    colors: {
      primary: '#211227',
      secondary: '#c7bdcb',
      fontColor: '#ffffff',
      fontColorSecondary: '#000000',
    },
  },
  {
    name: 'skatex-combo',
    displayName: 'SkateX Collection Combo',
    stakePoolAddress: new PublicKey(
      'CUwNn2VrgQ3R7znBXoTzUyYR1WoSAMHXw38GZNKmY4u3'
    ),
    websiteUrl: 'https://www.skatex.io/',
    receiptType: ReceiptType.Original,
    imageUrl: '/logos/skatex-logo.png',
    styles: {
      fontFamily: 'Industry, sans-serif',
      fontWeight: 500,
    },
    colors: {
      primary: '#211227',
      secondary: '#c7bdcb',
      fontColor: '#ffffff',
      fontColorSecondary: '#000000',
    },
  },
  {
    name: 'sla',
    displayName: 'Secret Llama Agency',
    stakePoolAddress: new PublicKey(
      'DFXwKJK2UCEVhujYPDmLmPUBKgEK58cKaUJzC3UGhysf'
    ),
    websiteUrl: 'https://www.secretllamaagency.com/',
    receiptType: ReceiptType.Original,
    imageUrl: 'https://www.secretllamaagency.com/images/Logo-7-p-500.png',
  },
  {
    name: 'reverb',
    displayName: 'Reverb',
    stakePoolAddress: new PublicKey(
      'J2kvKqkTMbXdbWS3eGmJFv35tKTrzy7wxkJmCzEJ7KAG'
    ),
    maxStaked: 1100,
    websiteUrl: 'https://pinclub.io/',
    receiptType: ReceiptType.Original,
    imageUrl: '/logos/reverb.png',
    colors: {
      primary: '#394b5a',
      secondary: '#6e989d',
      fontColor: '#ffffff',
    },
  },
  {
    name: 'faceless-souls',
    displayName: 'Faceless Souls',
    stakePoolAddress: new PublicKey(
      'H3GrgtE1HhSgpjm9XQNegHQeXdnhC2iLuaNuMy9bmcja'
    ),
    websiteUrl: 'https://stake.cardinal.so/faceless-souls',
    receiptType: ReceiptType.Receipt,
    imageUrl:
      'https://p4e5f2irximos56xgqy7o57rowpbovspcht4ao6o5vxoevg4geoq.arweave.net/fwnS6RG6GOl31zQx93fxdZ4XVk8R58A7zu1u4lTcMR0',
    maxStaked: 4444,
    tokenStandard: TokenStandard.NonFungible,
    hideAllowedTokens: true,
    colors: {
      primary: '#2d0c65',
      secondary: '#ed69fa',
      accent: '#f7f6fe',
      fontColor: '#FFFFFF',
    },
  },
  {
    name: 'the-pilgrims',
    displayName: 'The Pilgrims',
    stakePoolAddress: new PublicKey(
      'FmFr9KurNcUpwHiKgbwVf9Q8Dvy7e6k5XHNdtHrvoaBJ'
    ),
    websiteUrl: 'https://thepilgrims.xyz',
    receiptType: ReceiptType.Original,
    imageUrl:
      'https://pq3boxq5w7tjxfmtl2hra72jkpmbswwmi66d3dz464isnsoqoq.arweave.net/fDYXXh235puVk16PEH9JU9gZWsxHvD2PP-PcRJsnQdA',
    maxStaked: 2000,
    tokenStandard: TokenStandard.NonFungible,
    hideAllowedTokens: true,
    styles: {
      fontFamily: 'Paralucent',
    },
    colors: {
      primary: '#282828',
      secondary: '#A57F3D',
      accent: '#f7f6fe',
      fontColor: '#FFFFFF',
    },
  },
  {
    name: 'lil-weenees',
    displayName: 'lil weenees',
    stakePoolAddress: new PublicKey(
      'E7nfWVcpiFHXtpWg35ePPPnRtmL5k9s2QamzwBhy8pUd'
    ),
    receiptType: ReceiptType.Original,
    imageUrl:
      'https://zm3lmtsddpfcnybf2dohyvv3zecbol5voddwqba7ocx66zjdaq3q.arweave.net/yza2TkMbyibgJdDcfFa7yQQXL7Vwx2gEH3Cv72UjBDc',
    maxStaked: 10,
    tokenStandard: TokenStandard.NonFungible,
    hideAllowedTokens: true,
    styles: {
      fontFamily: 'Paralucent',
    },
    colors: {
      primary: '#282828',
      secondary: '#A57F3D',
      accent: '#f7f6fe',
      fontColor: '#FFFFFF',
    },
  },
  {
    name: 'yoyoyetis',
    displayName: 'Yo Yo Yetis',
    stakePoolAddress: new PublicKey(
      'ConmspDbxLQsm9rs612vPT2UiTvaKoQrJjGBTx6A3AzK'
    ),
    websiteUrl: 'https://www.yoyoyetis.com/',
    receiptType: ReceiptType.Receipt,
    imageUrl:
      'https://media.discordapp.net/attachments/911802368251809883/996651684048687165/skull.png?width=1100&height=1100',
    maxStaked: 3333,
    colors: {
      primary: '#78bbe2',
      secondary: '#25ade9',
      accent: '#25ade9',
      fontColor: '#FFFFFF',
    },
  },
  {
    name: 'dictators',
    displayName: 'Dictators',
    stakePoolAddress: new PublicKey(
      'FGwmVFD2b8UcdwUzwcaPzTSd8UCiyp5EoeNjoaqwnAy6'
    ),
    websiteUrl: 'https://citadel.thedictator.xyz',
    receiptType: ReceiptType.Original,
    maxStaked: 5000, // update with collection size
    imageUrl:
      'https://shdw-drive.genesysgo.net/4B5uhQo61B8JrutW1EXYhedw8uycMWE8JVmw1onbLjTh/Dlogo.svg',
    tokenStandard: TokenStandard.NonFungible,
    hideAllowedTokens: false,
    hidden: false,
    styles: {
      fontFamily: 'Industry, sans-serif',
      fontWeight: 500,
    },
    colors: {
      primary: '#1A1A1D',
      secondary: '#C3073F',
      accent: '#6F2232',
      fontColor: '#FFFFFF',
      fontColorSecondary: '#FFFFFF',
      backgroundSecondary: '#4E4E50',
    },
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
    displayName: 'ONESPACE NFT STAKING',
    stakePoolAddress: new PublicKey(
      'FBTqpPynmDdVsYP4eep6pJonwMsFoVhaXcCpah3yYLZY'
    ),
    websiteUrl: 'https://1space.me/',
    receiptType: ReceiptType.Original,
    tokenStandard: TokenStandard.NonFungible,
    hostname: 'stake.1space.me',
    hideFooter: true,
    imageUrl: 'https://1space.me/images/logo-new-main-heroes_02.png',
    maxStaked: 700,
    links: [
      {
        text: 'HOME',
        value: 'https://1space.me/',
      },
      {
        text: 'BUY / SELL',
        value: 'https://1space.me/#token',
      },
      {
        text: 'FARMS',
        value: 'https://raydium.io/farms/?tab=Ecosystem&farmid=C7KtyxWPukyvkxWFybuDDd92ofG2jZa9vFjAfhY7ymQt',
      },
      {
        text: 'SWAP',
        value: 'https://app.1space.me/',
      },
      {
        text: 'TRADING',
        value: 'https://dex.1space.me/',
      },
      {
        text: 'TOKEN STAKING',
        value: 'https://coinstake.1space.me/',
      },
      {
        text: 'NFT COLLECTION',
        value: 'https://nft.1space.me/',
      },
      {
        text: 'DOCS',
        value: 'https://docs.1space.me/',
      },
    ],
    styles: {
      fontFamily: 'Industry, sans-serif',
      fontWeight: 400,
    },
    colors: {
      primary: '#121429',
      secondary: '#519ef7',
      accent: '#2b3645',
      fontColor: '#FFFFFF',
    },
    backgroundImage:
    'https://i.ibb.co/KzLDpfX/Home-background.png',
  },
  {
    name: 'onespace-1sp',
    displayName: 'ONESPACE 1SP STAKING',
    stakePoolAddress: new PublicKey(
      '33cp8KDrzJpJDDRTSyTght2FuXCbUDmAiecFRw8qgem4'
    ),
    websiteUrl: 'https://1space.me/',
    receiptType: ReceiptType.Original,
    tokenStandard: TokenStandard.Fungible,
    hostname: 'coinstake.1space.me',
    hideFooter: true,
    imageUrl: 'https://1space.me/images/stake-spaceman1.png',
    
    links: [
      {
        text: 'HOME',
        value: 'https://1space.me/',
      },
      {
        text: 'BUY / SELL',
        value: 'https://1space.me/#token',
      },
      {
        text: 'FARMS',
        value: 'https://raydium.io/farms/?tab=Ecosystem&farmid=C7KtyxWPukyvkxWFybuDDd92ofG2jZa9vFjAfhY7ymQt',
      },
      {
        text: 'SWAP',
        value: 'https://app.1space.me/',
      },
      {
        text: 'TRADING',
        value: 'https://dex.1space.me/',
      },
      {
        text: 'NFT STAKING',
        value: 'https://stake.1space.me/',
      },
      {
        text: 'NFT COLLECTION',
        value: 'https://nft.1space.me/',
      },
      {
        text: 'DOCS',
        value: 'https://docs.1space.me/',
      },
    ],
    styles: {
      fontFamily: 'Industry, sans-serif',
      fontWeight: 400,
    },
    colors: {
      primary: '#121429',
      secondary: '#519ef7',
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
      accent: '#2a393a',
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
    maxStaked: 1205, // update with collection size
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
    name: 'parcl-san-francisco',
    displayName: 'Parcl San Francisco',
    stakePoolAddress: new PublicKey(
      '3woMMfxPCzyGHdtosNtWLKZCWNvok4k3Eup97eayXxWk'
    ),
    websiteUrl: 'https://parcl.co/',
    receiptType: ReceiptType.None,
    tokenStandard: TokenStandard.Fungible,
    hideAllowedTokens: true,
    nameInHeader: true,
    imageUrl: '/logos/parcl-san-francisco.png',
    backgroundImage: '/logos/parcl-bg.png',
    colors: {
      primary: '#0d1939',
      secondary: '#10abf0',
      backgroundSecondary: '#182443',
    },
    links: [
      { text: 'San Francisco', value: '/parcl-san-francisco' },
      { text: 'Brooklyn', value: '/parcl-brooklyn' },
      { text: 'Phoenix', value: '/parcl-phoenix' },
      { text: 'Manhattan', value: '/parcl-manhattan' },
      { text: 'Los Angeles', value: '/parcl-los-angeles' },
      { text: 'Miami', value: '/parcl-miami' },
    ],
    disallowRegions: [
      { code: 'US' }, // united states
      { code: 'CU' }, // cuba
      { code: 'IR' }, // iran
      { code: 'LY' }, // libya
      { code: 'IQ' }, // iraq
      { code: 'LB' }, // lebanon
      { code: 'CN' }, // china
      { code: 'CF' }, // central african republic
      { code: 'SS' }, // south sudan
      { code: 'SS' }, // sudan (north)
      { code: 'SY' }, // syria
      { code: 'SO' }, // somalia
      { code: 'VE' }, // venezuela
      { code: 'YE' }, // yemen
      { code: 'RU' }, // russia
      { code: 'UA', subdivision: '43' }, // the crimea
    ],
  },
  {
    name: 'parcl-miami',
    displayName: 'Parcl Miami',
    stakePoolAddress: new PublicKey(
      '74Zf3B2y6GVsHpoUQ6My8NktzHjT7Cgn6VRkUB946C62'
    ),
    websiteUrl: 'https://parcl.co/',
    receiptType: ReceiptType.None,
    tokenStandard: TokenStandard.Fungible,
    hideAllowedTokens: true,
    nameInHeader: true,
    imageUrl: '/logos/parcl-miami.png',
    backgroundImage: '/logos/parcl-bg.png',
    colors: {
      primary: '#0d1939',
      secondary: '#10abf0',
      backgroundSecondary: '#182443',
    },
    links: [
      { text: 'San Francisco', value: '/parcl-san-francisco' },
      { text: 'Brooklyn', value: '/parcl-brooklyn' },
      { text: 'Phoenix', value: '/parcl-phoenix' },
      { text: 'Manhattan', value: '/parcl-manhattan' },
      { text: 'Los Angeles', value: '/parcl-los-angeles' },
      { text: 'Miami', value: '/parcl-miami' },
    ],
    disallowRegions: [
      { code: 'US' }, // united states
      { code: 'CU' }, // cuba
      { code: 'IR' }, // iran
      { code: 'LY' }, // libya
      { code: 'IQ' }, // iraq
      { code: 'LB' }, // lebanon
      { code: 'CN' }, // china
      { code: 'CF' }, // central african republic
      { code: 'SS' }, // south sudan
      { code: 'SS' }, // sudan (north)
      { code: 'SY' }, // syria
      { code: 'SO' }, // somalia
      { code: 'VE' }, // venezuela
      { code: 'YE' }, // yemen
      { code: 'RU' }, // russia
      { code: 'UA', subdivision: '43' }, // the crimea
    ],
  },
  {
    name: 'parcl-los-angeles',
    displayName: 'Parcl Los Angeles',
    stakePoolAddress: new PublicKey(
      '8kbX53gQnpXqHQKg4Z3T1uSHsDHaP7Q7VnMbfnBWtJvk'
    ),
    websiteUrl: 'https://parcl.co/',
    receiptType: ReceiptType.None,
    tokenStandard: TokenStandard.Fungible,
    hideAllowedTokens: true,
    nameInHeader: true,
    imageUrl: '/logos/parcl-los-angeles.png',
    backgroundImage: '/logos/parcl-bg.png',
    colors: {
      primary: '#0d1939',
      secondary: '#10abf0',
      backgroundSecondary: '#182443',
    },
    links: [
      { text: 'San Francisco', value: '/parcl-san-francisco' },
      { text: 'Brooklyn', value: '/parcl-brooklyn' },
      { text: 'Phoenix', value: '/parcl-phoenix' },
      { text: 'Manhattan', value: '/parcl-manhattan' },
      { text: 'Los Angeles', value: '/parcl-los-angeles' },
      { text: 'Miami', value: '/parcl-miami' },
    ],
    disallowRegions: [
      { code: 'US' }, // united states
      { code: 'CU' }, // cuba
      { code: 'IR' }, // iran
      { code: 'LY' }, // libya
      { code: 'IQ' }, // iraq
      { code: 'LB' }, // lebanon
      { code: 'CN' }, // china
      { code: 'CF' }, // central african republic
      { code: 'SS' }, // south sudan
      { code: 'SS' }, // sudan (north)
      { code: 'SY' }, // syria
      { code: 'SO' }, // somalia
      { code: 'VE' }, // venezuela
      { code: 'YE' }, // yemen
      { code: 'RU' }, // russia
      { code: 'UA', subdivision: '43' }, // the crimea
    ],
  },
  {
    name: 'parcl-manhattan',
    displayName: 'Parcl Manhattan',
    stakePoolAddress: new PublicKey(
      '8ZBEzrvBZiSnCS9cQHpL8orWvMukPCZ4y4nyxzZ8H9i'
    ),
    websiteUrl: 'https://parcl.co/',
    receiptType: ReceiptType.None,
    tokenStandard: TokenStandard.Fungible,
    hideAllowedTokens: true,
    nameInHeader: true,
    imageUrl: '/logos/parcl-manhattan.png',
    backgroundImage: '/logos/parcl-bg.png',
    colors: {
      primary: '#0d1939',
      secondary: '#10abf0',
      backgroundSecondary: '#182443',
    },
    links: [
      { text: 'San Francisco', value: '/parcl-san-francisco' },
      { text: 'Brooklyn', value: '/parcl-brooklyn' },
      { text: 'Phoenix', value: '/parcl-phoenix' },
      { text: 'Manhattan', value: '/parcl-manhattan' },
      { text: 'Los Angeles', value: '/parcl-los-angeles' },
      { text: 'Miami', value: '/parcl-miami' },
    ],
    disallowRegions: [
      { code: 'US' }, // united states
      { code: 'CU' }, // cuba
      { code: 'IR' }, // iran
      { code: 'LY' }, // libya
      { code: 'IQ' }, // iraq
      { code: 'LB' }, // lebanon
      { code: 'CN' }, // china
      { code: 'CF' }, // central african republic
      { code: 'SS' }, // south sudan
      { code: 'SS' }, // sudan (north)
      { code: 'SY' }, // syria
      { code: 'SO' }, // somalia
      { code: 'VE' }, // venezuela
      { code: 'YE' }, // yemen
      { code: 'RU' }, // russia
      { code: 'UA', subdivision: '43' }, // the crimea
    ],
  },

  {
    name: 'parcl-brooklyn',
    displayName: 'Parcl Brooklyn',
    stakePoolAddress: new PublicKey(
      '9jnTHkJzxL14dE2CxAufBsTa19oeuNSMBuyqzZP1kDYh'
    ),
    websiteUrl: 'https://parcl.co/',
    receiptType: ReceiptType.None,
    tokenStandard: TokenStandard.Fungible,
    hideAllowedTokens: true,
    nameInHeader: true,
    imageUrl: '/logos/parcl-brooklyn.png',
    backgroundImage: '/logos/parcl-bg.png',
    colors: {
      primary: '#0d1939',
      secondary: '#10abf0',
      backgroundSecondary: '#182443',
    },
    links: [
      { text: 'San Francisco', value: '/parcl-san-francisco' },
      { text: 'Brooklyn', value: '/parcl-brooklyn' },
      { text: 'Phoenix', value: '/parcl-phoenix' },
      { text: 'Manhattan', value: '/parcl-manhattan' },
      { text: 'Los Angeles', value: '/parcl-los-angeles' },
      { text: 'Miami', value: '/parcl-miami' },
    ],
    disallowRegions: [
      { code: 'US' }, // united states
      { code: 'CU' }, // cuba
      { code: 'IR' }, // iran
      { code: 'LY' }, // libya
      { code: 'IQ' }, // iraq
      { code: 'LB' }, // lebanon
      { code: 'CN' }, // china
      { code: 'CF' }, // central african republic
      { code: 'SS' }, // south sudan
      { code: 'SS' }, // sudan (north)
      { code: 'SY' }, // syria
      { code: 'SO' }, // somalia
      { code: 'VE' }, // venezuela
      { code: 'YE' }, // yemen
      { code: 'RU' }, // russia
      { code: 'UA', subdivision: '43' }, // the crimea
    ],
  },
  {
    name: 'parcl-phoenix',
    displayName: 'Parcl Phoenix',
    stakePoolAddress: new PublicKey(
      'ESbcGhaddmgKWkW63txisKP6HwS3491brbP2hJuTrVY6'
    ),
    websiteUrl: 'https://parcl.co/',
    receiptType: ReceiptType.None,
    tokenStandard: TokenStandard.Fungible,
    hideAllowedTokens: true,
    nameInHeader: true,
    imageUrl: '/logos/parcl-phoenix.png',
    backgroundImage: '/logos/parcl-bg.png',
    colors: {
      primary: '#0d1939',
      secondary: '#10abf0',
      backgroundSecondary: '#182443',
    },
    links: [
      { text: 'San Francisco', value: '/parcl-san-francisco' },
      { text: 'Brooklyn', value: '/parcl-brooklyn' },
      { text: 'Phoenix', value: '/parcl-phoenix' },
      { text: 'Manhattan', value: '/parcl-manhattan' },
      { text: 'Los Angeles', value: '/parcl-los-angeles' },
      { text: 'Miami', value: '/parcl-miami' },
    ],
    disallowRegions: [
      { code: 'US' }, // united states
      { code: 'CU' }, // cuba
      { code: 'IR' }, // iran
      { code: 'LY' }, // libya
      { code: 'IQ' }, // iraq
      { code: 'LB' }, // lebanon
      { code: 'CN' }, // china
      { code: 'CF' }, // central african republic
      { code: 'SS' }, // south sudan
      { code: 'SS' }, // sudan (north)
      { code: 'SY' }, // syria
      { code: 'SO' }, // somalia
      { code: 'VE' }, // venezuela
      { code: 'YE' }, // yemen
      { code: 'RU' }, // russia
      { code: 'UA', subdivision: '43' }, // the crimea
    ],
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
    maxStaked: 4996,
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
              value: 3363,
            },
            {
              key: 'Silver',
              value: 1498,
            },
            {
              key: 'Gold',
              value: 125,
            },
            {
              key: 'Platinum',
              value: 10,
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
    name: 'test-guys',
    displayName: 'Test Guys',
    hostname: 'research.moonshinelabs.io',
    nameInHeader: true,
    stakePoolAddress: new PublicKey(
      'z4x4twXzrw8XVEFqQs9EcmgeXfhMqRpwYVpJEeRAbVN'
    ),
    websiteUrl: 'https://warp.moonshinelabs.io/caps',
    receiptType: ReceiptType.Original,
    tokenStandard: TokenStandard.NonFungible,
    imageUrl:
      'https://www.arweave.net/DXw0PO5-EZlx26duubW157IfvpiQvjbAoM5VFCMFEcI?ext=png',
    maxStaked: 1111,
    backgroundImage:
      'https://shdw-drive.genesysgo.net/5aWZWB6vXbZrf1CNmiM3rAWnzf36Bpuq8rxRYHBzGeGq/tgbg.png',
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
    contrastHomepageBkg: true,
    maxStaked: 2222,
    receiptType: ReceiptType.Original,
    websiteUrl: 'https://steamland.io',
    hostname: 'harvest.steamland.io',
    imageUrl:
      'https://raw.githubusercontent.com/Steamland/images/main/harvest_logo.png',
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
  {
    name: 'y00topia',
    displayName: 'y00topia staking',
    stakePoolAddress: new PublicKey(
      'GJtJVCBCXVkPuzmS45zWDEkztG1EGGvNcnddL2dsbDmh'
    ),
    websiteUrl: 'https://twitter.com/ABCy00topia',
    imageUrl:
      'https://cdn.discordapp.com/attachments/1017836201685823549/1027266302894669824/white.png',
    backgroundImage:
      'https://cdn.discordapp.com/attachments/1017836201685823549/1027264876961349712/abc_a.png',
    maxStaked: 1111,

    receiptType: ReceiptType.Original,
    tokenStandard: TokenStandard.NonFungible,
    hideAllowedTokens: true,
    links: [
      {
        text: 'Discord',
        value: 'https://discord.gg/dUE4ezvUDS',
      },
      {
        text: 'Twitter',
        value: 'https://twitter.com/ABCy00topia',
      },
      {
        text: 'Buy',
        value: 'https://magiceden.io/marketplace/abc_y00topia',
      },
    ],
    styles: {
      fontFamily: 'Industry, sans-serif',
      fontWeight: 500,
    },
    colors: {
      primary: '#120d18',
      secondary: '#e42575',
      accent: '#33273f',
      fontColor: '#e61f57',
      fontColorSecondary: '#000000',
      backgroundSecondary: '#120d18',
    },
  },
  {
    name: 'Pixel-Y00ts',
    displayName: 'Pixel Y0ots',
    nameInHeader: true,
    stakePoolAddress: new PublicKey(
      '6JAjWAWhzAdZRVXmLKpzXy8idqPY3Jb5AUUXzBPm3FGt'
    ),
    hostname: 'staking.pixely00ts.xyz',
    hideFooter: true,
    hideAllowedTokens: true,
    websiteUrl: 'https://www.pixely00ts.xyz/',
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
      'https://raw.githubusercontent.com/DicersN00b/loots-logo/main/logo.png',
    // Background image for poolq
    backgroundImage:
      'https://raw.githubusercontent.com/DicersN00b/loots-logo/main/BG%20STAKING.png',

    // Website url if specified will be navigated to when the image in the header is clicked
    maxStaked: 10000,
    links: [
      {
        text: 'Pixel Y00ts',
        value: 'https://www.pixely00ts.xyz/',
      },
      {
        text: 'Twitter',
        value: 'https://twitter.com/PY00ts',
      },
      {
        text: 'Discord',
        value: 'https://discord.com/invite/pixely00ts',
      },
      {
        text: 'Buy Pixel Y00ts',
        value: 'https://magiceden.io/marketplace/pixel_yoots',
      },
    ],
  },
  {
    name: 'hellshade',
    displayName: 'Hellshade Staking',
    stakePoolAddress: new PublicKey(
      'GHZ671W39u4d4ELFvqfVeKor1fGGTunrS56PZQqM1wFM'
    ),
    description:
      "Stake your artwork by @Hellshade here to start earning your $BBT '$Blackberry' Tokens for future art drops",
    hidden: true,
    notFound: false,
    imageUrl:
      'https://images-cdn.exchange.art/LH3Na6UWARcgucQoDRuIkxxaOYXIsAf-I03bPiEFhsw?ext=fastly&width=1000&optimize=medium&auto=avifwebp',
    // secondaryImageUrl: 'https://raw.githubusercontent.com/flipthetip/test-tsc/main/arx.png',
    backgroundImage:
      'https://www.zingerbug.com/Backgrounds/background_images/black_stucco_wall_texture_seamless.jpg',
    styles: {
      fontFamily: 'Franklin Gothic Medium',
      // fontWeight: 500,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    colors: {
      primary: '#000000',
      secondary: '#5d7f9e',
      accent: '#fff2cc',
      fontColor: '#fff2cc',
      fontColorSecondary: '#fff2cc',
    },
    // maxStaked: ,
    receiptType: ReceiptType.Original,
  },
  {
    name: 'azl-nutzzz-world',
    displayName: 'AZL Nutzz World Staking',
    stakePoolAddress: new PublicKey(
      'APhntuf48ME176zvV3feCo9pN5mQuXqQFsC2gBiBw895'
    ),
    contrastHomepageBkg: true,
    maxStaked: 3333,
    links: [
      {
        text: 'Twitter',
        value: 'https://twitter.com/AZLnft',
      },
      {
        text: 'Discord',
        value: 'https://discord.gg/cxgnzF43BT',
      },
      {
        text: 'Magic Eden',
        value: 'https://magiceden.io/marketplace/azl_nutzzz_world',
      },
    ],

    receiptType: ReceiptType.Original,
    websiteUrl: 'https://stake.cardinal.so/azl-nutzzz-world',
    imageUrl:
      'https://bafybeihy4wxax43nyhffx5dyzrt33pjipwap6qmtli55xoft32qsgejxnu.ipfs.nftstorage.link/',
    styles: {
      fontFamily: 'Industry, sans-serif',
      fontWeight: 500,
    },
    tokenStandard: TokenStandard.NonFungible,
    hideAllowedTokens: true,
    colors: {
      // primary: '#2d0c65',
      //secondary: '#ed69fa',
      //accent: '#f7f6fe',
      //fontColor: '#FFFFFF',
      primary: '#000000',
      secondary: '#BD38F3',
      accent: '#8B2AB4',
      fontColor: '#FFFFFF',
    },
  },
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
        value:
          'https://hyperspace.xyz/collection/4Wo6Yuv9Den1DHuv8GmFDhA8cwGa28ToaXRwLwCRUqAX',
      },
    ],
  },
  {
    name: 'gnarafdao',
    displayName: 'GnarAF DAO',
    stakePoolAddress: new PublicKey(
      '3hdpn7vkfASdzWvqrLgT83TZLNWdhkG3C1LeubWk7RRZ'
    ),
    websiteUrl: 'https://bobbyrabbits.com/#/GnarAFDAO',
    imageUrl: 'https://arweave.net/H-9FITsB2SdPfJXhYq2QWMMSi7SG4LA_0MHbNnN_zN8',
    maxStaked: 3333,
    nameInHeader: true,
    description: 'Stake your GnarAF DAO Card to earn $GNAR',
    receiptType: ReceiptType.Original,
    tokenStandard: TokenStandard.NonFungible,
    hideAllowedTokens: true,
    hideFooter: true,
    styles: {
      fontFamily: 'Paralucent',
      fontWeight: 500,
      backgroundSize: '100% auto',
    },
    links: [
      {
        text: 'Mint Now',
        value: 'https://gnarafdao.vercel.app/',
      },
    ],
    colors: {
      primary: '#672394',
      secondary: '#fad141',
      accent: '#672394',
      fontColor: '#e8e6d9',
    },
  },

  {
    name: 'thepolarians',
    displayName: 'The Polarians',
    stakePoolAddress: new PublicKey(
      'HSLsc3fyHYyBjTnSPSGyyxubcGdtw4ih8odTcHturZrU'
    ),
    websiteUrl: 'https://twitter.com/polariansnft',
    receiptType: ReceiptType.Original,
    maxStaked: 2400, // update with collection size
    imageUrl:
      'https://dl.airtable.com/.attachments/4267ccfa3ec6b022948a23376955d686/ad374799/polarproject500x500.gif',
    tokenStandard: TokenStandard.NonFungible,
    styles: {
      fontFamily: 'Player One',
      fontWeight: 500,
    },
    description: 'Stake your Polarians NFT to earn $CRYSTAL.',
    colors: {
      primary: '#383838',
      secondary: '#4D4DFF',
      accent: '#4D4DFF',
      fontColor: '#4D4DFF',
      fontColorSecondary: '#FFFFFF',
    },
  },
  {
    name: 'steamland',
    displayName: 'Harvesting - Steamland',
    stakePoolAddress: new PublicKey(
      '5n9G7o9ZZFmfx4dcbd4HgNYcGWFiQ2wGKaKHYT8bWDf7'
    ),
    contrastHomepageBkg: true,
    maxStaked: 2222,
    receiptType: ReceiptType.Original,
    websiteUrl: 'https://steamland.io',
    hostname: 'harvest.steamland.io',
    imageUrl:
      'https://raw.githubusercontent.com/Steamland/images/main/harvest_logo.png',
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
  {
    name: 'rejected y00ts club',
    displayName: 'RYC staking',
    stakePoolAddress: new PublicKey(
      '7YPHMXpiFAMSeGpxYE66aGPH6UUJGe6samYhzKiEpEqR'
    ),
    websiteUrl: 'https://twitter.com/rejected_y00ts',
    imageUrl:
      'https://bafybeiex3lqiug7djuyl2vws47syaji6of7calc67tt3we4ps4nz5kbpnq.ipfs.nftstorage.link/',
    backgroundImage: '',
    maxStaked: 6969,

    receiptType: ReceiptType.Original,
    tokenStandard: TokenStandard.NonFungible,
    hideAllowedTokens: true,
    links: [
      {
        text: 'Discord',
        value: 'https://discord.gg/gfdcAyrcn9',
      },
      {
        text: 'Twitter',
        value: 'https://twitter.com/Rejected_y00ts',
      },
      {
        text: 'Magic Eden',
        value: 'https://magiceden.io/marketplace/rejected_y00ts_club_',
      },
    ],
    styles: {
      fontFamily: 'Industry, sans-serif',
      fontWeight: 500,
    },
    colors: {
      primary: '#120d18',
      secondary: '#e42575',
      accent: '#33273f',
      fontColor: '#e61f57',
      fontColorSecondary: '#000000',
      backgroundSecondary: '#120d18',
    },
  },
  {
    name: 'Degen Strays Club',
    displayName: 'Cave of Treasure',
    nameInHeader: true,
    stakePoolAddress: new PublicKey(
      'HM4KxPucFiFzJBr1saM1n7Hd4HhkLnp9FQXWaGv6gh5s'
    ),
    description: 'Stake your Strays, earn $STRYS',
    hideFooter: true,
    receiptType: ReceiptType.Receipt,
    tokenStandard: TokenStandard.NonFungible,
    // styles to apply to the whole stake pool
    styles: {
      fontFamily: 'Lato',
      fontWeight: 700,
      objectPosition: 'center',
    },
    // Colors object to style the stake page
    colors: {
      primary: '#372554',
      secondary: '#372554',
      backgroundSecondary: 'rgb(24 24 24 / 50%)',
      fontColor: '#EEEEEE',
    },
    imageUrl:
      'https://user-images.githubusercontent.com/107280738/206711148-a12b5066-9bcb-4866-b83f-e27ee088c9b1.png',
    // Background image for poolq
    backgroundImage:
      'https://user-images.githubusercontent.com/107280738/202006912-0e534e82-e3c7-47d6-9a1b-9c47f12bf1c6.jpg',

    // Website url if specified will be navigated to when the image in the header is clicked
    links: [
      {
        text: 'Twitter',
        value: 'https://twitter.com/modcatsclub',
      },
      {
        text: 'Discord',
        value: 'https://discord.com/invite/modcatsclub',
      },
      {
        text: 'Magic Eden',
        value: 'https://magiceden.io/creators/modcatsclub',
      },
      {
        text: 'Stray Store',
        value: 'https://straystore.modcatsclub.xyz',
      },
    ],
  },
  {
    name: 'BioHumans ',
    displayName: 'BioHumans ',
    stakePoolAddress: new PublicKey(
      '7yFb4AQfz88mZzuQVSkCQZzLoA8UEVK8ySHmpHKnGqa2'
    ),
    websiteUrl: 'https://t.co/QIAhGtpiaU',
    imageUrl:
      'https://raw.githubusercontent.com/conqueror1234/crypto/main/logo.png',
    maxStaked: 777,
    receiptType: ReceiptType.Original,
    tokenStandard: TokenStandard.NonFungible,
    hideAllowedTokens: true,
    links: [
      {
        text: 'Discord',
        value: 'https://discord.gg/KNgBrWVYCW',
      },
      {
        text: 'Buy',
        value: 'https://magiceden.io/marketplace/biohumans',
      },
    ],
    colors: {
      primary: '#000000',
      secondary: '#f5050d',
      accent: '#990505',
      fontColor: '#FFFFFF',
    },
  },
  {
    name: 'BioHumans ',
    displayName: 'BioHumans ',
    stakePoolAddress: new PublicKey(
      '2iA21TAv7JBmRGTKeRHrSdb8FaPxzEgn8kfVbTd6AkGY'
    ),
    websiteUrl: 'https://t.co/QIAhGtpiaU',
    imageUrl:
      'https://raw.githubusercontent.com/conqueror1234/crypto/main/logo.png',
    maxStaked: 777,
    receiptType: ReceiptType.Original,
    tokenStandard: TokenStandard.NonFungible,
    hideAllowedTokens: true,
    links: [
      {
        text: 'Discord',
        value: 'https://discord.gg/KNgBrWVYCW',
      },
      {
        text: 'Buy',
        value: 'https://magiceden.io/marketplace/biohumans',
      },
    ],
    colors: {
      primary: '#000000',
      secondary: '#f5050d',
      accent: '#990505',
      fontColor: '#FFFFFF',
    },
  },
  {
    name: 'Sound Family DAO',
    displayName: 'Sound Family DAO Staking',
    nameInHeader: true,
    stakePoolAddress: new PublicKey(
      'BGnayVs2xtEjzR42Kdq7vXnmRSjBqP9byP4xkmsmF23f'
    ),
    hostname: 'stake-soundfamily.herokuapp.com',
    hideFooter: true,
    hideAllowedTokens: true,
    websiteUrl: 'https://catchtherecord.com/',
    receiptType: ReceiptType.Original,
    tokenStandard: TokenStandard.NonFungible,
    imageUrl:
      'https://d10j3mvrs1suex.cloudfront.net/u/389084/dfd7e4a38cd6b8d454e6536fc377b590e440a03f/original/1-5kjpeg.jpg/!!/meta%3AeyJzcmNCdWNrZXQiOiJiemdsZmlsZXMifQ%3D%3D.jpg',
    maxStaked: 1080,
    backgroundImage:
      'https://d10j3mvrs1suex.cloudfront.net/u/389084/86550f1f3714d5199d6d46331a51e0ea1c6e8986/original/old-paper-texture-in-square-frame-for-cover-art-grungy-frame-in-black-background-can-be-used-to-replicate-the-aged-and-worn-look-for-your-creative-design-free-photo.jpg/!!/meta%3AeyJzcmNCdWNrZXQiOiJiemdsZmlsZXMifQ%3D%3D.jpg',
    description:
      'Stake your The Art of Field Recording, Mic The Art and fun-Sound Family DAO NFTs to earn $SREC.',
    colors: {
      primary: '#5c4b18',
      secondary: '#d9faf7',
      accent: '#362304',
      fontColor: '#edb63e',
      fontColorSecondary: '#963315',
    },
    links: [
      {
        text: 'HOME',
        value: 'https://catchtherecord.com/the-art-of-field-recording',
      },
      {
        text: 'SITE',
        value: 'https://catchtherecord.com/',
      },
      {
        text: 'MINT 1',
        value: 'https://the-art-of-field-recording.club',
      },
      {
        text: 'MINT 2',
        value: 'https://the-art-of-field-recording.club',
      },
      {
        text: 'BUY',
        value:
          'https://magiceden.io/marketplace/k8XrthqoADqQqY5sLo4gPk3t8tHWuyWJsqJT13AiZqv',
      },
      {
        text: 'TWITTER',
        value: 'https://twitter.com/field_recording',
      },
      {
        text: 'DISCORD',
        value: 'https://discord.gg/WEU9W5Ew9q',
      },
    ],
  },
  {
    name: 'DustCityStaking',
    displayName: 'Dust City Staking',
    nameInHeader: true,
    stakePoolAddress: new PublicKey(
      '6NsLz577nf9eRSfXtH18rDdJHik3PePpKwVVLPrXPtWx'
    ),
    contrastHomepageBkg: true,
    hostname: 'staking.dustcity.world',
    hideFooter: true,
    hideAllowedTokens: true,
    websiteUrl: 'staking.dustcity.world',
    receiptType: ReceiptType.Original,
    tokenStandard: TokenStandard.NonFungible,
    styles: {
      fontFamily: 'SUP',
      fontWeight: 300,
    },
    colors: {
      primary: 'rgba(0, 0, 0, 0.41)',
      secondary: '#ffcc15',
      accent: 'rgba(0, 0, 0, 0)',
      backgroundSecondary: '#181923',
      fontColor: '#f5f7fa',
      fontColorSecondary: 'black',
      fontColorTertiary: '#ffcc15',
    },
    imageUrl: 'https://i.ibb.co/JrtGLVg/finwhite.png',
    backgroundImage: 'https://i.ibb.co/TgWFYHL/image.jpg',
    maxStaked: 3333,
    links: [
      {
        text: 'Website',
        value: 'https://dustcity.world/',
      },
      {
        text: 'Twitter',
        value: 'https://twitter.com/DustCityNFT',
      },
      {
        text: 'MagicEden',
        value: 'https://magiceden.io/marketplace/dustcity',
      },
    ],
  },
  {
    name: 'RektvilleStaking',
    displayName: 'Rektville Staking',
    nameInHeader: true,
    stakePoolAddress: new PublicKey(
      'ENPEvNwSMxN6K63YwDMirSVnd9TUisDkY6cuPZiN7unS'
    ),
    contrastHomepageBkg: true,
    hostname: 'rektville.dustcity.world',
    hideFooter: true,
    hideAllowedTokens: true,
    websiteUrl: 'rektville.dustcity.world',
    receiptType: ReceiptType.Original,
    tokenStandard: TokenStandard.NonFungible,
    // styles to apply to the whole stake pool
    styles: {
      fontFamily: 'SUP',
      fontWeight: 300,
    },
    // Colors object to style the stake page
    colors: {
      primary: 'rgba(0, 0, 0, 0.41)',
      secondary: '#ffcc15',
      accent: 'rgba(0, 0, 0, 0)',
      backgroundSecondary: '#181923',
      fontColor: '#f5f7fa',
      fontColorSecondary: 'black',
      fontColorTertiary: '#ffcc15',
    },
    imageUrl:
      'https://arweave.net/z64F7Hk0nHfq-KZ9DgTBT3k7CiKfdyyyAqhC3T1TpkQ?ext=png',
    backgroundImage: 'https://i.ibb.co/TgWFYHL/image.jpg',

    // Website url if specified will be navigated to when the image in the header is clicked
    maxStaked: 7777,
    links: [
      {
        text: 'Website',
        value: 'https://dustcity.world/',
      },
      {
        text: 'Twitter',
        value: 'https://twitter.com/DustCityNFT',
      },
      {
        text: 'MagicEden',
        value: 'https://magiceden.io/marketplace/rektville',
      },
    ],
  },
  {
    name: 'Honored Strays',
    displayName: 'VIP Lounge',
    nameInHeader: true,
    stakePoolAddress: new PublicKey(
      '5fFECqpAuECrwm2S6avLLm1dtvT53H4pWn5QwG96mR64'
    ),
    description: 'Stake your Strays, earn $STRYS',
    hideFooter: true,
    receiptType: ReceiptType.Receipt,
    tokenStandard: TokenStandard.NonFungible,
    // styles to apply to the whole stake pool
    styles: {
      fontFamily: 'Lato',
      fontWeight: 700,
      objectPosition: 'center',
    },
    // Colors object to style the stake page
    colors: {
      primary: '#372554',
      secondary: '#372554',
      backgroundSecondary: 'rgb(24 24 24 / 50%)',
      fontColor: '#EEEEEE',
    },
    imageUrl:
      'https://user-images.githubusercontent.com/107280738/206711148-a12b5066-9bcb-4866-b83f-e27ee088c9b1.png',
    // Background image for poolq
    backgroundImage:
      'https://user-images.githubusercontent.com/107280738/202006912-0e534e82-e3c7-47d6-9a1b-9c47f12bf1c6.jpg',

    // Website url if specified will be navigated to when the image in the header is clicked
    links: [
      {
        text: 'Twitter',
        value: 'https://twitter.com/modcatsclub',
      },
      {
        text: 'Discord',
        value: 'https://discord.com/invite/modcatsclub',
      },
      {
        text: 'Magic Eden',
        value: 'https://magiceden.io/creators/modcatsclub',
      },
      {
        text: 'Stray Store',
        value: 'https://straystore.modcatsclub.xyz',
      },
    ],
  },
  {
    name: 'Mod Cats Club',
    displayName: 'Pot of Gold',
    nameInHeader: true,
    stakePoolAddress: new PublicKey(
      '8RwHHTxfSHhcj1VQ5NZstx4JkTwWWiLvjzG2tthttk4s'
    ),
    description: 'Stake your Strays, earn $STRYS',
    hideFooter: true,
    receiptType: ReceiptType.Receipt,
    tokenStandard: TokenStandard.NonFungible,
    // styles to apply to the whole stake pool
    styles: {
      fontFamily: 'Lato',
      fontWeight: 800,
      objectPosition: 'center',
    },
    // Colors object to style the stake page
    colors: {
      primary: '#372554',
      secondary: '#372554',
      backgroundSecondary: 'rgb(24 24 24 / 50%)',
      fontColor: '#EEEEEE',
    },
    imageUrl:
      'https://user-images.githubusercontent.com/107280738/206711148-a12b5066-9bcb-4866-b83f-e27ee088c9b1.png',
    // Background image for poolq
    backgroundImage:
      'https://user-images.githubusercontent.com/107280738/202006912-0e534e82-e3c7-47d6-9a1b-9c47f12bf1c6.jpg',

    // Website url if specified will be navigated to when the image in the header is clicked
    links: [
      {
        text: 'Twitter',
        value: 'https://twitter.com/modcatsclub',
      },
      {
        text: 'Discord',
        value: 'https://discord.com/invite/modcatsclub',
      },
      {
        text: 'Magic Eden',
        value: 'https://magiceden.io/creators/modcatsclub',
      },
      {
        text: 'Stray Store',
        value: 'https://straystore.modcatsclub.xyz',
      },
    ],
  },
  {
    name: 'dwa',
    displayName: 'Bweed Bakery',
    hostname: 'stake.duckzwitattitudes.com',
    description: 'Stake your D.W.A to earn $Bweed',
    stakePoolAddress: new PublicKey(
      'EAhYUAhAiGKuRzb6Sc249SM4DjCxQtsTzTqgogx6HYmM'
    ),
    websiteUrl: 'https://duckzwitattitudes.com',
    imageUrl:
      'https://raw.githubusercontent.com/WildyPixel/dwa_img/main/logo2.png',
    //  'https://www.arweave.net/DWKkkbbOi5x6MJhgulQ6FwcXh-emrcaqg8cjTx5j0PI?ext=png',
    maxStaked: 1500,
    nameInHeader: true,
    receiptType: ReceiptType.Original,
    tokenStandard: TokenStandard.NonFungible,
    hideAllowedTokens: true,
    hideFooter: true,
    contrastHomepageBkg: false,
    styles: {
      fontFamily: 'Industry, sans-serif',
      fontWeight: 500,
      backgroundSize: '100% auto',
    },
    links: [
      {
        text: 'Buy Now',
        value: 'https://mint.duckzwitattitudes.com',
      },
    ],
    colors: {
      primary: '#000000',
      secondary: '#a40b11',
      accent: '#a40b11',
      fontColor: '#FFFFFF',
      fontColorSecondary: '#ffffff',
      backgroundSecondary: '#222222',
    },
    backgroundImage:
      'https://raw.githubusercontent.com/WildyPixel/dwa_img/main/bg2.jpeg',
  },
  {
    name: 'vandals',
    displayName: 'Vandals',
    description:
      'Train your Vandals to earn $VAULT. You can stake and unstake at any time. $VAULT is a a reward mechanism for Vandals holders to show to reward those who train the hardest.',
    stakePoolAddress: new PublicKey(
      'ndu643uUkFBt4YbXgHEfstkU25eEe4kDLjTD5uziEKx'
    ),
    websiteUrl: 'https://twitter.com/VandalCityCorp',
    imageUrl: '/logos/vandals.png',
    maxStaked: 10000,
    nameInHeader: true,
    tokenStandard: TokenStandard.NonFungible,
    hideAllowedTokens: true,
    hideFooter: true,
    links: [
      {
        text: 'Buy Now',
        value:
          'https://hyperspace.xyz/collection/H5yBW4TwrUqKqpJZ436UnL9YUDBdvn27gzs8WGNKSARE',
      },
    ],
    colors: {
      primary: '#0d0d0d',
      secondary: '#CCCCCC',
      fontColor: '#ffffff',
      accent: '#666666',
      fontColorSecondary: '#0d0d0d',
    },
  },
]
