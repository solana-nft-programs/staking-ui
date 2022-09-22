import Head from 'next/head'
import { contrastColorMode } from 'common/utils'

import { useTokenCheck } from 'hooks/useTokenCheck'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'

import { defaultSecondaryColor, TokenStandard } from 'api/mapping'
import { lighten, darken } from '@mui/material'
import { Footer } from 'common/Footer'

function Check() {
  const tokenData = useTokenCheck()
  const { data: stakePoolMetadata } = useStakePoolMetadata()

  const description = 'Stake your Sentry NFT to start earning rewards.'
  const title = 'Sentries NFT Staking'
  const keyword = 'Sentries NFTs, Sentries Validators, NFTs'
  const url = 'https://sentries.io'
  const image = 'https://sentries.io/images/og_stake_image.png'

  return (
    <div
      style={{
        background: stakePoolMetadata?.colors?.primary,
        backgroundImage: `url(${stakePoolMetadata?.backgroundImage})`,
      }}
    >
      <Head>
        <title>Sentries NFT Staking</title>
        <meta
          name="description"
          content="Stake your Sentry NFT increase your Power."
        />
        <link rel="icon" href="/favicon.png" />
        <meta property="og:type" content="website" />
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta name="description" content={description} />
        <meta name="keywords" content={keyword} />
        <meta property="og:url" content={url} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
      </Head>
      <div
        className={`container mx-auto w-full`}
        style={{
          ...stakePoolMetadata?.styles,
          color:
            stakePoolMetadata?.colors?.fontColor ??
            contrastColorMode(
              stakePoolMetadata?.colors?.primary || '#000000'
            )[0],
        }}
      >
        <div className="description-content mx-5 mb-4 py-6 px-10">
          <h2>Sentries Staking Check</h2>
        </div>
        {
          // @ts-ignore
          tokenData.data &&
          Object.keys(tokenData.data).length > 0 &&
          // @ts-ignore
          !Object.keys(tokenData.data).includes('error') ? (
            <div>
              <div
                className={`mx-5 mb-4 flex flex-wrap items-center gap-4 rounded-md px-10 py-6  md:flex-row md:justify-between ${
                  stakePoolMetadata?.colors?.fontColor
                    ? `text-[${stakePoolMetadata?.colors?.fontColor}]`
                    : 'text-gray-200'
                } ${
                  stakePoolMetadata?.colors?.backgroundSecondary
                    ? `bg-[${stakePoolMetadata?.colors?.backgroundSecondary}]`
                    : 'bg-white bg-opacity-5'
                }`}
                style={{
                  background: stakePoolMetadata?.colors?.backgroundSecondary,
                  border: stakePoolMetadata?.colors?.accent
                    ? `2px solid ${stakePoolMetadata?.colors?.accent}`
                    : '',
                }}
              >
                <pre>{JSON.stringify(tokenData.data, null, 2)}</pre>
              </div>
              {
                // @ts-ignore
                Object.keys(tokenData.data.info).includes('delegate') ? (
                  <div
                    className="mx-5 mb-5 rounded-md border-[1px] bg-opacity-40 p-4 text-center text-lg font-semibold"
                    style={{
                      background:
                        stakePoolMetadata?.colors?.accent ||
                        defaultSecondaryColor,
                      color: stakePoolMetadata?.colors?.fontColor,
                      borderColor: lighten(
                        stakePoolMetadata?.colors?.accent ||
                          defaultSecondaryColor,
                        0.5
                      ),
                    }}
                  >
                    <h2>NFT IS STAKED</h2>
                  </div>
                ) : (
                  <div
                    className="mx-5 mb-5 rounded-md border-[1px] bg-opacity-40 p-4 text-center text-lg font-semibold"
                    style={{
                      background:
                        stakePoolMetadata?.colors?.secondary ||
                        defaultSecondaryColor,
                      color: stakePoolMetadata?.colors?.fontColor,
                      borderColor: lighten(
                        stakePoolMetadata?.colors?.secondary ||
                          defaultSecondaryColor,
                        0.5
                      ),
                    }}
                  >
                    <h2>NFT IS NOT STAKED</h2>
                  </div>
                )
              }
            </div>
          ) : !tokenData.isFetched ? (
            // @ts-ignore
            <div>Fetching token data</div>
          ) : (
            <div>Unable to Locate Token</div>
          )
        }
      </div>
    </div>
  )
}

export default Check
