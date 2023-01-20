import { PoolVersionIndicator } from '@/components/fee-info/PoolVersionIndicator'
import { RewardClaimFee } from '@/components/fee-info/RewardClaimFee'
import { StakeFee } from '@/components/fee-info/StakeFee'
import { UnstakeFee } from '@/components/fee-info/UnstakeFee'

export const FeeInfo: React.FC = () => {
  return (
    <div className="-mx-2 flex flex-wrap">
      <div className="w-full p-2 md:w-1/2 xl:w-auto">
        <PoolVersionIndicator />
      </div>
      <div className="w-full p-2 md:w-1/2 xl:w-auto">
        <RewardClaimFee />
      </div>
      <div className="w-full p-2 md:w-1/2 xl:w-auto">
        <StakeFee />
      </div>
      <div className="w-full p-2 md:w-1/2 xl:w-auto">
        <UnstakeFee />
      </div>
    </div>
  )
}
