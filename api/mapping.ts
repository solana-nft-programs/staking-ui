import { AirdropMetadata } from './../common/Airdrop'
import { PublicKey } from '@solana/web3.js'
import { ReceiptType } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { CSSProperties } from 'react'

export enum TokenStandard {
  // Fungible, can have more than 1
  Fungible = 1,
  // Non fungible are all unique
  NonFungible = 2,
}

export type StakePoolMetadata = {
  // Name of this stake pool used as an id. Should be in lower-case kebab-case since it is used in the URL as /{name}
  // https://www.theserverside.com/blog/Coffee-Talk-Java-News-Stories-and-Opinions/Why-you-should-make-kebab-case-a-URL-naming-convention-best-practice
  name: string
  // Display name to be displayed in the header. Often the same as name but with capital letters and spaces
  displayName: string
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
  // Optional config to link redirect to page when you click on this pool
  redirect?: string
  // Hide allowed tokens style
  hideAllowedTokens?: boolean
  // styles to apply to the whole stake pool
  styles?: CSSProperties
  // Colors object to style the stake page
  colors?: {
    primary: string
    secondary: string
    accent?: string
    fontColor?: string
    backgroundSecondary?: string
  }
  // Image url to be used as the icon in the pool selector and the header
  imageUrl?: string
  // Website url if specified will be navigated to when the image in the header is clicked
  websiteUrl?: string
  // Max staked is used to compute percentage of total staked
  maxStaked?: number
  // Links to show at the top right of the page
  links?: { text: string; value: string }[]
  // On devnet when you click the airdrop button on this page it will clone NFTs with this metadata and airdrop to the user
  airdrops?: AirdropMetadata[]
}

export const defaultSecondaryColor = 'rgba(29, 78, 216, 255)'

export const stakePoolMetadatas: StakePoolMetadata[] = [
  {
    name: 'cardinal',
    displayName: 'Cardinal',
    stakePoolAddress: new PublicKey(
      '2s3qXuGyMNedXS61Vi9XsRx7HuryyyZUYGyMtCrKUXva'
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
    websiteUrl: 'https://hub.blockasset.co/nft-staking-v2',
    imageUrl:
      'https://blockasset.co/static/logo-e51ac9985ba7aef4ac8c1b1ae1c00511.png',
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
  },
  {
    name: 'blockasset-smesh-bros',
    displayName: 'Blockasset Smesh Bros',
    stakePoolAddress: new PublicKey(
      'Bce4Aq4YheBo5hENeoMhjywdvMhEMc8sUh21S87Qv4q6'
    ),
    websiteUrl: 'https://hub.blockasset.co/smesh-staking',
    receiptType: ReceiptType.Original,
    imageUrl:
      'https://blockasset.co/static/logo-e51ac9985ba7aef4ac8c1b1ae1c00511.png',
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
  },
  {
    name: 'block-token',
    displayName: 'Blockasset Token Staking',
    stakePoolAddress: new PublicKey(
      'jhksrHQqRKBEFuker9buKw4zDDrmENGTTKnUn2QzsUD'
    ),
    websiteUrl: 'https://hub.blockasset.co/token-staking-v2',
    imageUrl:
      'https://blockasset.co/static/logo-e51ac9985ba7aef4ac8c1b1ae1c00511.png',
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
      accent: '#1fcfb11c',
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
    links: [
      {
        text: 'PFP Vault',
        value: '/meta-ops',
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
      accent: '#1fcfb11c',
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
    stakePoolAddress: new PublicKey(
      'BrR1W8bNBfJZGqzsSvMQ8tUJL9tm963E6qR7R99YReiD'
    ),
    hidden: true,
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
    colors: {
      primary: '#344E41',
      secondary: '#131418',
      accent: '#1fcfb11c',
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
    maxStaked: 3333,
    imageUrl: 'https://arweave.net/HpdUi39S2ixPus6cU74LeoXaKwWcxezIUTQkvVV9XKs',
    redirect: 'https://staking.plane-x.io/',
    colors: {
      primary: '#000000',
      secondary: '#803499',
      accent: '#803499',
      fontColor: '#FFFFFF',
    },
    notFound: true,
  },
  {
    name: 'rogue-sharks',
    displayName: 'Rogue Sharks',
    stakePoolAddress: new PublicKey(
      '8eqFBjdYYN4f2ibFQ1SADBbGrQKPcfDuYQn32t3NuEoW'
    ),
    websiteUrl: 'https://www.roguesharks.org/',
    receiptType: ReceiptType.Receipt,
    maxStaked: Infinity, // update with collection size
    hidden: true,
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
    name: 'stake',
    displayName: 'Cannaverse',
    stakePoolAddress: new PublicKey(
      '5DoGTq3ciQ1aDFUuTFLhFLdiXuPjnWmjhTSWdzLpZkgY'
    ),
    websiteUrl: 'https://cannaverse.gg/',
    receiptType: ReceiptType.Original,
    maxStaked: 1700,
    imageUrl:
      'https://cannaverse.gg/wp-content/uploads/2022/05/cannaverse-white-logo-full-1-e1652295225261.png',
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
    name: '00RR0R',
    displayName: '00RR0R C01NS',
    stakePoolAddress: new PublicKey(
      '4RMzeQMV8Dnbb3p3EH8UoF6GaK1PSU3FbJUQi1zbiSR3'
    ),
    websiteUrl: 'https://00RR0R.com/',
    receiptType: ReceiptType.Original,
    imageUrl:
      'https://www.00rr0r.com/logo-stake.png',
    maxStaked: 4999,
    colors: {
      primary: '#000000',
      secondary: '#4da1de',
      accent: '#1fcfb11c',
      fontColor: '#FFFFFF',
    },
  },
]
