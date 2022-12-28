import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { useRewards } from 'hooks/useRewards'
import type { StakeEntryTokenData } from 'hooks/useStakedTokenDatas'

import {
  hasNextRewards,
  TokenStatNextRewardValue,
} from '@/components/token-staking/token-stats/values/TokenStatNextRewardValue'
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
  const { data: rewardDistributorData } = useRewardDistributorData()
  const { data: rewardsData } = useRewards()

  return (
    <>
      {hasNextRewards({
        rewardsData,
        rewardDistributorData,
        tokenData,
      }) && (
        <Badge className={className}>
          <div className="text-xs">🎁</div>
          <div>
            <TokenStatNextRewardValue tokenData={tokenData} />
          </div>
        </Badge>
      )}
    </>
  )
}
