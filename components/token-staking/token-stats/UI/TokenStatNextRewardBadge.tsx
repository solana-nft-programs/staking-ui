import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { useRewards } from 'hooks/useRewards'
import type { StakeEntryTokenData } from 'hooks/useStakedTokenDatas'
import { useEffect, useState } from 'react'

import { hasNextRewards } from '@/components/token-staking/token-stats/utils'
import { TokenStatNextRewardValue } from '@/components/token-staking/token-stats/values/TokenStatNextRewardValue'

export interface TokenStatNextRewardBadgeProps {
  tokenData: StakeEntryTokenData
}

export const TokenStatNextRewardBadge = ({
  tokenData,
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
    <div className="absolute top-2 left-2 flex items-center space-x-2 rounded-lg bg-gray-800 p-1 px-2 text-sm">
      <div className="text-xs">🎁</div>
      <div>
        <TokenStatNextRewardValue tokenData={tokenData} />
      </div>
    </div>
  )
}
