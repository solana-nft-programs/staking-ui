import { PrimaryTipLayout } from '@/components/stake-pool-creation/tip-layout/PrimaryTipLayout'
import { LargeCopy } from '@/components/UI/typography/LargeCopy'

export const RewardDistributionTipTwo = () => {
  return (
    <PrimaryTipLayout title="Source of rewards">
      <LargeCopy>
        Specify the mint address of the reward token for stakers that will
        deposit assets into your Stake Pool.
      </LargeCopy>
    </PrimaryTipLayout>
  )
}
