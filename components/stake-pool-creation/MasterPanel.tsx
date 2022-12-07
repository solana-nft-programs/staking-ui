import { useState } from 'react'

import { Intro } from '@/components/stake-pool-creation/master-panel-content/Intro'
import { StepIndicator } from '@/components/stake-pool-creation/master-panel-content/step-indicator/StepIndicator'
import { ButtonPrimary } from '@/components/UI/buttons/ButtonPrimary'

export const MasterPanel = () => {
  const [majorStep, setMajorStep] = useState(0)
  const [minorStep, setMinorStep] = useState(0)

  const incrementMajorStep = () => {
    setMinorStep(1)
    setMajorStep(majorStep + 1)
  }

  const incrementMinorStep = () => setMinorStep(minorStep + 1)

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

  return (
    <div className="w-1/3 space-y-6">
      {majorStep === 0 && <Intro />}
      {minorStep > 0 && <StepIndicator currentStep={majorStep} />}
      <div className="flex">
        <ButtonPrimary onClick={handleNextButtonPress}>
          {majorStep === 0 ? 'Start' : 'Next'}
        </ButtonPrimary>
      </div>
    </div>
  )
}
