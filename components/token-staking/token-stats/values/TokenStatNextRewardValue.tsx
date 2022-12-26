import { secondstoDuration } from '@cardinal/common'
import { useRewards } from 'hooks/useRewards'
import type { StakeEntryTokenData } from 'hooks/useStakedTokenDatas'

export interface TokenStatNextRewardValueProps {
  tokenData: StakeEntryTokenData
}

export const TokenStatNextRewardValue = ({
  tokenData,
}: TokenStatNextRewardValueProps) => {
  const { data: rewardsData } = useRewards()
  if (!rewardsData) return <></>

  return (
    <>
      {secondstoDuration(
        rewardsData.rewardMap[
          tokenData.stakeEntry?.pubkey.toString() || ''
        ]?.nextRewardsIn.toNumber() || 0
      )}
    </>
  )
}
