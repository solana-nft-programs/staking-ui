import { getExpirationString, secondstoDuration } from '@cardinal/common'
import { BN } from '@project-serum/anchor'
import { PublicKey } from '@solana/web3.js'
import { useMintInfo } from 'hooks/useMintInfo'
import { FaCheck } from 'react-icons/fa'

import {
  formatAmountAsDecimal,
  formatMintNaturalAmountAsDecimal,
} from '../common/units'
import { useRewardDistributorData } from '../hooks/useRewardDistributorData'
import { useRewardEntries } from '../hooks/useRewardEntries'
import { useRewardMintInfo } from '../hooks/useRewardMintInfo'
import { useRewards } from '../hooks/useRewards'
import { useRewardsRate } from '../hooks/useRewardsRate'
import type { StakeEntryTokenData } from '../hooks/useStakedTokenDatas'
import { useStakePoolData } from '../hooks/useStakePoolData'
import { useUTCNow } from '../providers/UTCNowProvider'

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
  const rewardEntries = useRewardEntries()
  const rewardsRate = useRewardsRate()
  const rewards = useRewards()

  return (
    <div className="mt-2">
      {tokenData.stakeEntry &&
        tokenData.stakeEntry.parsed?.amount.gt(new BN(1)) &&
        rewardMintInfo.data && (
          <div className="flex w-full flex-row justify-between text-xs font-semibold">
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
          </div>
        )}
      {tokenData.stakeEntry?.pubkey && (
        <div className="flex w-full flex-row justify-between text-xs font-semibold">
          <span>Boost:</span>
          <span className="text-right">
            {(rewardDistributorData.data?.parsed?.multiplierDecimals !==
              undefined &&
              formatAmountAsDecimal(
                rewardDistributorData.data?.parsed.multiplierDecimals || 0,
                rewardEntries.data
                  ? rewardEntries.data.find((entry) =>
                      entry.parsed?.stakeEntry.equals(
                        tokenData.stakeEntry?.pubkey || PublicKey.default
                      )
                    )?.parsed?.multiplier ||
                      rewardDistributorData.data.parsed.defaultMultiplier
                  : rewardDistributorData.data.parsed.defaultMultiplier,
                rewardDistributorData.data.parsed.multiplierDecimals
              ).toString()) ||
              1}
            x
          </span>
        </div>
      )}
      {rewardDistributorData.data &&
        rewardDistributorData.data.parsed?.rewardDurationSeconds &&
        rewardDistributorData.data.parsed?.rewardDurationSeconds.gt(
          new BN(0)
        ) && (
          <>
            {tokenData.stakeEntry && rewardMintInfo.data && (
              <div className="flex w-full flex-row justify-between text-xs font-semibold">
                <span>Daily:</span>
                <span className="text-right">
                  {formatAmountAsDecimal(
                    rewardMintInfo.data.mintInfo.decimals,
                    rewardsRate.data?.rewardsRateMap[
                      tokenData.stakeEntry.pubkey.toString()
                    ]?.dailyRewards || new BN(0), // max of 5 decimals
                    Math.min(rewardMintInfo.data.mintInfo.decimals, 5)
                  )}
                </span>
              </div>
            )}
            {tokenData.stakeEntry && rewardMintInfo.data && (
              <div className="flex w-full flex-row justify-between text-xs font-semibold">
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
              </div>
            )}
            {rewards.data &&
              rewards.data.rewardMap[
                tokenData.stakeEntry?.pubkey.toString() || ''
              ] &&
              rewardDistributorData.data?.parsed.rewardDurationSeconds.gte(
                new BN(60)
              ) && (
                <div className="flex w-full flex-row justify-between text-xs font-semibold">
                  <span>Next Rewards:</span>
                  <span>
                    {secondstoDuration(
                      rewards.data.rewardMap[
                        tokenData.stakeEntry?.pubkey.toString() || ''
                      ]?.nextRewardsIn.toNumber() || 0
                    )}
                  </span>
                </div>
              )}
          </>
        )}
      {!!tokenData.stakeEntry?.parsed?.cooldownStartSeconds &&
        !!stakePool?.parsed?.cooldownSeconds && (
          <div className="flex w-full flex-row items-center justify-between text-xs font-semibold">
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
          </div>
        )}
      {!!stakePool?.parsed?.minStakeSeconds &&
        !!tokenData.stakeEntry?.parsed?.lastStakedAt && (
          <div className="flex w-full flex-row items-center justify-between text-xs font-semibold">
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
          </div>
        )}
    </div>
  )
}
