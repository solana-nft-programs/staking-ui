import { PrimaryTipLayout } from '@/components/stake-pool-creation/tip-layout/PrimaryTipLayout'
import { LargeCopy } from '@/components/UI/typography/LargeCopy'

export const RewardDistributionTipOne = () => {
  return (
    <PrimaryTipLayout title="Rewards emission">
      <LargeCopy>
        Select between minting tokens from a mint address or transferring tokens
        directly to the stake pool from your wallet.
      </LargeCopy>
    </PrimaryTipLayout>
  )
}
