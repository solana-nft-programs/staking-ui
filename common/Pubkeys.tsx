import { PublicKey } from '@solana/web3.js'
import { pubKeyUrl, shortPubKey } from './utils'

export function ShortPubKeyUrl({
  pubkey,
  cluster,
  className,
}: {
  pubkey: PublicKey | null | undefined
  cluster: string
  className?: string
}) {
  return (
    <a
      className={`text-xs ${className}`}
      target="_blank"
      rel="noreferrer"
      href={pubKeyUrl(pubkey, cluster)}
    >
      {shortPubKey(pubkey)}
    </a>
  )
}
