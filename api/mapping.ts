import type { ReceiptType } from '@cardinal/staking/dist/cjs/programs/stakePool'
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
  stakePoolAddress: string
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
  socialLinks?: string[]
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

export const stakePoolsWithHostnames: {
  stakePoolAddress: string
  hostname: string
}[] = [
  {
    stakePoolAddress: 'BKEAfh7ta4SDx7LHiuUK96uBUJMLWcsPPNwLhZthzZd7',
    hostname: 'stake.liminality.app',
  },
  {
    stakePoolAddress: '6LGoJWDEQWGQQ6s2oZWbLqRGfjLbyrzVUtLcXDKc5hED',
    hostname: 'https://www.geexolotls.com/staking',
  },
  {
    hostname: 'legendary.thelotus.io',
    stakePoolAddress: 'BeT8h9E5BcgcMBxF7Si5GSRuB6zHcSpFuMpp6uTcVRFN',
  },
  {
    stakePoolAddress: '29MgtLuX8ByGMZoreUoY7hsP2YY935gJ3wRB1fhiSF8o',
    hostname: 'https://staking2x.theshadyclass.xyz',
  },
  {
    hostname: 'stake.goodskellas.xyz',
    stakePoolAddress: 'FqBj7uVDHfy6cDDoihX3cQSCmV347SoFXUtvUe5auMQ8',
  },
  {
    stakePoolAddress: 'zNt5nnEaL87rG9DT2cxvdVMf8sLBe6qEuZK8D5K4r9M',
    hostname: 'https://staking1x.theshadyclass.xyz',
  },
  {
    stakePoolAddress: 'DgrtWV95DP3ix4GFMKDLwqMNZ213KJk9NgM6vmdPtyk1',
    hostname: 'Learn2Earn.io',
  },
  {
    hostname: 'stake.spaceboys.xyz',
    stakePoolAddress: 'EchAuMJeaVhbitnEns7QPYh2mFqxWFY8QsQmchn4LRVz',
  },
  {
    stakePoolAddress: 'BCtcLrKhiZbFTRMB2W8iQWttYF82cLJzo7ZnnnkqXnnC',
    hostname: 'stake.metaladsai.com',
  },
  {
    stakePoolAddress: 'CQK61z8JRqoaowTLXhM61vY2bwLct2L2fiHdTNcZZx4v',
    hostname: 'stake-lads.metaladsai.com',
  },
  {
    stakePoolAddress: '8eqFBjdYYN4f2ibFQ1SADBbGrQKPcfDuYQn32t3NuEoW',
    hostname: 'stake.roguesharks',
  },
  {
    hostname: 'stake.unfrgtn.space',
    stakePoolAddress: '4TMt9ehagkdFgZJBnyBRBTNfXUD8xLX18JyPVeGDpaKb',
  },
  {
    stakePoolAddress: 'FBTqpPynmDdVsYP4eep6pJonwMsFoVhaXcCpah3yYLZY',
    hostname: 'stake.1space.me',
  },
  {
    stakePoolAddress: '33cp8KDrzJpJDDRTSyTght2FuXCbUDmAiecFRw8qgem4',
    hostname: 'coinstake.1space.me',
  },
  {
    stakePoolAddress: 'AYtjirk6EJMSXNwkbteoGqu8hZbbGkzw3hUvmfHALkP3',
    hostname: 'spaceman-stake.1space.me',
  },
  {
    stakePoolAddress: 'AzFdEKtqanvPeQ7chcKNXJHAzcZRLc8GbkSzG8JUrT4W',
    hostname: 'stake.rebellionbots.io',
  },
  {
    hostname: 'research.moonshinelabs.io',
    stakePoolAddress: 'z4x4twXzrw8XVEFqQs9EcmgeXfhMqRpwYVpJEeRAbVN',
  },
  {
    stakePoolAddress: '5n9G7o9ZZFmfx4dcbd4HgNYcGWFiQ2wGKaKHYT8bWDf7',
    hostname: 'harvest.steamland.io',
  },
  {
    stakePoolAddress: '6JAjWAWhzAdZRVXmLKpzXy8idqPY3Jb5AUUXzBPm3FGt',
    hostname: 'staking.pixely00ts.xyz',
  },
  {
    stakePoolAddress: 'G9nryHatSzQQ93ehjNejhiZpmgzQsRxZVTzLSxiDp8uU',
    hostname: 'vaults.metacreed.com',
  },
  {
    stakePoolAddress: '5n9G7o9ZZFmfx4dcbd4HgNYcGWFiQ2wGKaKHYT8bWDf7',
    hostname: 'harvest.steamland.io',
  },
  {
    stakePoolAddress: 'BGnayVs2xtEjzR42Kdq7vXnmRSjBqP9byP4xkmsmF23f',
    hostname: 'stake-soundfamily.herokuapp.com',
  },
  {
    stakePoolAddress: '6NsLz577nf9eRSfXtH18rDdJHik3PePpKwVVLPrXPtWx',
    hostname: 'staking.dustcity.world',
  },
  {
    stakePoolAddress: 'ENPEvNwSMxN6K63YwDMirSVnd9TUisDkY6cuPZiN7unS',
    hostname: 'rektville.dustcity.world',
  },
  {
    hostname: 'stake.duckzwitattitudes.com',
    stakePoolAddress: 'EAhYUAhAiGKuRzb6Sc249SM4DjCxQtsTzTqgogx6HYmM',
  },
  {
    stakePoolAddress: '9af9HiyQ7EHjMNB14temaoKpViFD3D96o2MvBor7xxf3',
    hostname: 'staking.thekingscastle.io',
  },
  {
    stakePoolAddress: '6ZKWsXn9QHnubteRE6v4UcnMddkzJAhRkWfWVEhFKiMd',
    hostname: 'staking.hyperionnft.io',
  },
  {
    stakePoolAddress: 'HBsam1w2i35vUVfg7ZdngqFQ8m9vmJEhTmn3VAkgmYhM',
    hostname: 'stake.solanamcs.com',
  },
  {
    stakePoolAddress: '9A95mxSKUt4eFmX87JC18HKmg8NweLNF299ArK45kie7',
    hostname: 'staking.howlynft.xyz',
  },
  {
    stakePoolAddress: 'Fkk1D46RjHP2jtjcHCYRbGcTweEARewb5XqHBTTvyNdm',
    hostname: 'https://stake.cardinal.so/DevilBots',
  },
  {
    stakePoolAddress: 'EBeHpw9byuS55Znu4qrpsPC9LJvtrgNRKNwzWQPHk2g1',
    hostname: 'v2stake.senseilabs.xyz',
  },
  {
    stakePoolAddress: '9A3tS3sJ4DrPcVdshZTKHLDUUy1zoSLp47rPPhmyvNGD',
    hostname: 'dig-staking.xyz',
  },
  {
    stakePoolAddress: '4CnsdUSFCFKa9zBupuxFesZZJm64Eq3WgrAePF2KCuXv',
    hostname: 'inkbank.io',
  },
  {
    stakePoolAddress: 'ETtip5yn9T7FtFgYV7k8RUkcryuoiPSj9hxC3mX7dKzq',
    hostname: 'stake.moonroll.io',
  },
  {
    stakePoolAddress: 'H7CFeUboerg7w3RaU8apsPJwkU4zW1fPXenQygiHPFn3',
    hostname: 'cheese-computer.aarrohan.com',
  },
]
