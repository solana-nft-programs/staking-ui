import { css } from '@emotion/react'
import { Banner } from 'common/Banner'
import { Card } from 'common/Card'
import { FooterSlim } from 'common/FooterSlim'
import { pubKeyUrl, shortPubKey } from 'common/utils'
import { useAllStakePools } from 'hooks/useAllStakePools'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { transparentize } from 'polished'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { FaQuestion } from 'react-icons/fa'

import { MainHero } from './MainHero'

export function Placeholder() {
  return (
    <div className="h-[300px] animate-pulse rounded-lg bg-white bg-opacity-5 p-10"></div>
  )
}

function Homepage() {
  const { environment } = useEnvironmentCtx()
  const allStakePools = useAllStakePools()
  const router = useRouter()

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
        <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
          {!allStakePools.isFetched ? (
            <>
              <Card skeleton header={<></>} />
              <Card skeleton header={<></>} />
              <Card skeleton header={<></>} />
              <Card skeleton header={<></>} />
              <Card skeleton header={<></>} />
              <Card skeleton header={<></>} />
            </>
          ) : allStakePools.data &&
            allStakePools.data?.stakePoolsWithMetadata.length > 0 ? (
            allStakePools.data?.stakePoolsWithMetadata.map(
              (stakePool) =>
                !stakePool.stakePoolMetadata?.hidden && (
                  <Card
                    key={stakePool.stakePoolMetadata?.displayName}
                    className="cursor-pointer transition-colors"
                    css={css`
                      &:hover {
                        background: ${stakePool.stakePoolMetadata?.colors
                          ?.primary &&
                        transparentize(
                          0.8,
                          stakePool.stakePoolMetadata?.colors?.primary
                        )};
                      }
                    `}
                    onClick={() =>
                      router.push(
                        stakePool.stakePoolMetadata?.redirect ??
                          `/${
                            stakePool.stakePoolMetadata?.name ||
                            stakePool.stakePoolData.pubkey.toString()
                          }${
                            environment.label !== 'mainnet-beta'
                              ? `?cluster=${environment.label}`
                              : ''
                          }`
                      )
                    }
                    hero={
                      <div
                        className={`flex h-full w-full items-center justify-center`}
                      >
                        <img
                          className={`max-h-full rounded-xl`}
                          src={stakePool.stakePoolMetadata?.imageUrl}
                          alt={stakePool.stakePoolMetadata?.name}
                        />
                      </div>
                    }
                    header={
                      <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                        {stakePool.stakePoolMetadata?.displayName}
                      </div>
                    }
                  />
                )
            )
          ) : (
            'No pools found...'
          )}
        </div>
        {allStakePools.data &&
          allStakePools.data.stakePoolsWithoutMetadata.length > 0 && (
            <>
              <div className="mt-10 mb-5 text-lg font-bold">
                Unrecognized Pools
              </div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
                {allStakePools.data.stakePoolsWithoutMetadata.map(
                  (stakePool) => (
                    <Card
                      key={stakePool.stakePoolMetadata?.displayName}
                      className="cursor-pointer transition-colors"
                      onClick={() =>
                        router.push(
                          `/${
                            stakePool.stakePoolMetadata?.name ||
                            stakePool.stakePoolData.pubkey.toString()
                          }${
                            environment.label !== 'mainnet-beta'
                              ? `?cluster=${environment.label}`
                              : ''
                          }`
                        )
                      }
                      hero={
                        <div className="flex h-full flex-grow items-center justify-center">
                          <div className="flex h-[150px] w-[150px] items-center justify-center rounded-full bg-white bg-opacity-5 text-5xl text-white text-opacity-40">
                            {/* {shortPubKey(stakePool.stakePoolData.pubkey)} */}
                            <FaQuestion />
                          </div>
                        </div>
                      }
                      header={
                        <div className="text-white">
                          <a
                            className="text-white"
                            target="_blank"
                            rel="noreferrer"
                            href={pubKeyUrl(
                              stakePool.stakePoolData.pubkey,
                              environment.label
                            )}
                          >
                            {shortPubKey(stakePool.stakePoolData.pubkey)}
                          </a>
                        </div>
                      }
                    />
                  )
                )}
              </div>
            </>
          )}
      </div>
      <FooterSlim />
    </div>
  )
}

export default Homepage
