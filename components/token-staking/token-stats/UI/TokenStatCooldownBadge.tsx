import type { StakeEntryTokenData } from 'hooks/useStakedTokenDatas'
import { useStakePoolData } from 'hooks/useStakePoolData'
import { useEffect, useState } from 'react'

import { hasCooldown } from '@/components/token-staking/token-stats/utils'
import { TokenStatCooldownValue } from '@/components/token-staking/token-stats/values/TokenStatCooldownValue'
import { Badge } from '@/components/UI/Badge'

export interface TokenStatCooldownBadgeProps {
  tokenData: StakeEntryTokenData
  className?: string
}

export const TokenStatCooldownBadge = ({
  className,
  tokenData,
}: TokenStatCooldownBadgeProps) => {
  const [showBadge, setShowBadge] = useState(false)
  const { data: stakePool } = useStakePoolData()

  useEffect(() => {
    if (!stakePool) return

    setShowBadge(
      hasCooldown({
        tokenData,
        stakePool,
      })
    )
  }, [stakePool, tokenData])

  if (!showBadge) return <></>

  return (
    <Badge className={className}>
      <div className="text-xs">🧊</div>
      <div>
        <TokenStatCooldownValue tokenData={tokenData} />
      </div>
    </Badge>
  )
}
