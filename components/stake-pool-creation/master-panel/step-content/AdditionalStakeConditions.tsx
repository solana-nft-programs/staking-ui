import { InformationCircleIcon } from '@heroicons/react/24/outline'
import type { FormikHandlers, FormikState, FormikValues } from 'formik'
import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useState } from 'react'

import { SlavePanelScreens } from '@/components/stake-pool-creation/SlavePanel'
import { SelectInput } from '@/components/UI/inputs/SelectInput'
import { TextInput } from '@/components/UI/inputs/TextInput'
import { LabelText } from '@/components/UI/typography/LabelText'
import { booleanOptions } from '@/types/index'

const stakeMechanisms = [
  { value: 'receipt', label: 'Receipt' },
  { value: 'original', label: 'Original' },
]

const { ADDITIONAL_STAKE_CONDITIONS_2, ADDITIONAL_STAKE_CONDITIONS_3 } =
  SlavePanelScreens

export type AdditionalStakeConditionsProps = {
  setActiveSlavePanelScreen: Dispatch<SetStateAction<SlavePanelScreens>>
  formState: FormikHandlers & FormikState<FormikValues> & FormikValues
}

export const AdditionalStakeConditions = ({
  setActiveSlavePanelScreen,
  formState,
}: AdditionalStakeConditionsProps) => {
  const { values, handleChange } = formState
  const [resetOnStake, setResetOnStake] = useState('')

  const handleResetOnStakeChange = (value: string) => {
    values.resetOnStake = !!(value === 'yes')
    setResetOnStake(value)
  }

  useEffect(() => {
    setResetOnStake(values.resetOnStake ? 'yes' : 'no')
  }, [values.resetOnStake])

  return (
    <>
      <div className="mb-2 flex w-full items-center">
        <LabelText>Overlay text</LabelText>
        <InformationCircleIcon
          className="ml-1 h-6 w-6 cursor-pointer text-gray-400"
          onClick={() =>
            setActiveSlavePanelScreen(ADDITIONAL_STAKE_CONDITIONS_2)
          }
        />
      </div>
      <TextInput
        className="mb-6"
        value={values.overlayText}
        onChange={handleChange}
      />
      <div className="mb-2 flex w-full items-center">
        <LabelText>Reset on stake</LabelText>
        <InformationCircleIcon
          className="ml-1 h-6 w-6 cursor-pointer text-gray-400"
          onClick={() =>
            setActiveSlavePanelScreen(ADDITIONAL_STAKE_CONDITIONS_3)
          }
        />
      </div>
      <SelectInput
        className="mb-6 w-full"
        value={resetOnStake}
        setValue={handleResetOnStakeChange}
        options={booleanOptions}
      />
    </>
  )
}
