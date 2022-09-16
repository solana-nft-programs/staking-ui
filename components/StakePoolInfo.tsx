import { RewardDistributorKind } from '@cardinal/staking/dist/cjs/programs/rewardDistributor'
import * as splToken from '@solana/spl-token'
import {
  formatAmountAsDecimal,
  formatMintNaturalAmountAsDecimal,
} from 'common/units'
import { pubKeyUrl } from 'common/utils'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { useRewardDistributorTokenAccount } from 'hooks/useRewardDistributorTokenAccount'
import { useRewardMintInfo } from 'hooks/useRewardMintInfo'
import { useRewards } from 'hooks/useRewards'
import { useRewardsRate } from 'hooks/useRewardsRate'
import { useStakePoolData } from 'hooks/useStakePoolData'
import { useStakePoolEntries } from 'hooks/useStakePoolEntries'
import { useStakePoolMaxStaked } from 'hooks/useStakePoolMaxStaked'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useEffect, useState } from 'react'

export const StakePoolInfo = () => {
  const { connection, environment } = useEnvironmentCtx()
  const rewardDistributorData = useRewardDistributorData()
  const rewardMintInfo = useRewardMintInfo()
  const stakePoolEntries = useStakePoolEntries()
  const maxStaked = useStakePoolMaxStaked()
  const rewards = useRewards()
  const rewardsRate = useRewardsRate()
  const { isFetched: stakePoolLoaded } = useStakePoolData()
  const { data: stakePoolMetadata } = useStakePoolMetadata()
  const rewardDistributorTokenAccountData = useRewardDistributorTokenAccount()

  const [totalStaked, setTotalStaked] = useState('')

  const totalStakedTokens = async () => {
    let total = 0
    if (!stakePoolEntries.data) {
      setTotalStaked('0')
      return
    }
    const mintToDecimals: { mint: string; decimals: number }[] = []
    for (const entry of stakePoolEntries.data) {
      try {
        if (entry.parsed.amount.toNumber() > 1) {
          let decimals = 0
          const match = mintToDecimals.find(
            (m) => m.mint === entry.parsed.originalMint.toString()
          )
          if (match) {
            decimals = match.decimals
          } else {
            const mint = new splToken.Token(
              connection,
              entry.parsed.originalMint,
              splToken.TOKEN_PROGRAM_ID,
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              null
            )
            const mintInfo = await mint.getMintInfo()
            decimals = mintInfo.decimals
            mintToDecimals.push({
              mint: entry.parsed.originalMint.toString(),
              decimals: decimals,
            })
          }
          total += entry.parsed.amount.toNumber() / 10 ** decimals
        } else {
          total += 1
        }
      } catch (e) {
        console.log('Error calculating total staked tokens', e)
      }
    }
    setTotalStaked(Math.ceil(total).toString())
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const fetchData = async () => {
      await totalStakedTokens()
    }
    fetchData().catch(console.error)
  }, [stakePoolEntries.isFetched])

  if (
    !stakePoolLoaded ||
    stakePoolMetadata?.notFound ||
    (!rewardDistributorData && !maxStaked)
  ) {
    return <></>
  }

  return (
    <div
      className={`mx-5 mb-4 flex flex-wrap items-center gap-4 rounded-md px-10 py-6 md:flex-row md:justify-between ${
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
      {stakePoolEntries.data ? (
        <>
          <div className="inline-block text-lg">
            Total Staked: {Number(totalStaked).toLocaleString()}{' '}
            {stakePoolMetadata?.maxStaked
              ? `/ ${stakePoolMetadata?.maxStaked.toLocaleString()}`
              : ''}
          </div>
          {maxStaked > 0 && (
            <div className="inline-block text-lg">
              {/*TODO: Change how many total NFTs can possibly be staked for your collection (default 10000) */}
              Percent Staked:{' '}
              {stakePoolEntries.data?.length &&
                Math.floor(
                  ((stakePoolEntries.data?.length * 100) / maxStaked) * 10000
                ) / 10000}
              %
            </div>
          )}
        </>
      ) : (
        <div className="relative flex h-8 flex-grow items-center justify-center">
          <span
            className={`${
              stakePoolMetadata?.colors?.fontColor
                ? `text-[${stakePoolMetadata?.colors?.fontColor}]`
                : 'text-gray-500'
            }`}
          >
            Loading pool info...
          </span>
          <div className="absolute w-full animate-pulse items-center justify-center rounded-lg bg-white bg-opacity-10 p-5"></div>
        </div>
      )}
      {rewardDistributorData.data && rewardsRate.data && rewardMintInfo.data ? (
        <>
          <div className="inline-block text-lg">
            <span>Rewards Rate</span>:{' '}
            <span>
              {formatAmountAsDecimal(
                rewardMintInfo.data.mintInfo.decimals,
                rewardsRate.data.dailyRewards,
                // max of 5 decimals
                Math.min(rewardMintInfo.data.mintInfo.decimals, 5)
              )}{' '}
              <a
                className="underline"
                style={{
                  color: stakePoolMetadata?.colors?.fontColor
                    ? stakePoolMetadata?.colors?.fontColor
                    : 'white',
                }}
                target="_blank"
                href={pubKeyUrl(
                  rewardDistributorData.data.parsed.rewardMint,
                  environment.label
                )}
                rel="noreferrer"
              >
                {rewardMintInfo.data.tokenListData?.symbol ||
                  rewardMintInfo.data.metaplexMintData?.data.symbol ||
                  '???'}
              </a>{' '}
              / Day
            </span>
          </div>
          <div className="flex min-w-[200px] flex-col text-lg">
            {!rewardMintInfo.isFetched || !rewards.data ? (
              <div className="relative flex h-10 w-full items-center justify-center">
                <span className="text-gray-500"></span>
                <div className="absolute w-full animate-pulse items-center justify-center rounded-lg bg-white bg-opacity-10 p-5"></div>
              </div>
            ) : (
              rewards.data && (
                <>
                  <div>
                    Earnings:{' '}
                    {formatMintNaturalAmountAsDecimal(
                      rewardMintInfo.data.mintInfo,
                      rewards.data?.claimableRewards,
                      Math.min(rewardMintInfo.data.mintInfo.decimals, 6)
                    )}{' '}
                    {rewardMintInfo.data.tokenListData?.name ||
                      rewardMintInfo.data.metaplexMintData?.data.name ||
                      '???'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {rewardDistributorData.data.parsed.kind ===
                    RewardDistributorKind.Mint
                      ? formatMintNaturalAmountAsDecimal(
                          rewardMintInfo.data.mintInfo,
                          rewardMintInfo.data.mintInfo.supply,
                          Math.min(rewardMintInfo.data.mintInfo.decimals, 6)
                        )
                      : rewardDistributorTokenAccountData.data
                      ? formatMintNaturalAmountAsDecimal(
                          rewardMintInfo.data.mintInfo,
                          rewardDistributorTokenAccountData.data?.amount,
                          Math.min(rewardMintInfo.data.mintInfo.decimals, 6)
                        )
                      : '??'}{' '}
                    Left In Treasury
                  </div>
                </>
              )
            )}
          </div>
        </>
      ) : (
        <div className="relative flex flex-grow items-center justify-center">
          {!(rewardDistributorData.isFetched && rewardMintInfo.isFetched) && (
            <>
              <span
                className={`${
                  stakePoolMetadata?.colors?.fontColor
                    ? `text-[${stakePoolMetadata?.colors?.fontColor}]`
                    : 'text-gray-500'
                }`}
              >
                Loading rewards...
              </span>
              <div className="absolute w-full animate-pulse items-center justify-center rounded-lg bg-white bg-opacity-10 p-5"></div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
