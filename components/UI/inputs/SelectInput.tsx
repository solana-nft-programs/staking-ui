import classNames from 'classnames'

type Options = {
  value: string
  label: string
}

export type SelectInputProps = {
  value: string
  setValue: (value: string) => void
  options: Options[]
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
        'rounded-lg bg-gray-800 px-2 py-3 outline outline-gray-600 focus:outline-orange-500',
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
