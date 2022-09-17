import './styles.css'
import '@cardinal/namespaces-components/dist/esm/styles.css'
import 'tailwindcss/tailwind.css'

import { WalletIdentityProvider } from '@cardinal/namespaces-components'
import { WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { getWalletAdapters } from '@solana/wallet-adapter-wallets'
import type { StakePoolMetadata } from 'api/mapping'
import { ToastContainer } from 'common/Notification'
import type { AppProps } from 'next/app'
import {
  EnvironmentProvider,
  getInitialProps,
} from 'providers/EnvironmentProvider'
import { StakePoolMetadataProvider } from 'providers/StakePoolMetadataProvider'
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
  poolMapping,
}: AppProps & {
  cluster: string
  poolMapping: StakePoolMetadata | undefined
}) => (
  <EnvironmentProvider defaultCluster={cluster}>
    <StakePoolMetadataProvider poolMapping={poolMapping}>
      <UTCNowProvider>
        <WalletProvider autoConnect wallets={getWalletAdapters()}>
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
    </StakePoolMetadataProvider>
  </EnvironmentProvider>
)

App.getInitialProps = getInitialProps

export default App
