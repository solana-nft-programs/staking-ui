import { Banner } from 'common/Banner'
import { FooterSlim } from 'common/FooterSlim'
import { useAllStakePools } from 'hooks/useAllStakePools'
import Head from 'next/head'

import { CollectionsView } from './CollectionsView'
import { MainHero } from './MainHero'

function Homepage() {
  const allStakePools = useAllStakePools()

  return (
    <div className="bg-dark-5">
      <Head>
        <title>Cardinal Staking UI</title>
        <meta name="description" content="Cardinal Staking UI" />
        <link rel="icon" href={'/favicon.ico'} />
        <script
          defer
          data-domain="stake.cardinal.so"
          src="https://plausible.io/js/plausible.js"
        ></script>
      </Head>

      <Banner />
      <MainHero />
      <div className="mx-auto flex flex-col gap-16 px-8 md:px-16">
        <CollectionsView
          configs={allStakePools.data?.stakePoolsWithMetadata.filter(
            (pool) => !pool.stakePoolMetadata?.hidden
          )}
        />
        <CollectionsView
          configs={allStakePools.data?.stakePoolsWithoutMetadata}
        />
      </div>
      <FooterSlim />
    </div>
  )
}

export default Homepage
