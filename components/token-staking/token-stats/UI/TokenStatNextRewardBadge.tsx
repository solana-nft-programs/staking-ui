import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { useRewards } from 'hooks/useRewards'
import type { StakeEntryTokenData } from 'hooks/useStakedTokenDatas'
import { useEffect, useState } from 'react'

import { hasNextRewards } from '@/components/token-staking/token-stats/utils'
import { TokenStatNextRewardValue } from '@/components/token-staking/token-stats/values/TokenStatNextRewardValue'
import { Badge } from '@/components/UI/Badge'

export interface TokenStatNextRewardBadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  tokenData: StakeEntryTokenData
  className?: string
}

export const TokenStatNextRewardBadge = ({
  tokenData,
  className,
}: TokenStatNextRewardBadgeProps) => {
  const [showBadge, setShowBadge] = useState(false)

  const { data: rewardDistributorData } = useRewardDistributorData()
  const { data: rewardsData } = useRewards()

  useEffect(() => {
    setShowBadge(
      hasNextRewards({
        rewardsData,
        rewardDistributorData,
        tokenData,
      })
    )
  }, [rewardDistributorData, rewardsData, tokenData])

  if (!showBadge) return <></>

  return (
    <Badge className={className}>
      <div className="text-xs">🎁</div>
      <div>
        <TokenStatNextRewardValue tokenData={tokenData} />
      </div>
    </Badge>
  )
}
