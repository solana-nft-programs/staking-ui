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
import Link from 'next/link'

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
    <div className="flex h-20 justify-between text-white">
      <div className="my-auto text-xl font-semibold">Cardinal Staking UI</div>
      <div className="relative my-auto flex pr-8 align-middle">
        <Link href="/">
          <p className="my-auto mr-10 hover:cursor-pointer">Stake</p>
        </Link>
        <Link href="/admin">
          <p className="my-auto mr-10 hover:cursor-pointer">Admin</p>
        </Link>
        {wallet.connected ? (
          <div className="flex cursor-pointer" onClick={() => setVisible(true)}>
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
                    marginRight: '5px',
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
