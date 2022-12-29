import type { StakeEntryTokenData } from 'hooks/useStakedTokenDatas'
import { useStakePoolData } from 'hooks/useStakePoolData'

import {
  hasCooldown,
  TokenStatCooldownValue,
} from '@/components/token-staking/token-stats/values/TokenStatCooldownValue'
import { Badge } from '@/components/UI/Badge'

export interface TokenStatCooldownBadgeProps {
  tokenData: StakeEntryTokenData
  className?: string
}

export const TokenStatCooldownBadge = ({
  className,
  tokenData,
}: TokenStatCooldownBadgeProps) => {
  const { data: stakePool } = useStakePoolData()

  return (
    <>
      {hasCooldown({ tokenData, stakePool }) && (
        <Badge className={className}>
          <div className="text-xs">🧊</div>
          <div>
            <TokenStatCooldownValue tokenData={tokenData} />
          </div>
        </Badge>
      )}
    </>
  )
}
