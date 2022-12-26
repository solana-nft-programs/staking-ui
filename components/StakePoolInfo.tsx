import { RewardDistributorKind } from '@cardinal/staking/dist/cjs/programs/rewardDistributor'
import { BN } from '@project-serum/anchor'
import {
  formatAmountAsDecimal,
  formatMintNaturalAmountAsDecimal,
} from 'common/units'
import { pubKeyUrl } from 'common/utils'
import {
  isRewardDistributorV2,
  useRewardDistributorData,
} from 'hooks/useRewardDistributorData'
import { useRewardDistributorTokenAccount } from 'hooks/useRewardDistributorTokenAccount'
import { useRewardMintInfo } from 'hooks/useRewardMintInfo'
import { useRewards } from 'hooks/useRewards'
import { useRewardsRate } from 'hooks/useRewardsRate'
import { useStakePoolData } from 'hooks/useStakePoolData'
import { useStakePoolEntries } from 'hooks/useStakePoolEntries'
import { useStakePoolMaxStaked } from 'hooks/useStakePoolMaxStaked'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'
import { useStakePoolTotalStaked } from 'hooks/useStakePoolTotalStaked'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'

export const StakePoolInfo = () => {
  const { environment } = useEnvironmentCtx()
  const rewardDistributorData = useRewardDistributorData()
  const rewardMintInfo = useRewardMintInfo()
  const stakePoolEntries = useStakePoolEntries()
  const maxStaked = useStakePoolMaxStaked()
  const rewards = useRewards()
  const totalStaked = useStakePoolTotalStaked()
  const rewardsRate = useRewardsRate()
  const { isFetched: stakePoolLoaded } = useStakePoolData()
  const { data: stakePoolMetadata } = useStakePoolMetadata()
  const rewardDistributorTokenAccountData = useRewardDistributorTokenAccount()

  if (
    !stakePoolLoaded ||
    stakePoolMetadata?.notFound ||
    (!rewardDistributorData && !maxStaked)
  ) {
    return <></>
  }

  return (
    <div
      className={`flex flex-wrap items-center gap-4 rounded-md px-10 py-6 md:flex-row md:justify-between ${
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
            Total Staked: {totalStaked.data?.toLocaleString()}{' '}
            {stakePoolMetadata?.maxStaked
              ? `/ ${stakePoolMetadata?.maxStaked.toLocaleString()}`
              : ''}
          </div>
          {!!maxStaked && (
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
        <div className="relative flex h-8 max-w-[50%] flex-grow items-center justify-center">
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
            <span>
              {rewardDistributorData.data.parsed?.maxRewardSecondsReceived?.eq(
                new BN(1)
              )
                ? '1x Claim'
                : 'Rewards Rate'}
            </span>
            :{' '}
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
                  rewardDistributorData.data.parsed?.rewardMint,
                  environment.label
                )}
                rel="noreferrer"
              >
                {rewardMintInfo.data.tokenListData?.symbol ||
                  rewardMintInfo.data.metaplexMintData?.data.symbol ||
                  '???'}
              </a>{' '}
              {rewardDistributorData.data.parsed?.maxRewardSecondsReceived?.eq(
                new BN(1)
              )
                ? ''
                : '/ Day'}
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
                    {rewardDistributorData.data.parsed?.kind ===
                      RewardDistributorKind.Mint &&
                    !isRewardDistributorV2(rewardDistributorData.data.parsed)
                      ? formatMintNaturalAmountAsDecimal(
                          rewardMintInfo.data.mintInfo,
                          new BN(
                            rewardMintInfo.data.mintInfo.supply.toString()
                          ),
                          Math.min(rewardMintInfo.data.mintInfo.decimals, 6)
                        )
                      : rewardDistributorTokenAccountData.data
                      ? formatMintNaturalAmountAsDecimal(
                          rewardMintInfo.data.mintInfo,
                          new BN(
                            rewardDistributorTokenAccountData.data.amount.toString()
                          ),
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
        <div className="relative flex max-w-[50%] flex-grow items-center justify-center">
          {!(
            rewardDistributorData.isFetched &&
            rewardMintInfo.isFetched &&
            rewardsRate.isFetched
          ) && (
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
