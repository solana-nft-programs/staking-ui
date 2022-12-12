import { InformationCircleIcon, PlusIcon } from '@heroicons/react/24/outline'
import type { FormikHandlers, FormikState, FormikValues } from 'formik'
import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'

import { SlavePanelScreens } from '@/components/stake-pool-creation/SlavePanel'
import { ButtonLargeWithDottedOutline } from '@/components/UI/buttons/ButtonLargeWithDottedOutline'
import { TextInput } from '@/components/UI/inputs/TextInput'
import { LabelText } from '@/components/UI/typography/LabelText'

export type CreatorAddressInputsProps = {
  setActiveSlavePanelScreen: Dispatch<SetStateAction<SlavePanelScreens>>
  formState: FormikHandlers & FormikState<FormikValues> & FormikValues
}

export const CreatorAddressInputs = ({
  setActiveSlavePanelScreen,
  formState,
}: CreatorAddressInputsProps) => {
  const { AUTHORIZATION_1 } = SlavePanelScreens
  const { setFieldValue, values } = formState
  const [displayInput, setDisplayInput] = useState(false)
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
          <div className="pb-1">
            <TextInput
              placeholder="CmAy...A3fD"
              value={values.requireCreators[0]}
              onChange={(e) => {
                setFieldValue('requireCreators[0]', e.target.value)
              }}
            />
          </div>

          <div className="flex w-full justify-end">
            <button
              className="text-sm text-orange-500"
              onClick={() =>
                setFieldValue(`requireCreators`, [
                  '',
                  ...values.requireCreators,
                ])
              }
            >
              + Add more
            </button>
          </div>
          {values.requireCreators.map(
            (address: string, i: number) =>
              i > 0 && (
                <>
                  <div className="pb-1" key={i}>
                    <TextInput
                      placeholder="CmAy...A3fD"
                      onChange={(e) => {
                        setFieldValue(`requireCreators[${i}]`, e.target.value)
                      }}
                      value={address}
                    />
                  </div>
                  <div className="flex w-full justify-end">
                    <button
                      className="text-sm text-orange-500"
                      onClick={() =>
                        setFieldValue(
                          `requireCreators`,
                          values.requireCreators.filter(
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
