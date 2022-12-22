import { PrimaryTipLayout } from '@/components/stake-pool-creation/tip-layout/PrimaryTipLayout'
import { LargeCopy } from '@/components/UI/typography/LargeCopy'

export const AdditionalStakeConditionsTipThree = () => {
  return (
    <PrimaryTipLayout title="Reset cumulative stake duration">
      <LargeCopy>
        If active then every time a user stakes a token, then unstakes it and
        stakes again in your Stake Pool the stake timer will reset rather than
        accumulate.
      </LargeCopy>
    </PrimaryTipLayout>
  )
}
