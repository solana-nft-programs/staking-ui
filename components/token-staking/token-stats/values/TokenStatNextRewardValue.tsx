import { secondstoDuration } from '@cardinal/common'
import type BN from 'bn.js'
import type { StakeEntryTokenData } from 'hooks/useStakedTokenDatas'

export interface TokenStatNextRewardValueProps {
  tokenData: StakeEntryTokenData
  rewardsData:
    | {
        rewardMap: {
          [stakeEntryId: string]: { claimableRewards: BN; nextRewardsIn: BN }
        }
        claimableRewards: BN
      }
    | undefined
}

export const TokenStatNextRewardValue = ({
  tokenData,
  rewardsData,
}: TokenStatNextRewardValueProps) => {
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
