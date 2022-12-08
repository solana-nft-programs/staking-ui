import { useState } from 'react'

import { MasterPanel } from '@/components/stake-pool-creation/master-panel/MasterPanel'
import { SlavePanel } from '@/components/stake-pool-creation/SlavePanel'

export const StakePoolCreationFlow = () => {
  const [currentStep, setCurrentStep] = useState(0)

  return (
    <div className="mb-8 flex w-full py-8 px-10">
      <MasterPanel currentStep={currentStep} setCurrentStep={setCurrentStep} />
      <SlavePanel currentStep={currentStep} />
    </div>
  )
}
