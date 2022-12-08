import { NumberInput } from '@/components/UI/inputs/NumberInput'

import { useState } from 'react'

export const NumberInputWithDropdown = () => {
  const [numberInputValue, setNumberInputValue] = useState('')

  return (
    <div className="flex">
      <NumberInput
        value={numberInputValue}
        onChange={(e) => setNumberInputValue(e.target.value)}
      />
    </div>
  )
}
