import { LoadingSpinner } from 'common/LoadingSpinner'
import { withCluster } from 'common/utils'
import type { FormikHandlers, FormikState, FormikValues } from 'formik'
import { useRouter } from 'next/router'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import type { Dispatch, SetStateAction } from 'react'
import type { Mint } from 'spl-token-v3'

import type { FlowType } from '@/components/stake-pool-creation/master-panel/step-content/StepContent'
import { StepContent } from '@/components/stake-pool-creation/master-panel/step-content/StepContent'
import { StepIndicator } from '@/components/stake-pool-creation/master-panel/step-indicator/StepIndicator'
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
  activeSlavePanelScreen: SlavePanelScreens
}

const stepTitlesAbbreviated = ['Pool Info', 'Rewards', 'Features']

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
  activeSlavePanelScreen,
}: MasterPanelProps) => {
  const { environment } = useEnvironmentCtx()
  const router = useRouter()
  return (
    <div className="relative flex h-full w-full flex-1 flex-col space-y-2 px-2 lg:w-2/5">
      <HeadingPrimary>{stepTitles?.[currentStep]}</HeadingPrimary>
      <BodyCopy className="pb-2">{stepSubtitles?.[currentStep]}</BodyCopy>
      {currentStep > 0 && (
        <StepIndicator
          numberOfSteps={stepTitlesAbbreviated.length}
          stepNames={stepTitlesAbbreviated}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      )}
      <div className="relative h-full overflow-y-auto">
        <div className="-mx-2 h-full overflow-y-auto px-2">
          <StepContent
            type={type}
            mintInfo={mintInfo}
            formState={formState}
            currentStep={currentStep}
            activeSlavePanelScreen={activeSlavePanelScreen}
            setActiveSlavePanelScreen={setActiveSlavePanelScreen}
          />
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent via-gray-900 to-gray-900" />
      </div>
      <div className="mt-16 flex items-center justify-between bg-opacity-0">
        <div className="flex flex-wrap items-center gap-4">
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
        <div
          className="cursor-pointer text-gray-400 transition hover:text-light-0"
          onClick={() => {
            router.push(withCluster('/admin', environment.label))
          }}
        >
          Cancel
        </div>
      </div>
    </div>
  )
}
