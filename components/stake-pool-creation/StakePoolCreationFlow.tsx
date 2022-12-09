import { useState } from 'react'

import { MasterPanel } from '@/components/stake-pool-creation/master-panel/MasterPanel'
import {
  SlavePanel,
  SlavePanelScreens,
} from '@/components/stake-pool-creation/SlavePanel'

const { INTRO } = SlavePanelScreens

export const StakePoolCreationFlow = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [activeSlavePanelScreen, setActiveSlavePanelScreen] =
    useState<SlavePanelScreens>(INTRO)

  return (
    <div className="mb-8 flex w-full py-8 px-10">
      <MasterPanel
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        setActiveSlavePanelScreen={setActiveSlavePanelScreen}
      />
      <SlavePanel activeScreen={activeSlavePanelScreen} />
    </div>
  )
}
