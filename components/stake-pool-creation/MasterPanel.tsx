import { useEffect, useState } from 'react'

import { Intro } from '@/components/stake-pool-creation/master-panel-content/Intro'
import { StepIndicator } from '@/components/stake-pool-creation/master-panel-content/step-indicator/StepIndicator'
import { ButtonPrimary } from '@/components/UI/buttons/ButtonPrimary'
import { HeadingPrimary } from '@/components/UI/typography/HeadingPrimary'
import { ButtonWidths } from '@/types/index'

export type MasterPanelProps = {
  majorStep: number
  minorStep: number
  setMajorStep: (step: number) => void
  setMinorStep: (step: number) => void
}

export const MasterPanel = ({
  majorStep,
  minorStep,
  setMajorStep,
  setMinorStep,
}: MasterPanelProps) => {
  const [majorStepTitle, setMajorStepTitle] = useState('')

  const incrementMajorStep = () => {
    setMinorStep(1)
    setMajorStep(majorStep + 1)
  }

  const incrementMinorStep = () => setMinorStep(minorStep + 1)

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
          setMinorStep(minorStep - 1)
        }
        break
      case 3:
        if (minorStep === 1) {
          setMajorStep(majorStep - 1)
          setMinorStep(3)
        } else {
          setMinorStep(minorStep - 1)
        }
        break
      case 4:
        if (minorStep === 1) {
          setMajorStep(majorStep - 1)
          setMinorStep(3)
        } else {
          setMinorStep(minorStep - 1)
        }
        break
      case 5:
        if (minorStep === 1) {
          setMajorStep(majorStep - 1)
          setMinorStep(4)
        } else {
          setMinorStep(minorStep - 1)
        }
        break
      case 6:
        if (minorStep === 1) {
          setMajorStep(majorStep - 1)
          setMinorStep(4)
        } else {
          setMinorStep(minorStep - 1)
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
    switch (majorStep) {
      case 0:
        setMajorStepTitle('Create your staking pool')
        break
      case 1:
        setMajorStepTitle('Authorization')
        break
      case 2:
        setMajorStepTitle('Reward distribution')
        break
      case 3:
        setMajorStepTitle('Rewards supply')
        break
      case 4:
        setMajorStepTitle('Time-based parameters')
        break
      case 5:
        setMajorStepTitle('Additional stake conditions')
        break
    }
  }, [majorStep])

  return (
    <div className="w-1/3 space-y-6">
      <HeadingPrimary>{majorStepTitle}</HeadingPrimary>
      {majorStep === 0 && <Intro />}
      {minorStep > 0 && (
        <div className="pb-16">
          <StepIndicator currentStep={majorStep} />
        </div>
      )}
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
