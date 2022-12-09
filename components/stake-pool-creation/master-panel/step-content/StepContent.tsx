import type { Dispatch, SetStateAction } from 'react'

import { Intro } from '@/components/stake-pool-creation/master-panel/Intro'
import { AdditionalStakeConditions } from '@/components/stake-pool-creation/master-panel/step-content/AdditionalStakeConditions'
import { Authorization } from '@/components/stake-pool-creation/master-panel/step-content/authorization/Authorization'
import { RewardSupply } from '@/components/stake-pool-creation/master-panel/step-content/reward-supply/RewardSupply'
import { RewardDistribution } from '@/components/stake-pool-creation/master-panel/step-content/RewardDistribution'
import { Summary } from '@/components/stake-pool-creation/master-panel/step-content/Summary'
import { TimeBasedParameters } from '@/components/stake-pool-creation/master-panel/step-content/TimeBasedParameters'
import type { SlavePanelScreens } from '@/components/stake-pool-creation/SlavePanel'

export type StepContentProps = {
  currentStep: number
  setActiveSlavePanelScreen: Dispatch<SetStateAction<SlavePanelScreens>>
}

export const StepContent = ({
  currentStep,
  setActiveSlavePanelScreen,
}: StepContentProps) => {
  return (
    <div>
      {currentStep === 0 && <Intro />}
      {currentStep === 1 && (
        <Authorization setActiveSlavePanelScreen={setActiveSlavePanelScreen} />
      )}
      {currentStep === 2 && <RewardDistribution />}
      {currentStep === 3 && <RewardSupply />}
      {currentStep === 4 && <TimeBasedParameters />}
      {currentStep === 5 && <AdditionalStakeConditions />}
      {currentStep === 6 && <Summary />}
    </div>
  )
}
