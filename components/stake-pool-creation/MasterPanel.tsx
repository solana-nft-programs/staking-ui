import { useState } from 'react'

import { Intro } from '@/components/stake-pool-creation/master-panel-content/Intro'
import { StepIndicator } from '@/components/stake-pool-creation/master-panel-content/step-indicator/StepIndicator'
import { ButtonPrimary } from '@/components/UI/buttons/ButtonPrimary'

export const MasterPanel = () => {
  const [step, setStep] = useState(0)

  return (
    <div className="w-1/3 space-y-6">
      {step > 0 && <StepIndicator currentStep={step} />}
      <Intro />
      <ButtonPrimary onClick={() => setStep(step + 1)}>Start</ButtonPrimary>
    </div>
  )
}
