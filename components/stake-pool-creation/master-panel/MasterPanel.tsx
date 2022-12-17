import { LoadingSpinner } from 'common/LoadingSpinner'
import type { FormikHandlers, FormikState, FormikValues } from 'formik'
import type { Dispatch, SetStateAction } from 'react'
import type { Mint } from 'spl-token-v3'

import type { FlowType } from '@/components/stake-pool-creation/master-panel/step-content/StepContent'
import { StepContent } from '@/components/stake-pool-creation/master-panel/step-content/StepContent'
import type { SlavePanelScreens } from '@/components/stake-pool-creation/SlavePanel'
import { ButtonPrimary } from '@/components/UI/buttons/ButtonPrimary'
import { BodyCopy } from '@/components/UI/typography/BodyCopy'
import { HeadingPrimary } from '@/components/UI/typography/HeadingPrimary'
import { ButtonWidths } from '@/types/index'

export type MasterPanelProps = {
  submitDisabled: boolean
  mintInfo?: Mint
  currentStep: number
  setCurrentStep: (step: number) => void
  setActiveSlavePanelScreen: Dispatch<SetStateAction<SlavePanelScreens>>
  formState: FormikHandlers & FormikState<FormikValues> & FormikValues
  type: FlowType
  handleSubmit: () => void
  isLoading?: boolean
}

const stepTitles = [
  'Create Your Staking Pool',
  'Authorization',
  'Reward Distribution',
  'Additional Features',
  'Summary',
]

const stepSubtitles = [
  'Thank you for your interest!',
  'Decide which NFT collections or coins will be staked.',
  'Specify the emission and source of rewards for stakers.',
  'Enable optional features for staking in your pool.',
  'Customize the staking technology for your users.',
  'All steps completed. Please review the details of your Stake Pool below, before you hit the Create button.',
]

export const MasterPanel = ({
  submitDisabled,
  mintInfo,
  formState,
  currentStep,
  setCurrentStep,
  setActiveSlavePanelScreen,
  handleSubmit,
  isLoading,
  type,
}: MasterPanelProps) => {
  return (
    <div className="w-2/5 space-y-2">
      <HeadingPrimary>{stepTitles?.[currentStep]}</HeadingPrimary>
      <BodyCopy className="pb-2">{stepSubtitles?.[currentStep]}</BodyCopy>
      <StepContent
        type={type}
        mintInfo={mintInfo}
        formState={formState}
        currentStep={currentStep}
        setActiveSlavePanelScreen={setActiveSlavePanelScreen}
      />
      <div className="flex items-center space-x-4 py-8">
        {currentStep > 0 && (
          <ButtonPrimary
            onClick={() => setCurrentStep(currentStep - 1)}
            width={ButtonWidths.NARROW}
          >
            Previous
          </ButtonPrimary>
        )}
        {currentStep < stepTitles.length - 1 ? (
          <ButtonPrimary
            onClick={() => setCurrentStep(currentStep + 1)}
            width={ButtonWidths.NARROW}
          >
            {currentStep === 0 ? 'Start' : 'Next'}
          </ButtonPrimary>
        ) : (
          <ButtonPrimary
            onClick={() => handleSubmit()}
            width={ButtonWidths.NARROW}
            disabled={submitDisabled}
          >
            {isLoading ? (
              <LoadingSpinner fill={'#FFF'} height="25px" />
            ) : type === 'create' ? (
              'Create'
            ) : (
              'Update'
            )}
          </ButtonPrimary>
        )}
        {currentStep > 0 && (
          <BodyCopy className="ml-4">Step {currentStep}/4</BodyCopy>
        )}
      </div>
    </div>
  )
}
