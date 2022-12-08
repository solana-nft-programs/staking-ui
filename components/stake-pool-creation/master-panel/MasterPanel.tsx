import { useEffect, useState } from 'react'

import { StepContent } from '@/components/stake-pool-creation/master-panel/step-content/StepContent'
import { StepIndicator } from '@/components/stake-pool-creation/master-panel/step-indicator/StepIndicator'
import { ButtonPrimary } from '@/components/UI/buttons/ButtonPrimary'
import { BodyCopy } from '@/components/UI/typography/BodyCopy'
import { HeadingPrimary } from '@/components/UI/typography/HeadingPrimary'
import { ButtonWidths } from '@/types/index'

export type MasterPanelProps = {
  majorStep: number
  minorStep: number
  setMajorStep: (step: number) => void
  setMinorStep: (step: number) => void
}

const majorStepTitles = [
  'Create your Staking Pool',
  'Authorization',
  'Reward distribution',
  'Rewards supply',
  'Time-based parameters',
  'Additional stake conditions',
  'Summary',
]

const minorStepTitles = [
  'Thank you for your interest!',
  'Decide which NFT collections or coins will be staked.',
  'Specify the emission and source of rewards for stakers.',
  'Adjust the amount of rewards per a token staked.',
  'Introduce optional constraints for staking in your pool.',
  'Customize the staking technology for your users.',
  'All steps completed. Please review the details of your Stake Pool below, before you hit the Create button.',
]

export const MasterPanel = ({
  majorStep,
  minorStep,
  setMajorStep,
  setMinorStep,
}: MasterPanelProps) => {
  const [majorStepTitle, setMajorStepTitle] = useState('')
  const [stepSubtitle, setStepSubtitle] = useState('')

  const incrementMajorStep = () => {
    setMinorStep(1)
    setMajorStep(majorStep + 1)
  }

  const incrementMinorStep = () => setMinorStep(minorStep + 1)
  const decrementMinorStep = () => setMinorStep(minorStep - 1)

  const handlePreviousButtonPress = () => {
    switch (majorStep) {
      case 0:
        break
      case 1:
        minorStep > 1 && setMinorStep(minorStep - 1)
        break
      case 2:
        if (minorStep === 1) {
          setMajorStep(majorStep - 1)
          setMinorStep(4)
        } else {
          decrementMinorStep()
        }
        break
      case 3:
        if (minorStep === 1) {
          setMajorStep(majorStep - 1)
          setMinorStep(3)
        } else {
          decrementMinorStep()
        }
        break
      case 4:
        if (minorStep === 1) {
          setMajorStep(majorStep - 1)
          setMinorStep(3)
        } else {
          decrementMinorStep()
        }
        break
      case 5:
        if (minorStep === 1) {
          setMajorStep(majorStep - 1)
          setMinorStep(4)
        } else {
          decrementMinorStep()
        }
        break
      case 6:
        if (minorStep === 1) {
          setMajorStep(majorStep - 1)
          setMinorStep(4)
        } else {
          decrementMinorStep()
        }
        break
    }
  }

  const handleNextButtonPress = () => {
    switch (majorStep) {
      case 0:
        setMajorStep(1)
        setMinorStep(1)
        break
      case 1:
        minorStep === 4 ? incrementMajorStep() : incrementMinorStep()
        break
      case 2:
        minorStep === 3 ? incrementMajorStep() : incrementMinorStep()
        break
      case 3:
        minorStep === 3 ? incrementMajorStep() : incrementMinorStep()
        break
      case 4:
        minorStep === 4 ? incrementMajorStep() : incrementMinorStep()
        break
      case 5:
        minorStep === 4 ? incrementMajorStep() : incrementMinorStep()
        break
      default:
        break
    }
  }

  useEffect(() => {
    const title = majorStepTitles?.[majorStep]
    const subTitle = minorStepTitles?.[majorStep]
    if (!title || !subTitle) return
    setMajorStepTitle(title)
    setStepSubtitle(subTitle)
  }, [majorStep])

  return (
    <div className="w-2/5 space-y-2">
      <HeadingPrimary>{majorStepTitle}</HeadingPrimary>
      <BodyCopy className="pb-2">{stepSubtitle}</BodyCopy>
      {minorStep > 0 && (
        <div className=" pb-16">
          <StepIndicator currentStep={majorStep} />
        </div>
      )}
      <StepContent majorStep={majorStep} minorStep={minorStep} />
      <div className="flex space-x-4">
        {majorStep > 0 && (
          <ButtonPrimary
            onClick={handlePreviousButtonPress}
            width={ButtonWidths.NARROW}
          >
            Previous
          </ButtonPrimary>
        )}
        <ButtonPrimary
          onClick={handleNextButtonPress}
          width={ButtonWidths.NARROW}
        >
          {majorStep === 0 ? 'Start' : 'Next'}
        </ButtonPrimary>
      </div>
    </div>
  )
}
