import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { InformationCircleIcon as InformationCircleIconSolid } from '@heroicons/react/24/solid'
import type { FormikHandlers, FormikState, FormikValues } from 'formik'
import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useState } from 'react'

import { SlavePanelScreens } from '@/components/stake-pool-creation/SlavePanel'
import { SelectInput } from '@/components/UI/inputs/SelectInput'
import { LabelText } from '@/components/UI/typography/LabelText'
import { booleanOptions } from '@/types/index'

export type AccessAuthorityInputsProps = {
  activeSlavePanelScreen: SlavePanelScreens
  setActiveSlavePanelScreen: Dispatch<SetStateAction<SlavePanelScreens>>
  formState: FormikHandlers & FormikState<FormikValues> & FormikValues
}

export const AccessAuthorityInputs = ({
  activeSlavePanelScreen,
  setActiveSlavePanelScreen,
  formState,
}: AccessAuthorityInputsProps) => {
  const { AUTHORIZATION_3 } = SlavePanelScreens
  const [requireAuthorization, setRequireAuthorization] = useState('')

  const { values } = formState

  const handleResetOnStakeChange = (value: string) => {
    values.requiresAuthorization = !!(value === 'yes')
    setRequireAuthorization(value)
  }

  useEffect(() => {
    setRequireAuthorization(values.requiresAuthorization ? 'yes' : 'no')
  }, [values.requiresAuthorization])

  return (
    <div className="space-y-2 pt-4">
      <div className="flex w-full items-center">
        <LabelText>Mint list enabled?</LabelText>
        {activeSlavePanelScreen === AUTHORIZATION_3 ? (
          <InformationCircleIconSolid className="ml-1 h-6 w-6 cursor-pointer rounded-full border border-orange-500 text-orange-500" />
        ) : (
          <InformationCircleIcon
            className="ml-1 h-6 w-6 cursor-pointer text-gray-400"
            onClick={() => setActiveSlavePanelScreen(AUTHORIZATION_3)}
          />
        )}
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
