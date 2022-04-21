import { PublicKey } from '@solana/web3.js'
import { pubKeyUrl, shortPubKey } from './utils'

export function ShortPubKeyUrl({
  pubkey,
  cluster,
}: {
  pubkey: PublicKey | null | undefined
  cluster: string
}) {
  return (
    <a
      className="text-xs text-gray-500"
      target="_blank"
      rel="noreferrer"
      href={pubKeyUrl(pubkey, cluster)}
    >
      {shortPubKey(pubkey)}
    </a>
  )
}
