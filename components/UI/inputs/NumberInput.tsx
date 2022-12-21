import classNames from 'classnames'

export type NumberInputProps = {
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  placeholder?: string
  disabled?: boolean
}

export const NumberInput = ({
  value,
  onChange,
  className,
  placeholder,
  disabled,
}: NumberInputProps) => {
  return (
    <input
      disabled={disabled}
      placeholder={placeholder}
      onChange={onChange}
      type="text"
      inputMode="numeric"
      value={value}
      className={classNames([
        'w-full rounded-lg bg-gray-800 py-3 px-4 outline outline-gray-600 focus:outline-orange-500',
        className,
      ])}
    />
  )
}
