import { MultiplierInput } from '@/components/stake-pool-creation/master-panel/step-content/reward-supply/MultiplierInput'
import { useState } from 'react'

export const MultiplierInputs = () => {
  const [multiplier, setMultiplier] = useState('1')
  const [address, setAddress] = useState('')
  const [numberOfMints, setNumberOfMints] = useState(1)

  return (
    <>
      <MultiplierInput
        multiplier={multiplier}
        setMultiplier={setMultiplier}
        address={address}
        setAddress={setAddress}
      />
    </>
  )
}
