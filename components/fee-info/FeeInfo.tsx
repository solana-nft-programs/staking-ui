import { PoolVersionIndicator } from '@/components/fee-info/PoolVersionIndicator'
import { RewardClaimFee } from '@/components/fee-info/RewardClaimFee'
import { StakeFee } from '@/components/fee-info/StakeFee'
import { UnstakeFee } from '@/components/fee-info/UnstakeFee'

export const FeeInfo: React.FC = () => {
  return (
    <div className="flex flex-wrap gap-4">
      <PoolVersionIndicator />
      <RewardClaimFee />
      <StakeFee />
      <UnstakeFee />
    </div>
  )
}
