import { tryPublicKey } from '@cardinal/namespaces-components'
import { useWallet } from '@solana/wallet-adapter-react'
import type { PublicKey } from '@solana/web3.js'
import { firstParam } from 'common/utils'
import { useRouter } from 'next/router'

export const useWalletIds = () => {
  const wallet = useWallet()
  const { query } = useRouter()
  const walletIds = [
    ...firstParam(query.wallet)
      .split(',')
      .map((id) => tryPublicKey(id)),
    wallet.publicKey,
  ]
  return walletIds.filter((id): id is PublicKey => id !== null)
}
