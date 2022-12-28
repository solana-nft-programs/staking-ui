import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { useRewardEntries } from 'hooks/useRewardEntries'
import type { StakeEntryTokenData } from 'hooks/useStakedTokenDatas'

import type { BoostArgs } from '@/components/token-staking/token-stats/values/TokenStatBoostValue'
import {
  calculateBoost,
  TokenStatBoostValue,
} from '@/components/token-staking/token-stats/values/TokenStatBoostValue'
import { Badge } from '@/components/UI/Badge'

export interface TokenStatBoostBadgeProps {
  tokenData: StakeEntryTokenData
  className?: string
}

export const calculateBoostAsString = ({
  rewardDistributorData,
  rewardEntriesData,
  tokenData,
}: BoostArgs) => {
  if (rewardDistributorData?.parsed?.multiplierDecimals === undefined)
    return '1'

  return calculateBoost({
    rewardDistributorData,
    rewardEntriesData,
    tokenData,
  })
}

export const TokenStatBoostBadge = ({
  tokenData,
  className,
}: TokenStatBoostBadgeProps) => {
  const { data: rewardDistributorData } = useRewardDistributorData()
  const { data: rewardEntriesData } = useRewardEntries()

  return (
    <>
      {rewardDistributorData?.parsed?.multiplierDecimals !== undefined &&
        Number(
          calculateBoostAsString({
            rewardDistributorData,
            rewardEntriesData,
            tokenData,
          })
        ) !== 1 && (
          <Badge className={className}>
            <div className="text-xs">🔥</div>
            <div>&nbsp;Boost&nbsp;</div>
            <TokenStatBoostValue tokenData={tokenData} />x
          </Badge>
        )}
    </>
  )
}
