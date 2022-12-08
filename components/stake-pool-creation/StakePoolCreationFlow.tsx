import { useState } from 'react'

import { MasterPanel } from '@/components/stake-pool-creation/MasterPanel'
import { SlavePanel } from '@/components/stake-pool-creation/SlavePanel'

export const StakePoolCreationFlow = () => {
  const [majorStep, setMajorStep] = useState(0)
  const [minorStep, setMinorStep] = useState(0)

  return (
    <div className="mb-8 flex w-full py-8 px-10">
      <MasterPanel
        majorStep={majorStep}
        minorStep={minorStep}
        setMajorStep={setMajorStep}
        setMinorStep={setMinorStep}
      />
      <SlavePanel majorStep={majorStep} minorStep={minorStep} />
    </div>
  )
}
