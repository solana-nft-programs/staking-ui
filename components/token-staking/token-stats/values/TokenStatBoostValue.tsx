import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { useRewardEntries } from 'hooks/useRewardEntries'
import type { StakeEntryTokenData } from 'hooks/useStakedTokenDatas'

import { calculateBoost } from '@/components/token-staking/token-stats/utils'

export interface TokenStatBoostValueProps {
  tokenData: StakeEntryTokenData
}

export const TokenStatBoostValue = ({
  tokenData,
}: TokenStatBoostValueProps) => {
  const { data: rewardDistributorData } = useRewardDistributorData()
  const { data: rewardEntriesData } = useRewardEntries()

  if (!tokenData.stakeEntry?.pubkey) return <></>

  return (
    <>
      {(rewardDistributorData?.parsed?.multiplierDecimals !== undefined &&
        calculateBoost({
          rewardDistributorData: rewardDistributorData,
          rewardEntriesData: rewardEntriesData,
          tokenData,
        })) ||
        '1'}
    </>
  )
}
