import { useWallet } from '@solana/wallet-adapter-react'

export const useWalletId = () => {
  const wallet = useWallet()
  return wallet.publicKey
}
