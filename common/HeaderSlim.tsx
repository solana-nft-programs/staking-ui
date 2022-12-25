import { AccountConnect } from '@cardinal/namespaces-components'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { GlyphWallet } from 'assets/GlyphWallet'
import { LogoTitled } from 'assets/LogoTitled'
import { useRouter } from 'next/router'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useEffect, useState } from 'react'

import { Airdrop } from './Airdrop'
import { ButtonSmall } from './ButtonSmall'
import { withCluster } from './utils'
import { asWallet } from './Wallets'

export const HeaderSlim = () => {
  const router = useRouter()
  const wallet = useWallet()
  const walletModal = useWalletModal()
  const { secondaryConnection, environment } = useEnvironmentCtx()
  const [tab, setTab] = useState<string>('browse')

  useEffect(() => {
    const anchor = router.asPath.split('#')[1]
    if (anchor !== tab) setTab(anchor || 'browse')
  }, [router.asPath, tab])

  return (
    <div className="w-full px-4 py-4">
      <div className="flex min-h-[72px] flex-wrap items-center justify-center gap-4 rounded-xl bg-white bg-opacity-5 py-4 px-8 md:justify-between">
        <div className="flex items-center gap-5">
          <div
            className="flex cursor-pointer items-center transition-opacity hover:opacity-60"
            onClick={() => {
              router.push(`/${location.search}`)
            }}
          >
            <LogoTitled className="inline-block h-6" />
          </div>
          {environment.label !== 'mainnet-beta' && (
            <div className="text-primary">{environment.label}</div>
          )}
          {environment.label !== 'mainnet-beta' && <Airdrop />}
        </div>
        <div className="flex-5 flex items-center justify-end gap-6">
          <div
            className="cursor-pointer text-gray-400 transition hover:text-light-0"
            onClick={() => {
              router.push(withCluster('/admin', environment.label))
            }}
          >
            Admin
          </div>
          {wallet.connected && wallet.publicKey ? (
            <AccountConnect
              dark={true}
              connection={secondaryConnection}
              environment={environment.label}
              handleDisconnect={() => wallet.disconnect()}
              wallet={asWallet(wallet)}
            />
          ) : (
            <ButtonSmall
              className="text-xs"
              onClick={() => walletModal.setVisible(true)}
            >
              <>
                <GlyphWallet />
                <>Connect wallet</>
              </>
            </ButtonSmall>
          )}
        </div>
      </div>
    </div>
  )
}
