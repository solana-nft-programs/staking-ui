import { css } from '@emotion/react'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'
import { useState } from 'react'

import { Tooltip } from './Tooltip'

interface Props
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'defaultValue' | 'onChange'
  > {
  defaultValue: boolean
  tooltip?: string
  disabled?: boolean
  onChange?: (arg: boolean) => void
}

export const Toggle = ({
  defaultValue,
  tooltip,
  disabled,
  onChange,
}: Props) => {
  const [value, setValue] = useState(defaultValue)
  const { data: stakePoolMetadata } = useStakePoolMetadata()
  return (
    <Tooltip title={tooltip || ''}>
      <div
        className={`relative h-6 w-10 rounded-xl text-sm text-light-0 transition-colors ${
          disabled ? 'cursor-default opacity-25' : 'cursor-pointer'
        } ${value ? 'bg-dark-4' : 'bg-medium-3'}`}
        css={css`
          background: ${stakePoolMetadata?.colors?.secondary} !important;
          border: 2px solid ${stakePoolMetadata?.colors?.secondary} !important;
        `}
        onClick={() => {
          if (disabled) return
          setValue(!value)
          onChange && onChange(!value)
        }}
      >
        <div
          className={`absolute h-5 w-5 rounded-full bg-white transition-all ${
            value ? 'left-4' : 'left-0'
          }`}
        />
      </div>
    </Tooltip>
  )
}
