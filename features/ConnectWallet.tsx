import React from 'react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { Button } from 'components/Button'
import Image from 'next/image'
import sentry from '../images/sentry.png'

export function ConnectWallet() {
  const walletModal = useWalletModal()

  return (
    <div className="bg-neutral-800 rounded-xl p-12">
      <div className="text-white flex items-center justify-center flex-col p-16 border border-neutral-700 border-dashed rounded-lg">
        <div className="w-48">
          <Image src={sentry} alt="Gray Sentry facing right"  />
          <div className="-mt-2 h-[1px] bg-gradient-to-r from-neutral-800 via-neutral-500 to-neutral-800" />
        </div>
        <div className="text-center w-1/2 py-4">
          <h2 className="text-xl ">Connect Your Solana Wallet</h2>
          <p className="text-neutral-500">Unlock The Lode yada yada stake your Sentries by yada yada</p>
        </div>
        <Button as="button" variant="primary" onClick={() => walletModal.setVisible(true)}>Select Wallet</Button>
      </div>
    </div>
  )
}
