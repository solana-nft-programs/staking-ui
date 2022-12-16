import { InformationCircleIcon } from '@heroicons/react/24/outline'
import type { FormikHandlers, FormikState, FormikValues } from 'formik'
import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useState } from 'react'

import { SlavePanelScreens } from '@/components/stake-pool-creation/SlavePanel'
import { ButtonDecrement } from '@/components/UI/buttons/ButtonDecrement'
import { ButtonIncrement } from '@/components/UI/buttons/ButtonIncrement'
import { NumberInput } from '@/components/UI/inputs/NumberInput'
import { SelectInput } from '@/components/UI/inputs/SelectInput'
import { TextInput } from '@/components/UI/inputs/TextInput'
import { LabelText } from '@/components/UI/typography/LabelText'
import { unitsOfTime } from '@/constants/index'
import { booleanOptions } from '@/types/index'

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
    ADDITIONAL_STAKE_CONDITIONS_3,
    REWARD_SUPPLY_3,
  } = SlavePanelScreens
  const [minStakeDurationUnitOfTime, setMinStakeDurationUnitOfTime] = useState(
    unitsOfTime[0]?.value
  )
  const [cooldownPeriodUnitOfTime, setCooldownPeriodUnitOfTime] = useState(
    unitsOfTime[0]?.value
  )
  const [maxRewardDurationUnitOfTime, setMaxRewardDurationUnitOfTime] =
    useState(unitsOfTime[0]?.value)
  const [resetOnStake, setResetOnStake] = useState('no')
  const handleResetOnStakeChange = (value: string) => {
    values.resetOnStake = !!(value === 'yes')
    setResetOnStake(value)
  }

  const { values, setFieldValue, handleChange } = formState

  useEffect(() => {
    if (!values.rewardDurationSeconds) {
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
              const value =
                minStakeDurationUnitOfTime === 'seconds'
                  ? values.minStakeSeconds - 1
                  : minStakeDurationUnitOfTime === 'day'
                  ? values.minStakeSeconds - SECONDS_PER_DAY
                  : values.minStakeSeconds - SECONDS_PER_HOUR
              setFieldValue('minStakeSeconds', value)
              if (!value || value < 0) setFieldValue('minStakeSeconds', 0)
            }}
          />
          <TextInput
            className="w-24 rounded-r-none text-center"
            value={String(
              values.minStakeSeconds /
                (minStakeDurationUnitOfTime === 'seconds'
                  ? 1
                  : minStakeDurationUnitOfTime === 'day'
                  ? SECONDS_PER_DAY
                  : SECONDS_PER_HOUR) || 0
            )}
            onChange={(e) =>
              setFieldValue(
                'minStakeSeconds',
                minStakeDurationUnitOfTime === 'seconds'
                  ? Number(e.target.value)
                  : minStakeDurationUnitOfTime === 'day'
                  ? Number(e.target.value) * SECONDS_PER_DAY
                  : Number(e.target.value) * SECONDS_PER_HOUR
              )
            }
          />
          <SelectInput
            className="ml-[2.5px] rounded-l-none"
            value={minStakeDurationUnitOfTime || ''}
            setValue={setMinStakeDurationUnitOfTime}
            options={unitsOfTime}
          />
          <ButtonIncrement
            className="ml-3"
            onClick={() => {
              setFieldValue(
                'minStakeSeconds',
                minStakeDurationUnitOfTime === 'seconds'
                  ? values.minStakeSeconds + 1
                  : minStakeDurationUnitOfTime === 'day'
                  ? values.minStakeSeconds + SECONDS_PER_DAY
                  : values.minStakeSeconds + SECONDS_PER_HOUR
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
              const value =
                cooldownPeriodUnitOfTime === 'seconds'
                  ? values.cooldownPeriodSeconds - 1
                  : cooldownPeriodUnitOfTime === 'day'
                  ? values.cooldownPeriodSeconds - SECONDS_PER_DAY
                  : values.cooldownPeriodSeconds - SECONDS_PER_HOUR
              setFieldValue('cooldownPeriodSeconds', value)
              if (!value || value < 0) setFieldValue('cooldownPeriodSeconds', 0)
            }}
          />
          <TextInput
            className="w-24 rounded-r-none text-center"
            value={String(
              values.cooldownPeriodSeconds /
                (cooldownPeriodUnitOfTime === 'seconds'
                  ? 1
                  : cooldownPeriodUnitOfTime === 'day'
                  ? SECONDS_PER_DAY
                  : SECONDS_PER_HOUR)
            )}
            onChange={(e) =>
              setFieldValue(
                'cooldownPeriodSeconds',
                cooldownPeriodUnitOfTime === 'seconds'
                  ? Number(e.target.value)
                  : cooldownPeriodUnitOfTime === 'day'
                  ? Number(e.target.value) * SECONDS_PER_DAY
                  : Number(e.target.value) * SECONDS_PER_HOUR
              )
            }
          />
          <SelectInput
            className="ml-[2.5px] rounded-l-none"
            value={cooldownPeriodUnitOfTime || ''}
            setValue={setCooldownPeriodUnitOfTime}
            options={unitsOfTime}
          />
          <ButtonIncrement
            className="ml-3"
            onClick={() => {
              setFieldValue(
                'cooldownPeriodSeconds',
                cooldownPeriodUnitOfTime === 'seconds'
                  ? values.cooldownPeriodSeconds + 1
                  : cooldownPeriodUnitOfTime === 'day'
                  ? values.cooldownPeriodSeconds + SECONDS_PER_DAY
                  : values.cooldownPeriodSeconds + SECONDS_PER_HOUR
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
              const value =
                maxRewardDurationUnitOfTime === 'seconds'
                  ? values.rewardDurationSeconds - 1
                  : maxRewardDurationUnitOfTime === 'day'
                  ? values.rewardDurationSeconds - SECONDS_PER_DAY
                  : values.rewardDurationSeconds - SECONDS_PER_HOUR
              setFieldValue('rewardDurationSeconds', value)
              if (!value || value < 0) setFieldValue('rewardDurationSeconds', 0)
            }}
          />
          <TextInput
            className="w-24 rounded-r-none text-center"
            value={String(
              values.rewardDurationSeconds /
                (maxRewardDurationUnitOfTime === 'seconds'
                  ? 1
                  : maxRewardDurationUnitOfTime === 'day'
                  ? SECONDS_PER_DAY
                  : SECONDS_PER_HOUR)
            )}
            onChange={(e) => {
              setFieldValue(
                'rewardDurationSeconds',
                maxRewardDurationUnitOfTime === 'seconds'
                  ? Number(e.target.value)
                  : maxRewardDurationUnitOfTime === 'day'
                  ? Number(e.target.value) * SECONDS_PER_DAY
                  : Number(e.target.value) * SECONDS_PER_HOUR
              )
            }}
          />
          <SelectInput
            className="ml-[2.5px] rounded-l-none"
            value={maxRewardDurationUnitOfTime || ''}
            setValue={setMaxRewardDurationUnitOfTime}
            options={unitsOfTime}
          />
          <ButtonIncrement
            className="ml-3"
            onClick={() => {
              setFieldValue(
                'rewardDurationSeconds',
                maxRewardDurationUnitOfTime === 'seconds'
                  ? values.rewardDurationSeconds + 1
                  : maxRewardDurationUnitOfTime === 'day'
                  ? values.rewardDurationSeconds + SECONDS_PER_DAY
                  : values.rewardDurationSeconds + SECONDS_PER_HOUR
              )
            }}
          />
        </div>
      </div>
      <div className="flex">
        <div className="w-1/2 pb-6">
          <div className="mb-2 flex w-full items-center">
            <LabelText>
              Multiplier Decimals{' '}
              <span className="ml-1 text-gray-500">(optional)</span>
            </LabelText>
            <InformationCircleIcon
              onClick={() => setActiveSlavePanelScreen(REWARD_SUPPLY_3)}
              className="ml-1 h-6 w-6 cursor-pointer text-gray-400"
            />
          </div>
          <NumberInput
            className="w-32"
            placeholder="0.000"
            value={values.multiplierDecimals}
            onChange={(e) => {
              setFieldValue('multiplierDecimals', e.target.value)
            }}
          />
        </div>
        <div className="pb-6">
          <div className="mb-2 flex w-full items-center">
            <LabelText>
              Default Multiplier{' '}
              <span className="ml-1 text-gray-500">(optional)</span>
            </LabelText>
            <InformationCircleIcon
              onClick={() => setActiveSlavePanelScreen(REWARD_SUPPLY_3)}
              className="ml-1 h-6 w-6 cursor-pointer text-gray-400"
            />
          </div>
          <NumberInput
            className="w-32"
            placeholder="0.000"
            value={values.defaultMultiplier}
            onChange={(e) => {
              setFieldValue('defaultMultiplier', e.target.value)
            }}
          />
        </div>
      </div>
      <div className="flex">
        <div className="w-1/2 pb-6">
          <div className="mb-2 flex w-full items-center">
            <LabelText>
              Reset on stake{' '}
              <span className="ml-1 text-gray-500">(optional)</span>
            </LabelText>
            <InformationCircleIcon
              className="ml-1 h-6 w-6 cursor-pointer text-gray-400"
              onClick={() =>
                setActiveSlavePanelScreen(ADDITIONAL_STAKE_CONDITIONS_3)
              }
            />
          </div>
          <SelectInput
            className="mb-6 w-20"
            value={resetOnStake}
            setValue={handleResetOnStakeChange}
            options={booleanOptions}
          />
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
      </div>
    </>
  )
}
