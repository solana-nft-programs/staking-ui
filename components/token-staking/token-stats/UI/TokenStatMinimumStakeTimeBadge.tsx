import type { StakeEntryTokenData } from 'hooks/useStakedTokenDatas'
import { useStakePoolData } from 'hooks/useStakePoolData'
import { useEffect, useState } from 'react'

import { hasMinimumStakeTime } from '@/components/token-staking/token-stats/utils'
import { TokenStatMinimumStakeTimeValue } from '@/components/token-staking/token-stats/values/TokenStatMinimumStakeTimeValue'
import { Badge } from '@/components/UI/Badge'

export interface TokenStatTimeBadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  tokenData: StakeEntryTokenData
  className?: string
}

export const TokenStatTimeBadge = ({
  tokenData,
  className,
}: TokenStatTimeBadgeProps) => {
  const [showBadge, setShowBadge] = useState(false)

  const { data: stakePool } = useStakePoolData()

  useEffect(() => {
    if (!stakePool) return

    setShowBadge(
      hasMinimumStakeTime({
        tokenData,
        stakePool,
      })
    )
  }, [stakePool, tokenData])

  if (!showBadge) return <></>

  return (
    <Badge className={className}>
      <div className="text-xs">🔒</div>
      <div>
        <TokenStatMinimumStakeTimeValue tokenData={tokenData} />
      </div>
    </Badge>
  )
}
