import { PlusIcon } from '@heroicons/react/24/outline'
import type { FormikHandlers, FormikState, FormikValues } from 'formik'
import type { Dispatch, SetStateAction } from 'react'
import { Fragment, useState } from 'react'

import { SlavePanelScreens } from '@/components/stake-pool-creation/SlavePanel'
import { ButtonLargeWithDottedOutline } from '@/components/UI/buttons/ButtonLargeWithDottedOutline'
import { InfoTipButtons } from '@/components/UI/buttons/InfoTipButtons'
import { TextInput } from '@/components/UI/inputs/TextInput'
import { LabelText } from '@/components/UI/typography/LabelText'

export type CreatorAddressInputsProps = {
  activeSlavePanelScreen: SlavePanelScreens
  setActiveSlavePanelScreen: Dispatch<SetStateAction<SlavePanelScreens>>
  formState: FormikHandlers & FormikState<FormikValues> & FormikValues
}

export const CreatorAddressInputs = ({
  activeSlavePanelScreen,
  setActiveSlavePanelScreen,
  formState,
}: CreatorAddressInputsProps) => {
  const { AUTHORIZATION_1 } = SlavePanelScreens
  const { setFieldValue, values, errors } = formState
  const [displayInput, setDisplayInput] = useState(false)

  const { requireCreators: requireCreatorsErrors } = errors as {
    requireCreators: string | string[]
  }

  return (
    <div className="space-y-2">
      <div className="flex w-full items-center">
        <LabelText isOptional>Creator address</LabelText>
        <InfoTipButtons
          setActiveScreen={setActiveSlavePanelScreen}
          screen={AUTHORIZATION_1}
          activeScreen={activeSlavePanelScreen}
        />
      </div>
      {displayInput || values.requireCreators.length > 0 ? (
        <>
          <div className="pb-1">
            <TextInput
              placeholder="CmAy...A3fD"
              value={values.requireCreators[0]}
              hasError={!!requireCreatorsErrors && !!requireCreatorsErrors[0]}
              onChange={(e) => {
                setFieldValue('requireCreators[0]', e.target.value)
              }}
            />
          </div>

          <div className="flex w-full justify-end space-x-3">
            {values.requireCreators.length <= 1 && (
              <button
                className="text-sm text-gray-400"
                onClick={() => {
                  setFieldValue(`requireCreators`, [])
                  setDisplayInput(false)
                }}
              >
                Cancel
              </button>
            )}
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
                <Fragment key={i}>
                  <div className="pb-1" key={i}>
                    <TextInput
                      placeholder="CmAy...A3fD"
                      hasError={
                        !!requireCreatorsErrors && !!requireCreatorsErrors[i]
                      }
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
                </Fragment>
              )
          )}
        </>
      ) : (
        <ButtonLargeWithDottedOutline onClick={() => setDisplayInput(true)}>
          <PlusIcon className="h-6 w-6" />
          <div>Add address</div>
        </ButtonLargeWithDottedOutline>
      )}
    </div>
  )
}
