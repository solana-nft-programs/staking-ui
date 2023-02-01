import { SelectorBoolean } from 'common/SelectorBoolean'
import type { FormikHandlers, FormikState, FormikValues } from 'formik'
import type { Dispatch, SetStateAction } from 'react'

import { SlavePanelScreens } from '@/components/stake-pool-creation/SlavePanel'
import { InfoTipButtons } from '@/components/UI/buttons/InfoTipButtons'
import { LabelText } from '@/components/UI/typography/LabelText'

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

  const { setFieldValue } = formState

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
      <SelectorBoolean
        handleChange={(v) => setFieldValue('requiresAuthorization', v)}
      />
    </div>
  )
}
