import { InformationCircleIcon, PlusIcon } from '@heroicons/react/24/outline'
import type { FormikHelpers, FormikState, FormikValues } from 'formik'
import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'

import { SlavePanelScreens } from '@/components/stake-pool-creation/SlavePanel'
import { ButtonLargeWithDottedOutline } from '@/components/UI/buttons/ButtonLargeWithDottedOutline'
import { TextInput } from '@/components/UI/inputs/TextInput'
import { LabelText } from '@/components/UI/typography/LabelText'

export type CreatorAddressInputsProps = {
  setActiveSlavePanelScreen: Dispatch<SetStateAction<SlavePanelScreens>>
  formState: FormikHelpers<FormikValues> & FormikState<FormikValues>
}

export const CreatorAddressInputs = ({
  setActiveSlavePanelScreen,
  formState,
}: CreatorAddressInputsProps) => {
  const { AUTHORIZATION_1 } = SlavePanelScreens
  const [displayInput, setDisplayInput] = useState(false)
  const [numberOfAddresses, setNumberOfAddresses] = useState(1)

  const [creatorAddresses, setCreatorAddresses] = useState<string[]>([''])
  return (
    <div className="space-y-2">
      <div className="flex w-full items-center">
        <LabelText>Creator address</LabelText>
        <InformationCircleIcon
          className="ml-1 h-6 w-6 cursor-pointer text-gray-400"
          onClick={() => setActiveSlavePanelScreen(AUTHORIZATION_1)}
        />
      </div>
      {displayInput ? (
        <>
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
