import { capitalizeFirstLetter } from '@cardinal/common'
import type { SelectorPositions } from 'common/Selector'
import { Selector } from 'common/Selector'
import { useEffect, useState } from 'react'

import { NumberInput } from '@/components/UI/inputs/NumberInput'

import { ButtonDecrement } from '../buttons/ButtonDecrement'
import { ButtonIncrement } from '../buttons/ButtonIncrement'

export type DurationOption = 'seconds' | 'hours' | 'days' | 'weeks' | 'months'

export const DURATION_DATA: { [key in DurationOption]: number } = {
  seconds: 1,
  hours: 3600,
  days: 86400,
  weeks: 604800,
  months: 2419200,
}

export const SECONDS_TO_DURATION: { [key in number]: DurationOption } = {
  1: 'seconds',
  3600: 'hours',
  86400: 'days',
  604800: 'weeks',
  2419200: 'months',
}

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  defaultOption?: DurationOption
  defaultAmount?: number | null
  disabled?: boolean
  durationData?: { [key in DurationOption]: number }
  handleChange?: (v: number) => void
  selectorPosition?: SelectorPositions
}

export const DurationInput = ({
  disabled,
  defaultOption,
  handleChange,
  defaultAmount = 1,
  durationData = DURATION_DATA,
  selectorPosition,
}: Props) => {
  const [durationAmount, setDurationAmount] = useState<number | null>(
    defaultAmount
  )
  const [durationOption, setDurationOption] = useState<DurationOption>(
    defaultOption ?? 'days'
  )

  useEffect(() => {
    handleChange &&
      durationAmount &&
      handleChange(durationAmount * durationData[durationOption]!)
  }, [durationOption, durationAmount])

  return (
    <div className="flex items-center">
      <ButtonDecrement
        disabled={disabled}
        className="mr-3"
        onClick={() =>
          setDurationAmount(Math.max(0, (durationAmount ?? 0) - 1))
        }
      />
      <NumberInput
        disabled={disabled}
        className="rounded-r-none text-center"
        value={durationAmount ? String(durationAmount) : '-'}
        onChange={(e) => setDurationAmount(parseInt(e.target.value) || 0)}
      />
      <Selector<DurationOption>
        disabled={disabled}
        className="rounded-l-none"
        onChange={(e) => setDurationOption(e?.value ?? 'days')}
        position={selectorPosition}
        defaultOption={{
          value: durationOption,
          label: capitalizeFirstLetter(durationOption).substring(
            0,
            durationOption.length - 1
          ),
        }}
        options={Object.keys(DURATION_DATA).map((option) => ({
          label: capitalizeFirstLetter(option).substring(0, option.length - 1),
          value: option as DurationOption,
        }))}
      />
      <ButtonIncrement
        disabled={disabled}
        className="ml-3"
        onClick={() =>
          setDurationAmount(Math.max(0, (durationAmount ?? 0) + 1))
        }
      />
    </div>
  )
}
