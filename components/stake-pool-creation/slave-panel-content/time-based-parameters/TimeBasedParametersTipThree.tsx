import { PrimaryTipLayout } from '@/components/stake-pool-creation/tip-layout/PrimaryTipLayout'
import { LargeCopy } from '@/components/UI/typography/LargeCopy'

export const TimeBasedParametersTipThree = () => {
  return (
    <PrimaryTipLayout title="Maximum rewards duration">
      <LargeCopy>
        Specify for how long a staked token can receive rewards in your pool.
      </LargeCopy>
    </PrimaryTipLayout>
  )
}
