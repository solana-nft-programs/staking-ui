import { PrimaryTipLayout } from '@/components/stake-pool-creation/tip-layout/PrimaryTipLayout'
import { LargeCopy } from '@/components/UI/typography/LargeCopy'

export const RewardDistributionTipThree = () => {
  return (
    <PrimaryTipLayout title="Top up the rewards treasury">
      <LargeCopy>
        Specify how many tokens to transfer to your Stake Pool for future
        distribution. The value can also be equal to 0, however, tokens will
        later have to be transferred into the rewards pool directly via your
        wallet.
      </LargeCopy>
    </PrimaryTipLayout>
  )
}
