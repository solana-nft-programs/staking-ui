import { css } from '@emotion/react'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'
import { useState } from 'react'

import { Tooltip } from './Tooltip'

export type SwitchOption<T> = {
  label: string | React.ReactNode
  value: T
  tooltip?: string
  disabled?: boolean
}

interface Props<T> extends React.HTMLAttributes<HTMLDivElement> {
  options: SwitchOption<T>[]
  defaultOption?: SwitchOption<T>
  handleChange?: (arg: SwitchOption<T>) => void
}

export const Switch = <T,>({
  defaultOption,
  handleChange,
  options = [],
  style,
}: Props<T>) => {
  const { data: stakePoolMetadata } = useStakePoolMetadata()
  const [value, setValue] = useState<SwitchOption<T> | undefined>(defaultOption)
  return (
    <div
      style={style}
      className="inline-flex justify-center rounded-xl bg-medium-4"
    >
      {options.map((o, i) => (
        <Tooltip key={i} title={o.tooltip || ''}>
          <div
            className={`flex items-center justify-between rounded-xl px-3 py-[2px] text-sm text-light-0 transition-colors ${
              o.disabled ? 'cursor-default opacity-25' : 'cursor-pointer'
            } ${value?.value === o.value ? 'bg-dark-4' : 'bg-none'}`}
            css={css`
              box-shadow: ${value?.value === o.value
                ? '0px 4px 6px rgba(0, 0, 0, 0.25)'
                : ''};
              background: ${stakePoolMetadata?.colors?.secondary} !important;
              color: ${stakePoolMetadata?.colors?.fontColor} !important;
            `}
            onClick={() => {
              if (o.disabled) return
              setValue(o)
              handleChange && handleChange(o)
            }}
          >
            <div>{o.label}</div>
          </div>
        </Tooltip>
      ))}
    </div>
  )
}
