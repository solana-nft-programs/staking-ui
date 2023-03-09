import classNames from 'classnames'

import type { InputOption } from '@/types/index'

interface SelectInputProps extends React.HTMLAttributes<HTMLSelectElement> {
  value: string
  setValue: (value: string) => void
  options: InputOption[]
  className?: string
}

export const SelectInput: React.FC<SelectInputProps> = ({
  value,
  setValue,
  options,
  className,
  ...props
}: SelectInputProps) => {
  return (
    <select
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className={classNames([
        'rounded-lg bg-gray-800 px-2 py-[10px] ring-[1px] ring-gray-600 focus:ring-orange-500',
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
