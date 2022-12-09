import { InformationCircleIcon } from '@heroicons/react/24/outline'
import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'

import { SlavePanelScreens } from '@/components/stake-pool-creation/SlavePanel'
import { ButtonDecrement } from '@/components/UI/buttons/ButtonDecrement'
import { ButtonIncrement } from '@/components/UI/buttons/ButtonIncrement'
import { NumberInput } from '@/components/UI/inputs/NumberInput'
import { SelectInput } from '@/components/UI/inputs/SelectInput'
import { LabelText } from '@/components/UI/typography/LabelText'
import { unitsOfTime } from '@/constants/index'

export type TimeBasedParametersProps = {
  setActiveSlavePanelScreen: Dispatch<SetStateAction<SlavePanelScreens>>
}

export const TimeBasedParameters = ({
  setActiveSlavePanelScreen,
}: TimeBasedParametersProps) => {
  const {
    TIME_BASED_PARAMETERS_1,
    TIME_BASED_PARAMETERS_2,
    TIME_BASED_PARAMETERS_3,
    TIME_BASED_PARAMETERS_4,
  } = SlavePanelScreens
  const [maxStakeDuration, setMaxStakeDuration] = useState('1')
  const [maxStakeDurationUnitOfTime, setMaxStakeDurationUnitOfTime] = useState(
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

  return (
    <>
      <div className="pb-6">
        <div className="mb-2 flex w-full items-center">
          <LabelText>
            Maximum stake duration
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
              if (Number(maxStakeDuration) > 0) {
                setMaxStakeDuration((Number(maxStakeDuration) - 1).toString())
              }
            }}
          />
          <NumberInput
            className="w-12 rounded-r-none text-center"
            value={maxStakeDuration || ''}
            onChange={(e) => setMaxStakeDuration(e.target.value)}
          />
          <SelectInput
            className="-ml-1 rounded-l-none"
            value={maxStakeDurationUnitOfTime || ''}
            setValue={setMaxStakeDurationUnitOfTime}
            options={unitsOfTime}
          />
          <ButtonIncrement
            className="ml-3"
            onClick={() =>
              setMaxStakeDuration((Number(maxStakeDuration) + 1).toString())
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
          <NumberInput
            className="w-12 rounded-r-none text-center"
            value={cooldownPeriod || ''}
            onChange={(e) => setCooldownPeriod(e.target.value)}
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
          <NumberInput
            className="w-12 rounded-r-none text-center"
            value={maxRewardDuration || ''}
            onChange={(e) => setMaxRewardDuration(e.target.value)}
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
          onChange={(e) => setTerminationDate(e.target.value)}
          placeholder="Select date and time"
          className="rounded-xl border border-gray-700 bg-gray-800 p-2 outline outline-gray-700 focus:outline-orange-500"
          type="datetime-local"
          name="termination-date"
          value={terminationDate}
        />
      </div>
    </>
  )
}
