import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { useRewardEntries } from 'hooks/useRewardEntries'
import type { StakeEntryTokenData } from 'hooks/useStakedTokenDatas'
import { useCallback, useEffect, useState } from 'react'

import { calculateBoost } from '@/components/token-staking/token-stats/utils'
import { TokenStatBoostValue } from '@/components/token-staking/token-stats/values/TokenStatBoostValue'

export interface TokenStatBoostBadgeProps {
  tokenData: StakeEntryTokenData
}

export const TokenStatBoostBadge = ({
  tokenData,
}: TokenStatBoostBadgeProps) => {
  const { data: rewardDistributorData } = useRewardDistributorData()
  const { data: rewardEntriesData } = useRewardEntries()
  const [hasBoost, setHasBoost] = useState(false)

  const calculateBoostAsString = useCallback(() => {
    if (rewardDistributorData?.parsed?.multiplierDecimals === undefined)
      return '1'

    return calculateBoost({
      rewardDistributorData,
      rewardEntriesData,
      tokenData,
    })
  }, [rewardDistributorData, rewardEntriesData, tokenData])

  useEffect(() => {
    const boostAmount = calculateBoostAsString()

    if (Number(boostAmount) !== 1) {
      setHasBoost(true)
    }
  }, [
    calculateBoostAsString,
    rewardDistributorData,
    rewardEntriesData,
    tokenData,
  ])

  if (!hasBoost) return <></>

  return (
    <div className="absolute bottom-6 left-2 flex items-center rounded-lg bg-gray-800 p-1 px-2 text-sm">
      <div className="text-xs">🔥</div>
      <div>&nbsp;Boost&nbsp;</div>
      <TokenStatBoostValue tokenData={tokenData} />x
    </div>
  )
}
