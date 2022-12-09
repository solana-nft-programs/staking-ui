import { InformationCircleIcon, PlusIcon } from '@heroicons/react/24/outline'
import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'

import { SlavePanelScreens } from '@/components/stake-pool-creation/SlavePanel'
import { ButtonLargeWithDottedOutline } from '@/components/UI/buttons/ButtonLargeWithDottedOutline'
import { TextInput } from '@/components/UI/inputs/TextInput'
import { LabelText } from '@/components/UI/typography/LabelText'

export type CollectionAddressInputsProps = {
  setActiveSlavePanelScreen: Dispatch<SetStateAction<SlavePanelScreens>>
}

export const CollectionAddressInputs = ({
  setActiveSlavePanelScreen,
}: CollectionAddressInputsProps) => {
  const [displayInput, setDisplayInput] = useState(false)
  const [numberOfAddresses, setNumberOfAddresses] = useState(1)
  const { AUTHORIZATION_2 } = SlavePanelScreens

  const [authorizedMintAddresses, setAuthorizedMintAddresses] = useState<
    string[]
  >([''])
  return (
    <div className="space-y-2">
      <div className="flex w-full items-center">
        <LabelText>Authorize access to specific mint</LabelText>
        <InformationCircleIcon
          className="ml-1 h-6 w-6 cursor-pointer text-gray-400"
          onClick={() => setActiveSlavePanelScreen(AUTHORIZATION_2)}
        />
      </div>
      {displayInput ? (
        <>
          {Array.from(Array(numberOfAddresses).keys()).map((i) => (
            <div className="pb-1" key={i}>
              <TextInput
                value={authorizedMintAddresses[i] || ''}
                onChange={(e) => {
                  const newAuthorizedMintAddresses = [
                    ...authorizedMintAddresses,
                  ]
                  newAuthorizedMintAddresses[i] = e.target.value
                  setAuthorizedMintAddresses(newAuthorizedMintAddresses)
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
