import classNames from 'classnames'

export type TextInputProps = {
  disabled?: boolean
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  placeholder?: string
  hasError?: boolean
}

export const TextInput = ({
  disabled,
  hasError,
  value,
  onChange,
  className,
  placeholder,
}: TextInputProps) => {
  return (
    <input
      disabled={disabled}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      className={classNames([
        'w-full rounded-lg bg-gray-800 p-2 outline outline-gray-600',
        hasError && 'border border-red-500',
        !hasError && 'focus:outline-orange-500',
        className,
      ])}
    />
  )
}
