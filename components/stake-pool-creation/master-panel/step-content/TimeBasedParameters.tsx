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
  const [minStakeDuration, setMinStakeDuration] = useState('1')
  const [minStakeDurationUnitOfTime, setMinStakeDurationUnitOfTime] = useState(
    unitsOfTime[0]?.value
  )
  const [cooldownPeriod, setCooldownPeriod] = useState('1')
  const [cooldownPeriodUnitOfTime, setCooldownPeriodUnitOfTime] = useState(
    unitsOfTime[0]?.value
  )
  const [maxRewardDuration, setMaxRewardDuration] = useState('1')
  const [maxRewardDurationUnitOfTime, setMaxRewardDurationUnitOfTime] =
    useState(unitsOfTime[0]?.value)

  const [terminationDate, setTerminationDate] = useState('')

  useEffect(() => {})

  const { values, setFieldValue, handleChange } = formState

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
              if (Number(minStakeDuration) > 0) {
                setMinStakeDuration((Number(minStakeDuration) - 1).toString())
              }
            }}
          />
          <TextInput
            className="w-12 rounded-r-none text-center"
            value={String(
              values.minStakeSeconds /
                (minStakeDurationUnitOfTime === 'day'
                  ? SECONDS_PER_DAY
                  : SECONDS_PER_HOUR)
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
            onClick={() =>
              setMinStakeDuration((Number(minStakeDuration) + 1).toString())
            }
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
              if (Number(cooldownPeriod) > 0) {
                setCooldownPeriod((Number(cooldownPeriod) - 1).toString())
              }
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
            onClick={() =>
              setCooldownPeriod((Number(cooldownPeriod) + 1).toString())
            }
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
              if (Number(maxRewardDuration) > 0) {
                setMaxRewardDuration((Number(maxRewardDuration) - 1).toString())
              }
            }}
          />
          <TextInput
            className="w-12 rounded-r-none text-center"
            value={String(
              (values.rewardDurationSeconds || 0) /
                (maxRewardDurationUnitOfTime === 'day'
                  ? SECONDS_PER_DAY
                  : SECONDS_PER_HOUR)
            )}
            onChange={(e) =>
              setFieldValue(
                'rewardDurationSeconds',
                maxRewardDurationUnitOfTime === 'day'
                  ? Number(e.target.value) * SECONDS_PER_DAY
                  : Number(e.target.value) * SECONDS_PER_HOUR
              )
            }
          />
          <SelectInput
            className="-ml-1 rounded-l-none"
            value={maxRewardDurationUnitOfTime || ''}
            setValue={setMaxRewardDurationUnitOfTime}
            options={unitsOfTime}
          />
          <ButtonIncrement
            className="ml-3"
            onClick={() =>
              setMaxRewardDuration((Number(maxRewardDuration) + 1).toString())
            }
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
