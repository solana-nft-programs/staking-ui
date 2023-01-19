import { PlusIcon } from '@heroicons/react/24/solid'
import { FooterSlim } from 'common/FooterSlim'
import { HeaderSlim } from 'common/HeaderSlim'
import { withCluster } from 'common/utils'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'

import { ButtonPrimary } from '@/components/UI/buttons/ButtonPrimary'
import { HeadingSecondary } from '@/components/UI/typography/HeadingSecondary'
import { ButtonWidths } from '@/types/index'

import { AdminPools } from './AdminPools'

function Admin() {
  const router = useRouter()
  const { environment } = useEnvironmentCtx()

  return (
    <div className="flex min-h-screen flex-col">
      <Head>
        <title>Cardinal NFT Staking</title>
        <meta name="title" content="NFT Staking on Solana" />
        <meta
          name="description"
          content="Launch staking for your NFT collection on Solana with reward distribution"
        />
        <meta name="image" content="https://stake.cardinal.so/preview.png" />
        <link rel="icon" href="/favicon.ico" />
        <script
          defer
          data-domain="stake.cardinal.so"
          src="https://plausible.io/js/plausible.js"
        ></script>
      </Head>

      <HeaderSlim />
      <div className="container mx-auto w-full flex-grow px-6">
        <div className="mt-8 flex items-center justify-between">
          <HeadingSecondary>Your Stake Pools</HeadingSecondary>
          <ButtonPrimary
            width={ButtonWidths.NARROW}
            onClick={() =>
              router.push(withCluster(`/admin/create`, environment.label))
            }
          >
            Add
            <PlusIcon className="ml-2 h-5 w-5" />
          </ButtonPrimary>
        </div>
        <AdminPools />
      </div>
      <FooterSlim />
    </div>
  )
}

export default Admin
