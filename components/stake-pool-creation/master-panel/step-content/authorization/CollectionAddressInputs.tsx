import { InformationCircleIcon, PlusIcon } from '@heroicons/react/24/outline'
import type { FormikHelpers, FormikState, FormikValues } from 'formik'
import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'

import { SlavePanelScreens } from '@/components/stake-pool-creation/SlavePanel'
import { ButtonLargeWithDottedOutline } from '@/components/UI/buttons/ButtonLargeWithDottedOutline'
import { TextInput } from '@/components/UI/inputs/TextInput'
import { LabelText } from '@/components/UI/typography/LabelText'

export type CollectionAddressInputsProps = {
  setActiveSlavePanelScreen: Dispatch<SetStateAction<SlavePanelScreens>>
  formState: FormikHelpers<FormikValues> & FormikState<FormikValues>
}

export const CollectionAddressInputs = ({
  setActiveSlavePanelScreen,
  formState,
}: CollectionAddressInputsProps) => {
  const [displayInput, setDisplayInput] = useState(false)
  const { AUTHORIZATION_2 } = SlavePanelScreens
  const { setFieldValue, values } = formState

  return (
    <div className="space-y-2 pt-4">
      <div className="flex w-full items-center">
        <LabelText>NFT collection address</LabelText>
        <InformationCircleIcon
          className="ml-1 h-6 w-6 cursor-pointer text-gray-400"
          onClick={() => setActiveSlavePanelScreen(AUTHORIZATION_2)}
        />
      </div>
      {displayInput ? (
        <>
          <div className="pb-1">
            <TextInput
              placeholder="CmAy...A3fD"
              value={values.requireCollections[0]}
              onChange={(e) => {
                setFieldValue('requireCollections[0]', e.target.value)
              }}
            />
          </div>
          <div className="flex w-full justify-end">
            <button
              className="text-sm text-orange-500"
              onClick={() =>
                setFieldValue(`requireCollections`, [
                  '',
                  ...values.requireCollections,
                ])
              }
            >
              + Add more
            </button>
          </div>
          {values.requireCollections.map(
            (address: string, i: number) =>
              i > 0 && (
                <>
                  <div className="pb-1" key={i}>
                    <TextInput
                      placeholder="CmAy...A3fD"
                      onChange={(e) => {
                        setFieldValue(
                          `requireCollections[${i}]`,
                          e.target.value
                        )
                      }}
                      value={address}
                    />
                  </div>
                  <div className="flex w-full justify-end">
                    <button
                      className="text-sm text-orange-500"
                      onClick={() =>
                        setFieldValue(
                          `requireCollections`,
                          values.requireCollections.filter(
                            (_: string, ix: number) => ix !== i
                          )
                        )
                      }
                    >
                      - Remove
                    </button>
                  </div>
                </>
              )
          )}
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
