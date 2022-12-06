import type { Wallet as AnchorWallet } from '@project-serum/anchor'
import type { Wallet } from '@saberhq/solana-contrib'
import type { WalletContextState } from '@solana/wallet-adapter-react'
import { Keypair } from '@solana/web3.js'

export const asWallet = (wallet: WalletContextState): Wallet => {
  return {
    signTransaction: wallet.signTransaction!,
    signAllTransactions: wallet.signAllTransactions!,
    publicKey: wallet.publicKey!,
  }
}

export const asEmptyAnchorWallet = (
  wallet: WalletContextState
): AnchorWallet => {
  return {
    signTransaction: wallet.signTransaction!,
    signAllTransactions: wallet.signAllTransactions!,
    publicKey: wallet.publicKey!,
    payer: new Keypair(),
  }
}
