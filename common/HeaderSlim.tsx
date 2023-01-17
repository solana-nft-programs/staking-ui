import { ButtonPrimary } from '@/components/UI/buttons/ButtonPrimary'
import ButtonSecondary from '@/components/UI/buttons/ButtonSecondary'
import { ButtonColors } from '@/types/colors'
import { AccountConnect } from '@cardinal/namespaces-components'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { GlyphWallet } from 'assets/GlyphWallet'
import { LogoTitled } from 'assets/LogoTitled'
import { useModal } from 'hooks/useModal'
import { useRouter } from 'next/router'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useEffect, useState } from 'react'

import { Airdrop } from './Airdrop'
import { ButtonSmall } from './ButtonSmall'
import { withCluster } from './utils'
import { asWallet } from './Wallets'

const { ORANGE } = ButtonColors

export const HeaderSlim = () => {
  const router = useRouter()
  const wallet = useWallet()
  const walletModal = useWalletModal()
  const { secondaryConnection, environment } = useEnvironmentCtx()
  const [tab, setTab] = useState<string>('browse')
  const { showModal, onDismiss } = useModal()

  useEffect(() => {
    const anchor = router.asPath.split('#')[1]
    if (anchor !== tab) setTab(anchor || 'browse')
  }, [router.asPath, tab])

  const showConnectWalletModal = () => {
    showModal(
      <div className="space-y-8 rounded-xl bg-gray-900 p-12 shadow-2xl">
        <div className="flex w-full items-center justify-center py-6">
          <img
            className={`max-h-28 rounded-xl fill-red-600`}
            src={'/cardinal-crosshair.svg'}
            alt="Cardinal logo"
          />
        </div>
        <div className="p-2 text-xl leading-8">
          By connecting your wallet and using Cardinal services, you agree to
          our{' '}
          <a href="/terms" className="text-orange-500 underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-orange-500 underline">
            Privacy Policy
          </a>
          .
        </div>
        <div className="-mx-1 flex w-full justify-around space-x-4">
          <ButtonSecondary onClick={onDismiss} color={ORANGE}>
            Cancel
          </ButtonSecondary>
          <ButtonPrimary
            onClick={() => {
              onDismiss()
              setTimeout(() => {
                walletModal.setVisible(true)
              })
            }}
          >
            Accept
          </ButtonPrimary>
        </div>
      </div>
    )
  }

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
              onClick={() => showConnectWalletModal()}
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
