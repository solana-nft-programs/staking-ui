import { HeaderSlim } from 'common/HeaderSlim'
import Head from 'next/head'

import { StakePoolCreationFlow } from '@/components/stake-pool-creation/StakePoolCreationFlow'

const AdminCreatePage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Head>
        <title>Cardinal NFT Staking</title>
        <meta name="title" content="Create your Stake Pool" />
        <meta
          name="description"
          content="Use our simple admin form to launch staking for your NFT collection today!"
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
        <StakePoolCreationFlow />
      </div>
    </div>
  )
}

export default AdminCreatePage
