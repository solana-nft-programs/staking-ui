import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Link from 'next/link'

import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { Airdrop } from './Airdrop'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'
import { AccountConnect } from '@cardinal/namespaces-components'
import { Wallet } from '@saberhq/solana-contrib'
import { useStakePoolId } from 'hooks/useStakePoolId'
import { useUTCNow } from 'providers/UTCNowProvider'
import { contrastColorMode } from './utils'
import { Logo } from '../components/Logo'

// Dialect
import * as anchor from '@project-serum/anchor'
import { useState, useEffect, useMemo } from 'react'
import { WalletContextState } from '@solana/wallet-adapter-react'

const DIALECT_PUBLIC_KEY = new anchor.web3.PublicKey(
  '2ZzCZYLqCKoTgC8UVcdS1ehUWx55i4CAVaCXrfNYg6c7'
)

import {
  Backend,
  Config,
  DialectContextProvider,
  DialectThemeProvider,
  DialectUiManagementProvider,
  DialectWalletAdapter,
  NotificationsButton,
} from '@dialectlabs/react-ui'
import { EnvironmentType } from 'types/environment'
import { ClockdriftWarning } from 'components/ClockdriftWarning'
import EpochProgress from 'features/EpochProgress'

const walletToDialectWallet = (
  wallet: WalletContextState
): DialectWalletAdapter => ({
  publicKey: wallet.publicKey!,
  connected:
    wallet.connected &&
    !wallet.connecting &&
    !wallet.disconnecting &&
    Boolean(wallet.publicKey),
  signMessage: wallet.signMessage,
  signTransaction: wallet.signTransaction,
  signAllTransactions: wallet.signAllTransactions,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  diffieHellman: wallet.wallet?.adapter?._wallet?.diffieHellman
    ? async (pubKey) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        return wallet.wallet?.adapter?._wallet?.diffieHellman(pubKey)
      }
    : undefined,
})

export const Header = () => {
  const ctx = useEnvironmentCtx()
  const wallet = useWallet()
  const stakePoolId = useStakePoolId()
  const { data: stakePoolMetadata } = useStakePoolMetadata()
  const { clockDrift } = useUTCNow()

  const [dialectWalletAdapter, setDialectWalletAdapter] =
    useState<DialectWalletAdapter>(() => walletToDialectWallet(wallet))

  useEffect(() => {
    setDialectWalletAdapter(walletToDialectWallet(wallet))
  }, [wallet])

  const dialectConfig = useMemo(
    (): Config => ({
      backends: [Backend.DialectCloud],
      environment: 'production',
      dialectCloud: {
        tokenStore: 'local-storage',
      },
    }),
    []
  )

  const envLabel = ctx.environment.label
  const isNotMainnetBeta = envLabel !== EnvironmentType.MainnetBeta

  return (
    <>
      {clockDrift && <ClockdriftWarning clockDrift={clockDrift} />}
      <nav className="container relative mx-auto rounded-xl bg-neutral-900 bg-opacity-70">
        <div className="flex h-20 justify-between px-5 text-white">
          <div className="flex items-center gap-3">
            <Logo />
            {isNotMainnetBeta ? (
              <div className="flex items-center gap-2 text-white">
                <i className="-top-1 h-3 w-3 animate-pulse rounded-full bg-purple-400"></i>
                <span>{envLabel}</span>
              </div>
            ) : null}
            {isNotMainnetBeta ? <Airdrop /> : null}
          </div>
          <div className="w-1/3 flex items-center">
            <EpochProgress />
          </div>
          <div className="relative my-auto flex items-center align-middle">
            {stakePoolId && stakePoolMetadata ? (
              stakePoolMetadata.links?.map((link) => (
                <a key={link.value} href={link.value}>
                  <p className="my-auto mr-10 hover:cursor-pointer">
                    {link.text}
                  </p>
                </a>
              ))
            ) : (
              <Link
                href={`/admin${isNotMainnetBeta ? `?cluster=${envLabel}` : ''}`}
              >
                <span className="my-auto mr-10 hover:cursor-pointer">
                  Admin
                </span>
              </Link>
            )}
            {wallet.connected && wallet.publicKey ? (
              <>
                <AccountConnect
                  dark={
                    stakePoolMetadata?.colors?.backgroundSecondary
                      ? contrastColorMode(stakePoolMetadata?.colors?.primary)[1]
                      : true
                  }
                  connection={ctx.secondaryConnection}
                  environment={envLabel}
                  handleDisconnect={() => wallet.disconnect()}
                  wallet={wallet as Wallet}
                  style={{
                    background: '#262626',
                  }}
                />
                <DialectContextProvider
                  wallet={dialectWalletAdapter}
                  config={dialectConfig}
                  dapp={DIALECT_PUBLIC_KEY}
                  gate={() =>
                    new Promise((resolve) =>
                      setTimeout(() => resolve(true), 3000)
                    )
                  }
                >
                  <DialectThemeProvider>
                    <DialectUiManagementProvider>
                      <NotificationsButton
                        dialectId="dialect-notifications"
                        notifications={[]}
                        pollingInterval={15000}
                        channels={['web3']}
                      />
                    </DialectUiManagementProvider>
                  </DialectThemeProvider>
                </DialectContextProvider>
              </>
            ) : null}
          </div>
        </div>
      </nav>
    </>
  )
}
