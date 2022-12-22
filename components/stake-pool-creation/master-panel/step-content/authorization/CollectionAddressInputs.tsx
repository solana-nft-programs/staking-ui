import { PlusIcon } from '@heroicons/react/24/outline'
import type {
  FormikErrors,
  FormikHandlers,
  FormikState,
  FormikValues,
} from 'formik'
import type { Dispatch, SetStateAction } from 'react'
import { Fragment, useState } from 'react'

import { SlavePanelScreens } from '@/components/stake-pool-creation/SlavePanel'
import { ButtonLargeWithDottedOutline } from '@/components/UI/buttons/ButtonLargeWithDottedOutline'
import { InfoTipButtons } from '@/components/UI/buttons/InfoTipButtons'
import { TextInput } from '@/components/UI/inputs/TextInput'
import { LabelText } from '@/components/UI/typography/LabelText'

export type CollectionAddressInputsProps = {
  activeSlavePanelScreen: SlavePanelScreens
  setActiveSlavePanelScreen: Dispatch<SetStateAction<SlavePanelScreens>>
  formState: FormikHandlers &
    FormikState<FormikValues> &
    FormikValues &
    FormikErrors<FormikValues>
}

export const CollectionAddressInputs = ({
  activeSlavePanelScreen,
  setActiveSlavePanelScreen,
  formState,
}: CollectionAddressInputsProps) => {
  const [displayInput, setDisplayInput] = useState(false)
  const { AUTHORIZATION_2 } = SlavePanelScreens
  const { setFieldValue, values, errors } = formState

  const { requireCollections: requireCollectionsErrors } = errors as {
    requireCollections: string | string[]
  }

  return (
    <div className="space-y-2 pt-4">
      <div className="flex w-full items-center">
        <LabelText isOptional>NFT collection address</LabelText>
        <InfoTipButtons
          setActiveScreen={setActiveSlavePanelScreen}
          screen={AUTHORIZATION_2}
          activeScreen={activeSlavePanelScreen}
        />
      </div>
      {displayInput || values.requireCollections.length > 0 ? (
        <>
          <div className="pb-1">
            <TextInput
              placeholder="CmAy...A3fD"
              value={values.requireCollections[0]}
              hasError={
                !!requireCollectionsErrors && !!requireCollectionsErrors[0]
              }
              onChange={(e) => {
                setFieldValue('requireCollections[0]', e.target.value)
              }}
            />
          </div>
          <div className="flex w-full justify-end space-x-3">
            {values.requireCollections.length <= 1 && (
              <button
                className="text-sm text-gray-400"
                onClick={() => {
                  setFieldValue(`requireCollections`, [])
                  setDisplayInput(false)
                }}
              >
                Cancel
              </button>
            )}
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
                <Fragment key={i}>
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
