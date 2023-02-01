import './styles.css'
import '@cardinal/namespaces-components/dist/esm/styles.css'
import 'tailwindcss/tailwind.css'

import { WalletIdentityProvider } from '@cardinal/namespaces-components'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import {
  BackpackWalletAdapter,
  BraveWalletAdapter,
  CoinbaseWalletAdapter,
  FractalWalletAdapter,
  GlowWalletAdapter,
  LedgerWalletAdapter,
  MathWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { ToastContainer } from 'common/Notification'
import type { AppProps } from 'next/app'
import {
  EnvironmentProvider,
  getInitialProps,
} from 'providers/EnvironmentProvider'
import { UTCNowProvider } from 'providers/UTCNowProvider'
import { useMemo } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

require('@solana/wallet-adapter-react-ui/styles.css')

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: false,
    },
  },
})

const App = ({
  Component,
  pageProps,
  cluster,
}: AppProps & {
  cluster: string
}) => {
  const network = useMemo(() => {
    switch (cluster) {
      case 'mainnet':
        return WalletAdapterNetwork.Mainnet
      case 'devnet':
        return WalletAdapterNetwork.Devnet
      case 'testnet':
        return WalletAdapterNetwork.Testnet
      default:
        return WalletAdapterNetwork.Mainnet
    }
  }, [cluster])

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new BackpackWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new CoinbaseWalletAdapter(),
      new BraveWalletAdapter(),
      new SlopeWalletAdapter(),
      new FractalWalletAdapter(),
      new GlowWalletAdapter({ network }),
      new LedgerWalletAdapter(),
      new MathWalletAdapter(),
      new TorusWalletAdapter({ params: { network, showTorusButton: false } }),
    ],
    [network]
  )
  return (
    <EnvironmentProvider defaultCluster={cluster}>
      <UTCNowProvider>
        <WalletProvider autoConnect wallets={wallets}>
          <WalletIdentityProvider>
            <WalletModalProvider>
              <QueryClientProvider client={queryClient}>
                <>
                  <ToastContainer />
                  <Component {...pageProps} />
                  <ReactQueryDevtools initialIsOpen={false} />
                </>
              </QueryClientProvider>
            </WalletModalProvider>
          </WalletIdentityProvider>
        </WalletProvider>
      </UTCNowProvider>
    </EnvironmentProvider>
  )
}

App.getInitialProps = getInitialProps

export default App
