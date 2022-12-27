import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { useRewardEntries } from 'hooks/useRewardEntries'
import type { StakeEntryTokenData } from 'hooks/useStakedTokenDatas'
import { useCallback, useEffect, useState } from 'react'

import { calculateBoost } from '@/components/token-staking/token-stats/utils'
import { TokenStatBoostValue } from '@/components/token-staking/token-stats/values/TokenStatBoostValue'
import { Badge } from '@/components/UI/Badge'

export interface TokenStatBoostBadgeProps {
  tokenData: StakeEntryTokenData
  className?: string
}

export const TokenStatBoostBadge = ({
  tokenData,
  className,
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
    <Badge className={className}>
      <div className="text-xs">🔥</div>
      <div>&nbsp;Boost&nbsp;</div>
      <TokenStatBoostValue tokenData={tokenData} />x
    </Badge>
  )
}
