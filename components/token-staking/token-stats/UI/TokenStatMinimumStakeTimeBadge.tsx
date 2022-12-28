import type { StakeEntryTokenData } from 'hooks/useStakedTokenDatas'
import { useStakePoolData } from 'hooks/useStakePoolData'

import {
  hasMinimumStakeTime,
  TokenStatMinimumStakeTimeValue,
} from '@/components/token-staking/token-stats/values/TokenStatMinimumStakeTimeValue'
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
  const { data: stakePool } = useStakePoolData()

  return (
    <>
      {hasMinimumStakeTime({ tokenData, stakePool }) && (
        <Badge className={className}>
          <div className="text-xs">🔒</div>
          <div>
            <TokenStatMinimumStakeTimeValue tokenData={tokenData} />
          </div>
        </Badge>
      )}
    </>
  )
}
