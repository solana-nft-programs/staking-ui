import { BN } from '@project-serum/anchor'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { useStakePoolEntries } from 'hooks/useStakePoolEntries'
import { useStakePoolMaxStaked } from 'hooks/useStakePoolMaxStaked'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'
import { useStakePoolTotalStaked } from 'hooks/useStakePoolTotalStaked'

import { RewardsRate } from '@/components/stats/RewardsRate'
import { TreasuryBalance } from '@/components/stats/TreasuryBalance'

export const HeroStats: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
}: React.HTMLAttributes<HTMLDivElement>) => {
  const rewardDistributorData = useRewardDistributorData()
  const stakePoolEntries = useStakePoolEntries()
  const maxStaked = useStakePoolMaxStaked()
  const totalStaked = useStakePoolTotalStaked()
  const { data: stakePoolMetadata } = useStakePoolMetadata()

  return (
    <div
      className={`flex w-full flex-col flex-wrap gap-y-5 rounded-xl px-12 py-6 md:flex-row ${
        stakePoolMetadata?.colors?.fontColor ? '' : 'text-gray-200'
      } justify-evenly bg-white bg-opacity-5 ${className}`}
      style={{
        background: stakePoolMetadata?.colors?.backgroundSecondary,
        border: stakePoolMetadata?.colors?.accent
          ? `2px solid ${stakePoolMetadata?.colors?.accent}`
          : '',
      }}
    >
      <div className="flex flex-1 flex-col items-center justify-center">
        <div
          className="text-lg text-medium-4"
          style={{ color: stakePoolMetadata?.colors?.fontColorTertiary }}
        >
          Total Staked
        </div>
        {!totalStaked.isFetched ? (
          <div className="h-6 w-10 animate-pulse rounded-md bg-border"></div>
        ) : (
          <div
            className="text-center text-xl text-light-1"
            style={{ color: stakePoolMetadata?.colors?.fontColor }}
          >
            {totalStaked.data?.toLocaleString()}{' '}
            {stakePoolMetadata?.maxStaked
              ? `/ ${stakePoolMetadata?.maxStaked.toLocaleString()}`
              : ''}
          </div>
        )}
      </div>
      {maxStaked && (
        <>
          <div className="mx-6 my-auto hidden h-10 w-[1px] bg-border md:flex"></div>
          <div className="flex flex-1 flex-col items-center justify-center">
            <p
              className="text-lg text-medium-4"
              style={{ color: stakePoolMetadata?.colors?.fontColorTertiary }}
            >
              Percent Staked
            </p>
            {!stakePoolEntries.data ? (
              <div className="h-6 w-10 animate-pulse rounded-md bg-border"></div>
            ) : (
              <div
                className="text-center text-xl text-light-1"
                style={{ color: stakePoolMetadata?.colors?.fontColor }}
              >
                {stakePoolEntries.data?.length &&
                  Math.floor(
                    ((stakePoolEntries.data?.length * 100) / (maxStaked ?? 0)) *
                      10000
                  ) / 10000}
                %
              </div>
            )}
          </div>
        </>
      )}
      {rewardDistributorData.data && (
        <>
          <div className="mx-6 my-auto hidden h-10 w-[1px] bg-border md:flex"></div>
          <div className="flex flex-1 flex-col items-center justify-center">
            <p
              className="text-lg text-medium-4"
              style={{ color: stakePoolMetadata?.colors?.fontColorTertiary }}
            >
              {rewardDistributorData.data.parsed?.maxRewardSecondsReceived?.eq(
                new BN(1)
              )
                ? '1x Claim'
                : 'Rewards Rate'}
            </p>
            <RewardsRate />
          </div>
          <div className="mx-6 my-auto hidden h-10 w-[1px] bg-border md:flex"></div>
          <div className="flex flex-1 flex-col items-center justify-center">
            <p
              className="text-lg text-medium-4"
              style={{ color: stakePoolMetadata?.colors?.fontColorTertiary }}
            >
              Treasury Balance
            </p>
            <TreasuryBalance className="text-center text-xl text-light-1" />
          </div>
        </>
      )}
    </div>
  )
}
