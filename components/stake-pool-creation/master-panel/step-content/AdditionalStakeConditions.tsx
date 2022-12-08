import { SelectInput } from '@/components/UI/inputs/SelectInput'
import { TextInput } from '@/components/UI/inputs/TextInput'
import { LabelText } from '@/components/UI/typography/LabelText'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

const stakeMechanisms = [
  { value: 'receipt', label: 'Receipt' },
  { value: 'option2', label: 'Option2' },
]

const booleanOptions = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
]

export const AdditionalStakeConditions = () => {
  const [overlayText, setOverlayText] = useState('')
  const [stakeMechanism, setStakeMechanism] = useState(
    stakeMechanisms[0]?.value
  )
  const [resetOnStake, setResetOnStake] = useState(booleanOptions[0]?.value)
  return (
    <>
      <div className="mb-2 flex w-full items-center">
        <LabelText>Stake mechanism</LabelText>
        <InformationCircleIcon className="ml-1 h-6 w-6 cursor-pointer text-gray-400" />
      </div>
      <SelectInput
        className="mb-6 w-full"
        value={stakeMechanism || ''}
        setValue={setStakeMechanism}
        options={stakeMechanisms}
      />
      <div className="mb-2 flex w-full items-center">
        <LabelText>Overlay text</LabelText>
        <InformationCircleIcon className="ml-1 h-6 w-6 cursor-pointer text-gray-400" />
      </div>
      <TextInput
        className="mb-6"
        value={overlayText}
        onChange={(e) => setOverlayText(e.target.value)}
      />
      <div className="mb-2 flex w-full items-center">
        <LabelText>Reset on stake</LabelText>
        <InformationCircleIcon className="ml-1 h-6 w-6 cursor-pointer text-gray-400" />
      </div>
      <SelectInput
        className="mb-6 w-full"
        value={resetOnStake || ''}
        setValue={setResetOnStake}
        options={booleanOptions}
      />
    </>
  )
}
