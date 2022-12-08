import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { TextInput } from '@/components/UI/inputs/TextInput'
import { LabelText } from '@/components/UI/typography/LabelText'
import { useState } from 'react'

export const CreatorAddressInputs = () => {
  // const [displayInput, setDisplayInput] = useState(false)
  const [numberOfAddresses, setNumberOfAddresses] = useState(1)

  const [creatorAddresses, setCreatorAddresses] = useState<string[]>([''])
  return (
    <div className="space-y-2">
      <div className="flex w-full items-center">
        <LabelText>Creator Address</LabelText>
        <InformationCircleIcon className="ml-1 h-6 w-6 cursor-pointer text-gray-400" />
      </div>
      {Array.from(Array(numberOfAddresses).keys()).map((i) => (
        <div className="pb-1" key={i}>
          <TextInput
            value={creatorAddresses[i] || ''}
            onChange={(e) => {
              const newCreatorAddresses = [...creatorAddresses]
              newCreatorAddresses[i] = e.target.value
              setCreatorAddresses(newCreatorAddresses)
            }}
          />
        </div>
      ))}
      <div className="flex w-full justify-end pb-4">
        <button
          className="text-sm text-orange-500"
          onClick={() => setNumberOfAddresses(numberOfAddresses + 1)}
        >
          + Add more
        </button>
      </div>
      {/*
      <div
        className="flex cursor-pointer items-center justify-center space-x-2 rounded-2xl border border-dashed border-gray-500 bg-gray-800 p-8 text-gray-500"
        onClick={() => setDisplayInput(true)}
      >
        <PlusIcon className="h-6 w-6" />
        <div>Add address</div>
      </div>
      */}
    </div>
  )
}
