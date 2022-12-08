import { Intro } from '@/components/stake-pool-creation/master-panel/Intro'
import { Authorization } from '@/components/stake-pool-creation/master-panel/step-content/authorization/Authorization'
import { RewardDistribution } from '@/components/stake-pool-creation/master-panel/step-content/RewardDistribution'
import { RewardSupply } from '@/components/stake-pool-creation/master-panel/step-content/reward-supply/RewardSupply'

export type StepContentProps = {
  currentStep: number
}

export const StepContent = ({ currentStep }: StepContentProps) => {
  return (
    <div>
      {currentStep === 0 && <Intro />}
      {currentStep === 1 && <Authorization />}
      {currentStep === 2 && <RewardDistribution />}
      {currentStep === 3 && <RewardSupply />}
    </div>
  )
}
