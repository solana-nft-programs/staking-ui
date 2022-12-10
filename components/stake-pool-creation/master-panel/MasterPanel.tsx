import type { FormikHandlers, FormikState, FormikValues } from 'formik'
import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useState } from 'react'

import { StepContent } from '@/components/stake-pool-creation/master-panel/step-content/StepContent'
import { StepIndicator } from '@/components/stake-pool-creation/master-panel/step-indicator/StepIndicator'
import type { SlavePanelScreens } from '@/components/stake-pool-creation/SlavePanel'
import { ButtonPrimary } from '@/components/UI/buttons/ButtonPrimary'
import { BodyCopy } from '@/components/UI/typography/BodyCopy'
import { HeadingPrimary } from '@/components/UI/typography/HeadingPrimary'
import { ButtonWidths } from '@/types/index'

export type MasterPanelProps = {
  currentStep: number
  setCurrentStep: (step: number) => void
  setActiveSlavePanelScreen: Dispatch<SetStateAction<SlavePanelScreens>>
  formState: FormikHandlers & FormikState<FormikValues> & FormikValues
}

const stepTitles = [
  'Create your Staking Pool',
  'Authorization',
  'Reward distribution',
  'Rewards supply',
  'Time-based parameters',
  'Additional stake conditions',
  'Summary',
]

const stepSubtitles = [
  'Thank you for your interest!',
  'Decide which NFT collections or coins will be staked.',
  'Specify the emission and source of rewards for stakers.',
  'Adjust the amount of rewards per a token staked.',
  'Introduce optional constraints for staking in your pool.',
  'Customize the staking technology for your users.',
  'All steps completed. Please review the details of your Stake Pool below, before you hit the Create button.',
]

export const MasterPanel = ({
  formState,
  currentStep,
  setCurrentStep,
  setActiveSlavePanelScreen,
}: MasterPanelProps) => {
  const [title, setTitle] = useState('')
  const [stepSubtitle, setStepSubtitle] = useState('')

  useEffect(() => {
    const title = stepTitles?.[currentStep]
    const subTitle = stepSubtitles?.[currentStep]
    if (!title || !subTitle) return
    setTitle(title)
    setStepSubtitle(subTitle)
  }, [currentStep])

  return (
    <div className="w-2/5 space-y-2">
      <HeadingPrimary>{title}</HeadingPrimary>
      <BodyCopy className="pb-2">{stepSubtitle}</BodyCopy>
      {currentStep > 0 && (
        <div className=" pb-16">
          <StepIndicator currentStep={currentStep} />
        </div>
      )}
      <StepContent
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
          <ButtonPrimary onClick={() => {}} width={ButtonWidths.NARROW}>
            Create Stake Pool
          </ButtonPrimary>
        )}
        {currentStep > 0 && (
          <BodyCopy className="ml-4">Step {currentStep}/6</BodyCopy>
        )}
      </div>
    </div>
  )
}
