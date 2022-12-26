import type { FormikHandlers, FormikState, FormikValues } from 'formik'
import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useState } from 'react'

import { SlavePanelScreens } from '@/components/stake-pool-creation/SlavePanel'
import { InfoTipButtons } from '@/components/UI/buttons/InfoTipButtons'
import { DateInput } from '@/components/UI/inputs/DateInput'
import { DurationInput } from '@/components/UI/inputs/DurationInput'
import { SelectInput } from '@/components/UI/inputs/SelectInput'
import { LabelText } from '@/components/UI/typography/LabelText'
import { booleanOptions } from '@/types/index'

export type AdditionalFeaturesProps = {
  setActiveSlavePanelScreen: Dispatch<SetStateAction<SlavePanelScreens>>
  formState: FormikHandlers & FormikState<FormikValues> & FormikValues
  activeSlavePanelScreen: SlavePanelScreens
}

const {
  TIME_BASED_PARAMETERS_1,
  TIME_BASED_PARAMETERS_2,
  ADDITIONAL_STAKE_CONDITIONS_3,
  TIME_BASED_PARAMETERS_4,
} = SlavePanelScreens

export const AdditionalFeatures = ({
  setActiveSlavePanelScreen,
  formState,
  activeSlavePanelScreen,
}: AdditionalFeaturesProps) => {
  const [resetOnStake, setResetOnStake] = useState('')
  const { values, setFieldValue } = formState

  const handleResetOnStakeChange = (value: string) => {
    values.resetOnStake = !!(value === 'yes')
    setResetOnStake(value)
  }

  useEffect(() => {
    setResetOnStake(values.resetOnStake ? 'yes' : 'no')
  }, [values.resetOnStake])

  return (
    <div className="flex flex-col gap-6 pb-14">
      <div>
        <div className="mb-2 flex w-full items-center">
          <LabelText isOptional>Minimum stake duration</LabelText>
          <InfoTipButtons
            setActiveScreen={setActiveSlavePanelScreen}
            screen={TIME_BASED_PARAMETERS_1}
            activeScreen={activeSlavePanelScreen}
          />
        </div>
        <DurationInput
          defaultAmount={values.minStakeSeconds ?? null}
          defaultOption={'seconds'}
          handleChange={(v) => setFieldValue('minStakeSeconds', v)}
        />
      </div>
      <div>
        <div className="mb-2 flex w-full items-center">
          <LabelText isOptional>Cooldown period</LabelText>
          <InfoTipButtons
            setActiveScreen={setActiveSlavePanelScreen}
            screen={TIME_BASED_PARAMETERS_2}
            activeScreen={activeSlavePanelScreen}
          />
        </div>
        <DurationInput
          defaultAmount={values.cooldownPeriodSeconds ?? null}
          defaultOption={'seconds'}
          handleChange={(v) => setFieldValue('cooldownPeriodSeconds', v)}
        />
      </div>
      <div>
        <div className="mb-2 flex w-full items-center">
          <LabelText isOptional>Reset on stake</LabelText>
          <InfoTipButtons
            setActiveScreen={setActiveSlavePanelScreen}
            screen={ADDITIONAL_STAKE_CONDITIONS_3}
            activeScreen={activeSlavePanelScreen}
          />
        </div>
        <SelectInput
          className="w-full"
          value={resetOnStake}
          setValue={handleResetOnStakeChange}
          options={booleanOptions}
        />
      </div>
      <div>
        <div className="mb-2 flex w-full items-center">
          <LabelText isOptional>End date</LabelText>
          <InfoTipButtons
            setActiveScreen={setActiveSlavePanelScreen}
            screen={TIME_BASED_PARAMETERS_4}
            activeScreen={activeSlavePanelScreen}
          />
        </div>
        <DateInput
          placeholder="Select date and time"
          value={values.endDate}
          setValue={(v) => {
            console.log(v)
            setFieldValue('endDate', v)
          }}
        />
      </div>
    </div>
  )
}
