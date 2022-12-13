import { InformationCircleIcon } from '@heroicons/react/24/outline'
import type { FormikHandlers, FormikState, FormikValues } from 'formik'
import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'
import JSONPretty from 'react-json-pretty'

import { SlavePanelScreens } from '@/components/stake-pool-creation/SlavePanel'
import { SelectInput } from '@/components/UI/inputs/SelectInput'
import { LabelText } from '@/components/UI/typography/LabelText'
import { booleanOptions } from '@/types/index'

export type AccessAuthorityInputsProps = {
  setActiveSlavePanelScreen: Dispatch<SetStateAction<SlavePanelScreens>>
  formState: FormikHandlers & FormikState<FormikValues> & FormikValues
}

export const AccessAuthorityInputs = ({
  setActiveSlavePanelScreen,
  formState,
}: AccessAuthorityInputsProps) => {
  const { AUTHORIZATION_3 } = SlavePanelScreens
  const [requireAuthorization, setRequireAuthorization] = useState('no')

  const { values } = formState

  const handleResetOnStakeChange = (value: string) => {
    values.requiresAuthorization = !!(value === 'yes')
    setRequireAuthorization(value)
  }

  return (
    <div className="space-y-2 pt-4">
      <JSONPretty data={values} />
      <div className="flex w-full items-center">
        <LabelText>Require authorization to accesses mint</LabelText>
        <InformationCircleIcon
          className="ml-1 h-6 w-6 cursor-pointer text-gray-400"
          onClick={() => setActiveSlavePanelScreen(AUTHORIZATION_3)}
        />
      </div>
      <SelectInput
        className="mb-6 w-full"
        value={requireAuthorization}
        setValue={handleResetOnStakeChange}
        options={booleanOptions}
      />
    </div>
  )
}
