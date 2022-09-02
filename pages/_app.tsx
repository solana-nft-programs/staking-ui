import '@cardinal/namespaces-components/dist/esm/styles.css'
import './styles.css'
import 'antd/dist/antd.dark.css'

import { WalletIdentityProvider } from '@cardinal/namespaces-components'
import { WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { getWalletAdapters } from '@solana/wallet-adapter-wallets'
import type { AppProps } from 'next/app'
import {
  EnvironmentProvider,
  getInitialProps,
} from 'providers/EnvironmentProvider'
import { UTCNowProvider } from 'providers/UTCNowProvider'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

require('@solana/wallet-adapter-react-ui/styles.css')

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

const App = ({
  Component,
  pageProps,
  cluster,
}: AppProps & { cluster: string }) => (
  <EnvironmentProvider defaultCluster={cluster}>
    <UTCNowProvider>
      <WalletProvider autoConnect wallets={getWalletAdapters()}>
        <WalletIdentityProvider>
          <WalletModalProvider>
            <QueryClientProvider client={queryClient}>
              <>
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

App.getInitialProps = getInitialProps

export default App
