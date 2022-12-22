import type { FormikHandlers, FormikState, FormikValues } from 'formik'
import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useState } from 'react'

import { SlavePanelScreens } from '@/components/stake-pool-creation/SlavePanel'
import { InfoTipButtons } from '@/components/UI/buttons/InfoTipButtons'
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
        <LabelText isOptional>Mint list enabled?</LabelText>
        <InfoTipButtons
          setActiveScreen={setActiveSlavePanelScreen}
          screen={AUTHORIZATION_3}
          activeScreen={activeSlavePanelScreen}
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
