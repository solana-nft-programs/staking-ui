import { RewardDistributorKind } from '@cardinal/staking/dist/cjs/programs/rewardDistributor'
import { BN } from '@project-serum/anchor'
import {
  formatAmountAsDecimal,
  formatMintNaturalAmountAsDecimal,
} from 'common/units'
import { pubKeyUrl } from 'common/utils'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { useRewardDistributorTokenAccount } from 'hooks/useRewardDistributorTokenAccount'
import { useRewardMintInfo } from 'hooks/useRewardMintInfo'
import { baseDailyRate, useRewardsRate } from 'hooks/useRewardsRate'
import { useStakePoolEntries } from 'hooks/useStakePoolEntries'
import { useStakePoolMaxStaked } from 'hooks/useStakePoolMaxStaked'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'
import { useStakePoolTotalStaked } from 'hooks/useStakePoolTotalStaked'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'

export const HeroStats: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { environment } = useEnvironmentCtx()
  const rewardDistributorData = useRewardDistributorData()
  const rewardMintInfo = useRewardMintInfo()
  const stakePoolEntries = useStakePoolEntries()
  const maxStaked = useStakePoolMaxStaked()
  const totalStaked = useStakePoolTotalStaked()
  const rewardsRate = useRewardsRate()
  const { data: stakePoolMetadata } = useStakePoolMetadata()
  const rewardDistributorTokenAccountData = useRewardDistributorTokenAccount()

  return (
    <div
      className={`flex w-full flex-col flex-wrap justify-between gap-y-5 rounded-xl border border-border px-12 py-6 md:flex-row ${
        stakePoolMetadata?.colors?.fontColor ? '' : 'text-gray-200'
      } bg-white bg-opacity-5 ${className}`}
      style={{
        background: stakePoolMetadata?.colors?.backgroundSecondary,
        border: stakePoolMetadata?.colors?.accent
          ? `2px solid ${stakePoolMetadata?.colors?.accent}`
          : '',
      }}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="text-lg text-medium-4">Total Staked</div>
        {!totalStaked.data ? (
          <div className="h-6 w-10 animate-pulse rounded-md bg-border"></div>
        ) : (
          <div className="text-center text-xl text-light-1">
            {totalStaked.data?.toLocaleString()}{' '}
            {stakePoolMetadata?.maxStaked
              ? `/ ${stakePoolMetadata?.maxStaked.toLocaleString()}`
              : ''}
          </div>
        )}
      </div>
      <div className="mx-6 my-auto hidden h-10 w-[1px] bg-border md:flex"></div>
      <div className="flex flex-col items-center justify-center">
        <p className="text-lg text-medium-4">Percent Staked</p>
        {!stakePoolEntries.data || !maxStaked ? (
          <div className="h-6 w-10 animate-pulse rounded-md bg-border"></div>
        ) : (
          <div className="text-center text-xl text-light-1">
            {stakePoolEntries.data?.length &&
              Math.floor(
                ((stakePoolEntries.data?.length * 100) / maxStaked) * 10000
              ) / 10000}
            %
          </div>
        )}
      </div>
      {rewardDistributorData.data && (
        <>
          <div className="mx-6 my-auto hidden h-10 w-[1px] bg-border md:flex"></div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-lg text-medium-4">
              {rewardDistributorData.data.parsed.maxRewardSecondsReceived?.eq(
                new BN(1)
              )
                ? '1x Claim'
                : 'Rewards Rate'}
            </p>
            {!rewardsRate.data || !rewardMintInfo.data ? (
              <div className="h-6 w-10 animate-pulse rounded-md bg-border"></div>
            ) : (
              <div className="text-center text-xl text-light-1">
                {formatAmountAsDecimal(
                  rewardMintInfo.data.mintInfo.decimals,
                  baseDailyRate(rewardDistributorData.data),
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
                {rewardDistributorData.data.parsed.maxRewardSecondsReceived?.eq(
                  new BN(1)
                )
                  ? ''
                  : '/ Day'}
              </div>
            )}
          </div>
          <div className="mx-6 my-auto hidden h-10 w-[1px] bg-border md:flex"></div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-lg text-medium-4">Treasury Balance</p>
            {!rewardsRate.data ||
            !rewardMintInfo.data ||
            !rewardDistributorTokenAccountData.data ? (
              <div className="h-6 w-10 animate-pulse rounded-md bg-border"></div>
            ) : (
              <div className="text-center text-xl text-light-1">
                {rewardDistributorData.data.parsed.kind ===
                RewardDistributorKind.Mint
                  ? formatMintNaturalAmountAsDecimal(
                      rewardMintInfo.data.mintInfo,
                      rewardMintInfo.data.mintInfo.supply,
                      Math.min(rewardMintInfo.data.mintInfo.decimals, 6)
                    )
                  : formatMintNaturalAmountAsDecimal(
                      rewardMintInfo.data.mintInfo,
                      rewardDistributorTokenAccountData.data?.amount,
                      Math.min(rewardMintInfo.data.mintInfo.decimals, 6)
                    )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
