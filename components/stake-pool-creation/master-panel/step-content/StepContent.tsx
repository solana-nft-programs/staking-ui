import type * as splToken from '@solana/spl-token'
import type { FormikHandlers, FormikState, FormikValues } from 'formik'
import type { Dispatch, SetStateAction } from 'react'

import { Intro } from '@/components/stake-pool-creation/master-panel/Intro'
import { AdditionalStakeConditions } from '@/components/stake-pool-creation/master-panel/step-content/AdditionalStakeConditions'
import { Authorization } from '@/components/stake-pool-creation/master-panel/step-content/authorization/Authorization'
import { RewardDistribution } from '@/components/stake-pool-creation/master-panel/step-content/RewardDistribution'
import { Summary } from '@/components/stake-pool-creation/master-panel/step-content/Summary'
import { TimeBasedParameters } from '@/components/stake-pool-creation/master-panel/step-content/TimeBasedParameters'
import type { SlavePanelScreens } from '@/components/stake-pool-creation/SlavePanel'

export type FlowType = 'create' | 'update'

export type StepContentProps = {
  currentStep: number
  setActiveSlavePanelScreen: Dispatch<SetStateAction<SlavePanelScreens>>
  formState: FormikHandlers & FormikState<FormikValues> & FormikValues
  mintInfo?: splToken.MintInfo
  type: FlowType
}

export const StepContent = ({
  currentStep,
  setActiveSlavePanelScreen,
  formState,
  mintInfo,
  type,
}: StepContentProps) => {
  return (
    <div>
      {currentStep === 0 && <Intro />}
      {currentStep === 1 && (
        <Authorization
          setActiveSlavePanelScreen={setActiveSlavePanelScreen}
          formState={formState}
        />
      )}
      {currentStep === 2 && (
        <RewardDistribution
          type={type}
          mintInfo={mintInfo}
          setActiveSlavePanelScreen={setActiveSlavePanelScreen}
          formState={formState}
        />
      )}
      {currentStep === 3 && (
        <TimeBasedParameters
          setActiveSlavePanelScreen={setActiveSlavePanelScreen}
          formState={formState}
        />
      )}
      {currentStep === 4 && (
        <AdditionalStakeConditions
          setActiveSlavePanelScreen={setActiveSlavePanelScreen}
          formState={formState}
        />
      )}
      {currentStep === 5 && <Summary formState={formState} />}
    </div>
  )
}
