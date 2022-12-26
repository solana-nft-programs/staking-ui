import type { StakeEntryTokenData } from 'hooks/useStakedTokenDatas'

import { TokenStatBoostValue } from '@/components/token-staking/token-stats/TokenStatBoostValue'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { useRewardEntries } from 'hooks/useRewardEntries'
import { useEffect, useState } from 'react'
import { formatAmountAsDecimal } from 'common/units'
import { PublicKey } from '@solana/web3.js'

export interface TokenStatBoostBadgeProps {
  tokenData: StakeEntryTokenData
}

export const TokenStatBoostBadge = ({
  tokenData,
}: TokenStatBoostBadgeProps) => {
  const rewardDistributorData = useRewardDistributorData()
  const rewardEntries = useRewardEntries()
  const [hasBoost, setHasBoost] = useState(false)

  useEffect(() => {
    if (rewardDistributorData.data?.parsed?.multiplierDecimals === undefined)
      return

    if (
      Number(
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
        )
      ) !== 1
    ) {
      setHasBoost(true)
    }
  }, [rewardDistributorData, rewardEntries, tokenData])

  if (!hasBoost) return <></>

  return (
    <div className="absolute bottom-6 left-2 flex items-center rounded-lg bg-gray-800 p-1 px-2 text-sm">
      <div className="text-xs">🔥</div>
      <div>&nbsp;Boost&nbsp;</div>
      <TokenStatBoostValue tokenData={tokenData} />x
    </div>
  )
}
