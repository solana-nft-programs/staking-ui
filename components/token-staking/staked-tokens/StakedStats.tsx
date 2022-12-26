import { getExpirationString, secondstoDuration } from '@cardinal/common'
import { BN } from '@project-serum/anchor'
import {
  formatAmountAsDecimal,
  formatMintNaturalAmountAsDecimal,
} from 'common/units'
import { useMintInfo } from 'hooks/useMintInfo'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { useRewardMintInfo } from 'hooks/useRewardMintInfo'
import { useRewards } from 'hooks/useRewards'
import { useRewardsRate } from 'hooks/useRewardsRate'
import type { StakeEntryTokenData } from 'hooks/useStakedTokenDatas'
import { useStakePoolData } from 'hooks/useStakePoolData'
import { useUTCNow } from 'providers/UTCNowProvider'
import { FaCheck } from 'react-icons/fa'

import { StakedStatWrapper } from '@/components/token-staking/staked-tokens/StakedStatWrapper'

export function StakedStats({ tokenData }: { tokenData: StakeEntryTokenData }) {
  const { UTCNow } = useUTCNow()
  const rewardMintInfo = useRewardMintInfo()
  const mintInfo = useMintInfo(
    tokenData.stakeEntry?.parsed?.amount.gt(new BN(1))
      ? tokenData.stakeEntry?.parsed.stakeMint
      : undefined
  )
  const rewardDistributorData = useRewardDistributorData()

  const { data: stakePool } = useStakePoolData()
  const rewardsRate = useRewardsRate()
  const rewards = useRewards()

  return (
    <div className="flex flex-wrap items-center space-y-0.5 p-2">
      {tokenData.stakeEntry &&
        tokenData.stakeEntry.parsed?.amount.gt(new BN(1)) &&
        rewardMintInfo.data && (
          <StakedStatWrapper>
            <span>Amount:</span>
            <span className="text-right">
              {mintInfo.data
                ? formatAmountAsDecimal(
                    mintInfo.data?.decimals,
                    tokenData.stakeEntry && tokenData.stakeEntry.parsed.amount,
                    mintInfo.data?.decimals
                  )
                : 1}
            </span>
          </StakedStatWrapper>
        )}
      {rewardDistributorData.data &&
        rewardDistributorData.data.parsed?.rewardDurationSeconds &&
        rewardDistributorData.data.parsed?.rewardDurationSeconds.gt(
          new BN(0)
        ) && (
          <>
            {tokenData.stakeEntry && rewardMintInfo.data && (
              <StakedStatWrapper>
                <span>Reward rate:</span>
                <span className="text-right">
                  {formatAmountAsDecimal(
                    rewardMintInfo.data.mintInfo.decimals,
                    rewardsRate.data?.rewardsRateMap[
                      tokenData.stakeEntry.pubkey.toString()
                    ]?.dailyRewards || new BN(0), // max of 5 decimals
                    Math.min(rewardMintInfo.data.mintInfo.decimals, 5)
                  )}{' '}
                  / day
                </span>
              </StakedStatWrapper>
            )}
            {tokenData.stakeEntry && rewardMintInfo.data && (
              <StakedStatWrapper>
                <span>Claim:</span>
                <span className="text-right">
                  {formatMintNaturalAmountAsDecimal(
                    rewardMintInfo.data.mintInfo,
                    rewards.data?.rewardMap[
                      tokenData.stakeEntry.pubkey.toString()
                    ]?.claimableRewards || new BN(0),
                    // max of 5 decimals
                    Math.min(rewardMintInfo.data.mintInfo.decimals, 5)
                  ).toLocaleString()}
                </span>
              </StakedStatWrapper>
            )}
            {rewards.data &&
              rewards.data.rewardMap[
                tokenData.stakeEntry?.pubkey.toString() || ''
              ] &&
              rewardDistributorData.data?.parsed.rewardDurationSeconds.gte(
                new BN(60)
              ) && (
                <StakedStatWrapper>
                  <span>Next Rewards:</span>
                  <span>
                    {secondstoDuration(
                      rewards.data.rewardMap[
                        tokenData.stakeEntry?.pubkey.toString() || ''
                      ]?.nextRewardsIn.toNumber() || 0
                    )}
                  </span>
                </StakedStatWrapper>
              )}
          </>
        )}
      {!!tokenData.stakeEntry?.parsed?.cooldownStartSeconds &&
        !!stakePool?.parsed?.cooldownSeconds && (
          <StakedStatWrapper>
            <span>Cooldown:</span>
            <span className="text-right">
              {tokenData.stakeEntry?.parsed.cooldownStartSeconds.toNumber() +
                stakePool.parsed.cooldownSeconds -
                UTCNow >
              0 ? (
                getExpirationString(
                  tokenData.stakeEntry?.parsed.cooldownStartSeconds.toNumber() +
                    stakePool.parsed.cooldownSeconds,
                  UTCNow
                )
              ) : (
                <FaCheck />
              )}
            </span>
          </StakedStatWrapper>
        )}
      {!!stakePool?.parsed?.minStakeSeconds &&
        !!tokenData.stakeEntry?.parsed?.lastStakedAt && (
          <StakedStatWrapper>
            <span>Min Time:</span>
            <span className="text-right">
              {tokenData.stakeEntry?.parsed.lastStakedAt.toNumber() +
                stakePool.parsed.minStakeSeconds -
                UTCNow >
              0 ? (
                getExpirationString(
                  tokenData.stakeEntry?.parsed.lastStakedAt.toNumber() +
                    stakePool.parsed.minStakeSeconds,
                  UTCNow
                )
              ) : (
                <FaCheck />
              )}
            </span>
          </StakedStatWrapper>
        )}
    </div>
  )
}
