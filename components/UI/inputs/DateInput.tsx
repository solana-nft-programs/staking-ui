import classNames from 'classnames'

export type DateInputProps = {
  disabled?: boolean
  value: string | undefined
  setValue: (string: string) => void
  className?: string
  placeholder?: string
  hasError?: boolean
}

export const DateInput = ({
  disabled,
  hasError,
  value,
  setValue,
  className,
  placeholder,
}: DateInputProps) => {
  return (
    <input
      type="datetime-local"
      disabled={disabled}
      placeholder={placeholder}
      onChange={(e) => setValue(e.target.value)}
      value={value}
      className={classNames([
        'w-full rounded-lg bg-gray-800 p-2 ring-[1px] ring-gray-600',
        hasError && 'ring-red-500',
        !hasError && 'focus:ring-orange-500',
        className,
      ])}
    />
  )
}
