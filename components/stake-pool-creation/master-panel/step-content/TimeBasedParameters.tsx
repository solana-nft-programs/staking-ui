import { InformationCircleIcon } from '@heroicons/react/24/outline'
import type { FormikHandlers, FormikState, FormikValues } from 'formik'
import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useState } from 'react'

import { SlavePanelScreens } from '@/components/stake-pool-creation/SlavePanel'
import { ButtonDecrement } from '@/components/UI/buttons/ButtonDecrement'
import { ButtonIncrement } from '@/components/UI/buttons/ButtonIncrement'
import { SelectInput } from '@/components/UI/inputs/SelectInput'
import { TextInput } from '@/components/UI/inputs/TextInput'
import { LabelText } from '@/components/UI/typography/LabelText'
import { unitsOfTime } from '@/constants/index'

export type TimeBasedParametersProps = {
  setActiveSlavePanelScreen: Dispatch<SetStateAction<SlavePanelScreens>>
  formState: FormikHandlers & FormikState<FormikValues> & FormikValues
}

const SECONDS_PER_DAY = 86400
const SECONDS_PER_HOUR = 3600

export const TimeBasedParameters = ({
  setActiveSlavePanelScreen,
  formState,
}: TimeBasedParametersProps) => {
  const {
    TIME_BASED_PARAMETERS_1,
    TIME_BASED_PARAMETERS_2,
    TIME_BASED_PARAMETERS_3,
    TIME_BASED_PARAMETERS_4,
  } = SlavePanelScreens
  const [minStakeDurationUnitOfTime, setMinStakeDurationUnitOfTime] = useState(
    unitsOfTime[0]?.value
  )
  const [cooldownPeriodUnitOfTime, setCooldownPeriodUnitOfTime] = useState(
    unitsOfTime[0]?.value
  )
  const [maxRewardDurationUnitOfTime, setMaxRewardDurationUnitOfTime] =
    useState(unitsOfTime[0]?.value)

  const { values, setFieldValue, handleChange } = formState

  useEffect(() => {
    if (
      values.rewardDurationSeconds === null ||
      Number.isNaN(values.rewardDurationSeconds)
    ) {
      setFieldValue('rewardDurationSeconds', String(0))
    }
  }, [values?.rewardDurationSeconds, setFieldValue])

  return (
    <>
      <div className="pb-6">
        <div className="mb-2 flex w-full items-center">
          <LabelText>
            Minimum stake duration
            <span className="ml-1 text-gray-500">(optional)</span>
          </LabelText>
          <InformationCircleIcon
            className="ml-1 h-6 w-6 cursor-pointer text-gray-400"
            onClick={() => setActiveSlavePanelScreen(TIME_BASED_PARAMETERS_1)}
          />
        </div>
        <div className="flex">
          <ButtonDecrement
            className="mr-3"
            onClick={() => {
              if (values.minStakeSeconds <= 0) return
              setFieldValue(
                'minStakeSeconds',
                minStakeDurationUnitOfTime === 'day'
                  ? values.minStakeSeconds - 1 * SECONDS_PER_DAY
                  : values.minStakeSeconds - 1 * SECONDS_PER_HOUR
              )
            }}
          />
          <TextInput
            className="w-12 rounded-r-none text-center"
            value={String(
              values.minStakeSeconds /
                (minStakeDurationUnitOfTime === 'day'
                  ? SECONDS_PER_DAY
                  : SECONDS_PER_HOUR) || 0
            )}
            onChange={(e) =>
              setFieldValue(
                'minStakeSeconds',
                minStakeDurationUnitOfTime === 'day'
                  ? Number(e.target.value) * SECONDS_PER_DAY
                  : Number(e.target.value) * SECONDS_PER_HOUR
              )
            }
          />
          <SelectInput
            className="-ml-1 rounded-l-none"
            value={minStakeDurationUnitOfTime || ''}
            setValue={setMinStakeDurationUnitOfTime}
            options={unitsOfTime}
          />
          <ButtonIncrement
            className="ml-3"
            onClick={() => {
              setFieldValue(
                'minStakeSeconds',
                minStakeDurationUnitOfTime === 'day'
                  ? values.minStakeSeconds + 1 * SECONDS_PER_DAY
                  : values.minStakeSeconds + 1 * SECONDS_PER_HOUR
              )
            }}
          />
        </div>
      </div>
      <div className="pb-6">
        <div className="mb-2 flex w-full items-center">
          <LabelText>
            Cooldown period
            <span className="ml-1 text-gray-500">(optional)</span>
          </LabelText>
          <InformationCircleIcon
            className="ml-1 h-6 w-6 cursor-pointer text-gray-400"
            onClick={() => setActiveSlavePanelScreen(TIME_BASED_PARAMETERS_2)}
          />
        </div>
        <div className="flex">
          <ButtonDecrement
            className="mr-3"
            onClick={() => {
              if (values.cooldownPeriodSeconds <= 0) return
              setFieldValue(
                'cooldownPeriodSeconds',
                cooldownPeriodUnitOfTime === 'day'
                  ? values.cooldownPeriodSeconds - 1 * SECONDS_PER_DAY
                  : values.cooldownPeriodSeconds - 1 * SECONDS_PER_HOUR
              )
            }}
          />
          <TextInput
            className="w-12 rounded-r-none text-center"
            value={String(
              values.cooldownPeriodSeconds /
                (cooldownPeriodUnitOfTime === 'day'
                  ? SECONDS_PER_DAY
                  : SECONDS_PER_HOUR)
            )}
            onChange={(e) =>
              setFieldValue(
                'cooldownPeriodSeconds',
                cooldownPeriodUnitOfTime === 'day'
                  ? Number(e.target.value) * SECONDS_PER_DAY
                  : Number(e.target.value) * SECONDS_PER_HOUR
              )
            }
          />
          <SelectInput
            className="-ml-1 rounded-l-none"
            value={cooldownPeriodUnitOfTime || ''}
            setValue={setCooldownPeriodUnitOfTime}
            options={unitsOfTime}
          />
          <ButtonIncrement
            className="ml-3"
            onClick={() => {
              setFieldValue(
                'cooldownPeriodSeconds',
                cooldownPeriodUnitOfTime === 'day'
                  ? values.cooldownPeriodSeconds + 1 * SECONDS_PER_DAY
                  : values.cooldownPeriodSeconds + 1 * SECONDS_PER_HOUR
              )
            }}
          />
        </div>
      </div>
      <div className="pb-6">
        <div className="mb-2 flex w-full items-center">
          <LabelText>
            Maximum reward duration
            <span className="ml-1 text-gray-500">(optional)</span>
          </LabelText>
          <InformationCircleIcon
            className="ml-1 h-6 w-6 cursor-pointer text-gray-400"
            onClick={() => setActiveSlavePanelScreen(TIME_BASED_PARAMETERS_3)}
          />
        </div>
        <div className="flex">
          <ButtonDecrement
            className="mr-3"
            onClick={() => {
              if (values.rewardDurationSeconds <= 0) return
              setFieldValue(
                'rewardDurationSeconds',
                maxRewardDurationUnitOfTime === 'day'
                  ? values.rewardDurationSeconds - 1 * SECONDS_PER_DAY
                  : values.rewardDurationSeconds - 1 * SECONDS_PER_HOUR
              )
            }}
          />
          <TextInput
            className="w-12 rounded-r-none text-center"
            value={
              values.rewardDurationSeconds
                ? String(
                    values.rewardDurationSeconds /
                      (maxRewardDurationUnitOfTime === 'day'
                        ? SECONDS_PER_DAY
                        : SECONDS_PER_HOUR)
                  )
                : '0'
            }
            onChange={(e) => {
              setFieldValue(
                'rewardDurationSeconds',
                maxRewardDurationUnitOfTime === 'day'
                  ? Number(e.target.value) * SECONDS_PER_DAY
                  : Number(e.target.value) * SECONDS_PER_HOUR
              )
            }}
          />
          <SelectInput
            className="-ml-1 rounded-l-none"
            value={maxRewardDurationUnitOfTime || ''}
            setValue={setMaxRewardDurationUnitOfTime}
            options={unitsOfTime}
          />
          <ButtonIncrement
            className="ml-3"
            onClick={() => {
              if (values.rewardDurationSeconds) {
                setFieldValue(
                  'rewardDurationSeconds',
                  maxRewardDurationUnitOfTime === 'day'
                    ? values.rewardDurationSeconds + 1 * SECONDS_PER_DAY
                    : values.rewardDurationSeconds + 1 * SECONDS_PER_HOUR
                )
              }
              setFieldValue(
                'rewardDurationSeconds',
                maxRewardDurationUnitOfTime === 'day'
                  ? 1 * SECONDS_PER_DAY
                  : 1 * SECONDS_PER_HOUR
              )
            }}
          />
        </div>
      </div>
      <div className="pb-6">
        <div className="mb-2 flex w-full items-center">
          <LabelText>
            Stake pool termination date
            <span className="ml-1 text-gray-500">(optional)</span>
          </LabelText>
          <InformationCircleIcon
            className="ml-1 h-6 w-6 cursor-pointer text-gray-400"
            onClick={() => setActiveSlavePanelScreen(TIME_BASED_PARAMETERS_4)}
          />
        </div>
        <input
          type="date"
          placeholder="Select date and time"
          className="rounded-xl border border-gray-700 bg-gray-800 p-2 outline outline-gray-700 focus:outline-orange-500"
          name="endDate"
          value={values.endDate}
          onChange={handleChange}
        />
      </div>
    </>
  )
}
