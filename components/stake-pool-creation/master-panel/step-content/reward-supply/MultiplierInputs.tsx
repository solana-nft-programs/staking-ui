import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'

import { MultiplierInput } from '@/components/stake-pool-creation/master-panel/step-content/reward-supply/MultiplierInput'
import type { SlavePanelScreens } from '@/components/stake-pool-creation/SlavePanel'

export type MultiplierInputsProps = {
  setActiveSlavePanelScreen: Dispatch<SetStateAction<SlavePanelScreens>>
}

export const MultiplierInputs = ({
  setActiveSlavePanelScreen,
}: MultiplierInputsProps) => {
  const [multiplier, setMultiplier] = useState('1')
  const [address, setAddress] = useState('')

  return (
    <>
      <MultiplierInput
        setActiveSlavePanelScreen={setActiveSlavePanelScreen}
        multiplier={multiplier}
        setMultiplier={setMultiplier}
        address={address}
        setAddress={setAddress}
      />
    </>
  )
}
