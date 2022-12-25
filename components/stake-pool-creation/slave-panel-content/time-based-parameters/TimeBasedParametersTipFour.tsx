import { PrimaryTipLayout } from '@/components/stake-pool-creation/tip-layout/PrimaryTipLayout'
import { LargeCopy } from '@/components/UI/typography/LargeCopy'

export const TimeBasedParametersTipFour = () => {
  return (
    <PrimaryTipLayout title="Stake pool end date">
      <LargeCopy>
        Select end date for your pool when staking is disabled but claiming
        rewards and unstaking is still enabled.
      </LargeCopy>
    </PrimaryTipLayout>
  )
}
