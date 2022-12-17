import { InformationCircleIcon } from '@heroicons/react/24/outline'
import type { FormikHandlers, FormikState, FormikValues } from 'formik'
import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useState } from 'react'

import { SlavePanelScreens } from '@/components/stake-pool-creation/SlavePanel'
import { DateInput } from '@/components/UI/inputs/DateInput'
import { DurationInput } from '@/components/UI/inputs/DurationInput'
import { SelectInput } from '@/components/UI/inputs/SelectInput'
import { LabelText } from '@/components/UI/typography/LabelText'
import { booleanOptions } from '@/types/index'

export type AdditionalFeaturesProps = {
  setActiveSlavePanelScreen: Dispatch<SetStateAction<SlavePanelScreens>>
  formState: FormikHandlers & FormikState<FormikValues> & FormikValues
}

export const AdditionalFeatures = ({
  setActiveSlavePanelScreen,
  formState,
}: AdditionalFeaturesProps) => {
  const [resetOnStake, setResetOnStake] = useState('no')
  const handleResetOnStakeChange = (value: string) => {
    values.resetOnStake = !!(value === 'yes')
    setResetOnStake(value)
  }
  const { values, setFieldValue } = formState

  useEffect(() => {
    if (!values.rewardDurationSeconds) {
      setFieldValue('rewardDurationSeconds', String(0))
    }
  }, [values?.rewardDurationSeconds, setFieldValue])

  return (
    <div className="flex w-3/4 flex-col gap-6">
      <div className="">
        <div className="mb-2 flex w-full items-center">
          <LabelText>
            Minimum stake duration
            <span className="ml-1 text-gray-500">(optional)</span>
          </LabelText>
          <InformationCircleIcon
            className="ml-1 h-6 w-6 cursor-pointer text-gray-400"
            onClick={() =>
              setActiveSlavePanelScreen(
                SlavePanelScreens.TIME_BASED_PARAMETERS_1
              )
            }
          />
        </div>
        <DurationInput
          defaultAmount={values.minStakeSeconds}
          defaultOption={'seconds'}
          handleChange={(v) => setFieldValue('minStakeSeconds', v)}
        />
      </div>
      <div className="">
        <div className="mb-2 flex w-full items-center">
          <LabelText>
            Cooldown period
            <span className="ml-1 text-gray-500">(optional)</span>
          </LabelText>
          <InformationCircleIcon
            className="ml-1 h-6 w-6 cursor-pointer text-gray-400"
            onClick={() =>
              setActiveSlavePanelScreen(
                SlavePanelScreens.TIME_BASED_PARAMETERS_2
              )
            }
          />
        </div>
        <DurationInput
          defaultAmount={values.cooldownPeriodSeconds}
          defaultOption={'seconds'}
          handleChange={(v) => setFieldValue('cooldownPeriodSeconds', v)}
        />
      </div>
      <div className="">
        <div className="mb-2 flex w-full items-center">
          <LabelText>
            Maximum reward duration
            <span className="ml-1 text-gray-500">(optional)</span>
          </LabelText>
          <InformationCircleIcon
            className="ml-1 h-6 w-6 cursor-pointer text-gray-400"
            onClick={() =>
              setActiveSlavePanelScreen(
                SlavePanelScreens.TIME_BASED_PARAMETERS_3
              )
            }
          />
        </div>
        <DurationInput
          defaultAmount={values.maxRewardSecondsReceived}
          defaultOption={'seconds'}
          handleChange={(v) => setFieldValue('maxRewardSecondsReceived', v)}
        />
      </div>
      <div className="">
        <div className="mb-2 flex w-full items-center">
          <LabelText>
            Reset on stake{' '}
            <span className="ml-1 text-gray-500">(optional)</span>
          </LabelText>
          <InformationCircleIcon
            className="ml-1 h-6 w-6 cursor-pointer text-gray-400"
            onClick={() =>
              setActiveSlavePanelScreen(
                SlavePanelScreens.ADDITIONAL_STAKE_CONDITIONS_3
              )
            }
          />
        </div>
        <SelectInput
          className="w-full"
          value={resetOnStake}
          setValue={handleResetOnStakeChange}
          options={booleanOptions}
        />
      </div>
      <div className="">
        <div className="mb-2 flex w-full items-center">
          <LabelText>
            End date
            <span className="ml-1 text-gray-500">(optional)</span>
          </LabelText>
          <InformationCircleIcon
            className="ml-1 h-6 w-6 cursor-pointer text-gray-400"
            onClick={() =>
              setActiveSlavePanelScreen(
                SlavePanelScreens.TIME_BASED_PARAMETERS_4
              )
            }
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
