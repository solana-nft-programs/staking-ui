import { useWallet } from '@solana/wallet-adapter-react'
import {
  useWalletModal,
  WalletDisconnectButton,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui'
import { AddressImage, DisplayAddress } from '@cardinal/namespaces-components'

import { useRouter } from 'next/router'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useEffect, useState } from 'react'
import { shortPubKey } from './utils'
import { HiUserCircle } from 'react-icons/hi'

export const Header = () => {
  const ctx = useEnvironmentCtx()
  const wallet = useWallet()
  const { setVisible } = useWalletModal()
  const router = useRouter()
  const [tab, setTab] = useState<string>('wallet')

  useEffect(() => {
    const anchor = router.asPath.split('#')[1]
    if (anchor !== tab) setTab(anchor || 'wallet')
  }, [router.asPath, tab])

  const walletAddressFormatted = wallet?.publicKey
    ? shortPubKey(wallet?.publicKey)
    : ''

  return (
    <div className="flex h-20 flex-row-reverse text-white">
      <div className="relative flex align-middle pr-8 my-auto">       
        {wallet.connected ? (
          <div
            className="flex cursor-pointer"
            onClick={() => setVisible(true)}
          >
            <AddressImage
              connection={ctx.connection}
              address={wallet.publicKey || undefined}
              height="40px"
              width="40px"
              dark={true}              
              placeholder={
                <div
                  style={{
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    marginRight: '5px'
                  }}
                >
                  <div style={{ height: '40px', width: '40px' }}>
                    <HiUserCircle style={{ height: '100%', width: '100%' }} />
                  </div>
                </div>
              }
            />
            <div>
              <div className="text-white ">
                <DisplayAddress
                  style={{ pointerEvents: 'none' }}
                  connection={ctx.connection}
                  address={wallet.publicKey || undefined}
                  height="12px"
                  width="100px"
                  dark={true}
                />
              </div>
              <div style={{ color: 'gray' }}>{walletAddressFormatted}</div>
            </div>
          </div>
        ) : (
          <WalletMultiButton
            style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '14px',
              zIndex: 10,
              height: '38px',
              border: 'none',
              background: 'none',
              backgroundColor: 'none',              
            }}
          />
        )}
      </div>
    </div>
  )
}
