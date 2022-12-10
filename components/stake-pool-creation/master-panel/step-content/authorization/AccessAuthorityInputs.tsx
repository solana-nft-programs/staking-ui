import { InformationCircleIcon, PlusIcon } from '@heroicons/react/24/outline'
import type { FormikHandlers, FormikState, FormikValues } from 'formik'
import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'

import { SlavePanelScreens } from '@/components/stake-pool-creation/SlavePanel'
import { ButtonLargeWithDottedOutline } from '@/components/UI/buttons/ButtonLargeWithDottedOutline'
import { TextInput } from '@/components/UI/inputs/TextInput'
import { LabelText } from '@/components/UI/typography/LabelText'

export type AccessAuthorityInputsProps = {
  setActiveSlavePanelScreen: Dispatch<SetStateAction<SlavePanelScreens>>
  formState: FormikHandlers & FormikState<FormikValues> & FormikValues
}

export const AccessAuthorityInputs = ({
  setActiveSlavePanelScreen,
  formState,
}: AccessAuthorityInputsProps) => {
  const { AUTHORIZATION_3 } = SlavePanelScreens
  const [displayInput, setDisplayInput] = useState(false)
  const [numberOfAddresses, setNumberOfAddresses] = useState(1)

  const [collectionAddresses, setCollectionAddresses] = useState<string[]>([''])
  return (
    <div className="space-y-2 pt-4">
      <div className="flex w-full items-center">
        <LabelText>Authorize access to specific mint</LabelText>
        <InformationCircleIcon
          className="ml-1 h-6 w-6 cursor-pointer text-gray-400"
          onClick={() => setActiveSlavePanelScreen(AUTHORIZATION_3)}
        />
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
