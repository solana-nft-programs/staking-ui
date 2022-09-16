import { useEffect, useState } from 'react'

import { Tooltip } from './Tooltip'

type Option<T> = {
  label: string | React.ReactNode
  value: T
  tooltip?: string
  disabled?: boolean
}

type Props<T> = {
  colorized?: boolean
  placeholder?: string
  value?: Option<T>
  options: Option<T>[]
  defaultOption?: Option<T>
  onChange?: (arg: Option<T>) => void
}

export const TabSelector = <T,>({
  colorized,
  defaultOption,
  value,
  onChange,
  options = [],
}: Props<T>) => {
  const [internalValue, setInternalValue] = useState<Option<T> | undefined>(
    defaultOption
  )

  useEffect(() => {
    value?.label &&
      value?.label !== internalValue?.label &&
      setInternalValue(value)
  }, [value?.label])

  return (
    <div className="flex rounded-lg border-[1px] border-border bg-dark-4">
      {options.map((o, i) => (
        <Tooltip key={i} title={o.tooltip || ''}>
          <div
            className={`flex items-center justify-between rounded-lg px-5 py-2 text-sm text-light-0 transition-colors ${
              o.disabled
                ? 'cursor-default opacity-25'
                : 'cursor-pointer hover:text-primary'
            } ${internalValue?.value === o.value ? 'bg-dark-6' : ''}`}
            onClick={() => {
              if (o.disabled) return
              setInternalValue(o)
              onChange && onChange(o)
            }}
          >
            <div>{o.label}</div>
          </div>
        </Tooltip>
      ))}
    </div>
  )
}
