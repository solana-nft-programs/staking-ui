import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

import { RadioGroup } from '@/components/UI/inputs/RadioGroup'
import { TextInput } from '@/components/UI/inputs/TextInput'
import { LabelText } from '@/components/UI/typography/LabelText'
import type { RadioGroupOption } from '@/types/index'

const options = [
  {
    name: 'Transfer',
    value: 'transfer',
  },
  {
    name: 'Mint',
    value: 'mint',
  },
]

export const RewardDistribution = () => {
  const [mintAddress, setMintAddress] = useState('')
  const [transferAmount, setTransferAmount] = useState('')
  const [selected, setSelected] = useState<RadioGroupOption>(
    options[0] as RadioGroupOption
  )

  return (
    <>
      <div className="pb-6">
        <div className="mb-2 flex w-full items-center">
          <LabelText>How will the rewards be distributed to stakers?</LabelText>
          <InformationCircleIcon className="ml-1 h-6 w-6 cursor-pointer text-gray-400" />
        </div>
        <RadioGroup
          options={options}
          selected={selected}
          setSelected={setSelected}
        />
      </div>
      <div className="pb-6">
        <div className="mb-2 flex w-full items-center">
          <LabelText>Rewards mint address</LabelText>
          <InformationCircleIcon className="ml-1 h-6 w-6 cursor-pointer text-gray-400" />
        </div>
        <TextInput
          value={mintAddress}
          onChange={(e) => setMintAddress(e.target.value)}
        />
      </div>
      <div className="mb-2 flex w-full items-center">
        <LabelText>Reward transfer amount</LabelText>
        <InformationCircleIcon className="ml-1 h-6 w-6 cursor-pointer text-gray-400" />
      </div>
      <TextInput
        value={transferAmount}
        onChange={(e) => setTransferAmount(e.target.value)}
      />
    </>
  )
}
