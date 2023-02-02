import classNames from 'classnames'

import type { InputOption } from '@/types/index'

export type SelectInputProps = {
  value: string
  setValue: (value: string) => void
  options: InputOption[]
  className?: string
}

export const SelectInput = ({
  value,
  setValue,
  options,
  className,
}: SelectInputProps) => {
  return (
    <select
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className={classNames([
        'rounded-lg bg-gray-800 px-2 py-[10px] outline outline-gray-600 focus:outline-orange-500',
        className,
      ])}
    >
      {options.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  )
}
