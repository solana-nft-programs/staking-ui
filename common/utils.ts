import type { Cluster } from '@solana/web3.js'
import { PublicKey } from '@solana/web3.js'

export function shortPubKey(pubkey: PublicKey | string | null | undefined) {
  if (!pubkey) return ''
  return `${pubkey?.toString().substring(0, 4)}..${pubkey
    ?.toString()
    .substring(pubkey?.toString().length - 4)}`
}

export function pubKeyUrl(
  pubkey: PublicKey | null | undefined,
  cluster: string,
  endpoint?: 'anchor-account' | 'metadata'
) {
  if (!pubkey) return 'https://explorer.solana.com'
  return `https://explorer.solana.com/address/${pubkey.toString()}${
    endpoint ? `/${endpoint}` : ''
  }${cluster === 'devnet' ? '?cluster=devnet' : ''}`
}

export function metadataUrl(
  pubkey: PublicKey | null | undefined,
  cluster: string
) {
  if (!pubkey) return 'https://www.magiceden.io/item-details/'
  return `https://www.magiceden.io/item-details/${pubkey.toString()}${
    cluster === 'devnet' ? '?cluster=devnet' : ''
  }`
}

export function secondstoDuration(durationSeconds: number) {
  const years = Math.floor(durationSeconds / 31536000)
  const months = Math.floor((durationSeconds % 31536000) / 2592000)
  const weeks = Math.floor((durationSeconds % 2592000) / 604800)
  const days = Math.floor((durationSeconds % 604800) / 86400)
  const hours = Math.floor((durationSeconds % 86400) / 3600)
  const minutes = Math.floor((durationSeconds % 3600) / 60)
  const seconds = Math.ceil(durationSeconds % 60)
  let duration = ''
  const optionalVals = [`${years}Y`, `${months}M`, `${weeks}w`, `${days}d`]
  const vals = [`${hours}h`, `${minutes}m`, `${seconds}s`]
  for (const val of optionalVals) {
    if (parseInt(val.substring(0, val.length - 1)) > 0) {
      duration += val + ' '
    }
  }
  for (const val of vals) {
    duration += val + ' '
  }
  return duration
}

export const firstParam = (param: string | string[] | undefined): string => {
  if (!param) return ''
  return typeof param === 'string' ? param : param[0] || ''
}

export const camelCase = (str: string) => {
  return str
    .split(' ')
    .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
    .join('')
}

export const tryPublicKey = (
  publicKeyString: PublicKey | string | string[] | undefined | null
): PublicKey | null => {
  if (publicKeyString instanceof PublicKey) return publicKeyString
  if (!publicKeyString) return null
  try {
    return new PublicKey(publicKeyString)
  } catch (e) {
    return null
  }
}

export const hexColor = (colorString: string): string => {
  if (colorString.includes('#')) return colorString
  const [r, g, b] = colorString
    .replace('rgb(', '')
    .replace('rgba(', '')
    .replace(')', '')
    .replace(' ', '')
    .split(',')
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = parseInt(x || '').toString(16)
        return hex.length === 1 ? '0' + hex : hex
      })
      .join('')
  )
}

export const contrastColorMode = (bgColor: string): [string, boolean] => {
  return parseInt(hexColor(bgColor).replace('#', ''), 16) < 0xffffff / 2
    ? ['#ffffff', true]
    : ['#000000', false]
}

export const camelCaseToTitle = (str: string) => {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
}

export const withCluster = (s: string, cluster: Cluster) => {
  return `${s}${
    cluster !== 'mainnet-beta'
      ? `${s.includes('?') ? '&' : '?'}cluster=${cluster}`
      : ''
  }`
}
