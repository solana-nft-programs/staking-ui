import { BN } from '@project-serum/anchor'
import { formatAmountAsDecimal } from 'common/units'
import { pubKeyUrl } from 'common/utils'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { useRewardMintInfo } from 'hooks/useRewardMintInfo'
import { baseDailyRate, useRewardsRate } from 'hooks/useRewardsRate'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'

export const RewardsRate = () => {
  const rewardsRate = useRewardsRate()
  const rewardDistributorData = useRewardDistributorData()
  const rewardMintInfo = useRewardMintInfo()
  const { environment } = useEnvironmentCtx()
  const { data: stakePoolMetadata } = useStakePoolMetadata()

  return (
    <>
      {!rewardsRate?.data ||
      !rewardMintInfo?.data ||
      !rewardDistributorData?.data ? (
        <div className="h-6 w-10 animate-pulse rounded-md bg-border"></div>
      ) : (
        <div
          className="text-center text-xl text-light-1"
          style={{ color: stakePoolMetadata?.colors?.fontColor }}
        >
          {formatAmountAsDecimal(
            rewardMintInfo.data.mintInfo.decimals,
            baseDailyRate(rewardDistributorData.data),
            Math.min(rewardMintInfo.data.mintInfo.decimals, 3)
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
        </div>
      )}
    </>
  )
}
