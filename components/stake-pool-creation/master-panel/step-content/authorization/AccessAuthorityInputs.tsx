import { InformationCircleIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

import { ButtonLargeWithDottedOutline } from '@/components/UI/buttons/ButtonLargeWithDottedOutline'
import { TextInput } from '@/components/UI/inputs/TextInput'
import { LabelText } from '@/components/UI/typography/LabelText'

export const AccessAuthorityInputs = () => {
  const [displayInput, setDisplayInput] = useState(false)
  const [numberOfAddresses, setNumberOfAddresses] = useState(1)

  const [collectionAddresses, setCollectionAddresses] = useState<string[]>([''])
  return (
    <div className="space-y-2">
      <div className="flex w-full items-center">
        <LabelText>NFT collection address</LabelText>
        <InformationCircleIcon className="ml-1 h-6 w-6 cursor-pointer text-gray-400" />
      </div>
      {displayInput ? (
        <>
          {Array.from(Array(numberOfAddresses).keys()).map((i) => (
            <div className="pb-1" key={i}>
              <TextInput
                value={collectionAddresses[i] || ''}
                onChange={(e) => {
                  const newCreatorAddresses = [...collectionAddresses]
                  newCreatorAddresses[i] = e.target.value
                  setCollectionAddresses(newCreatorAddresses)
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
        </>
      ) : (
        <div className="pb-6">
          <ButtonLargeWithDottedOutline onClick={() => setDisplayInput(true)}>
            <PlusIcon className="h-6 w-6" />
            <div>Add address</div>
          </ButtonLargeWithDottedOutline>
        </div>
      )}
    </div>
  )
}
