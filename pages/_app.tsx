import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { WalletProvider } from '@solana/wallet-adapter-react'
import { getWalletAdapters } from '@solana/wallet-adapter-wallets'
import { WalletDisconnectButton, WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { EnvironmentProvider } from 'providers/EnvironmentProvider'
import { WalletIdentityProvider } from '@cardinal/namespaces-components'

require('@solana/wallet-adapter-react-ui/styles.css')

const App = ({ Component, pageProps }: AppProps) => (
  <EnvironmentProvider>
    <WalletProvider wallets={getWalletAdapters()}>
      <WalletIdentityProvider>
        <WalletModalProvider>          
          <Component {...pageProps} />
        </WalletModalProvider>
      </WalletIdentityProvider>
    </WalletProvider>
  </EnvironmentProvider>
)

export default App
