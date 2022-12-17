import classNames from 'classnames'

type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  disabled?: boolean
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
  ...props
}: Props) => {
  return (
    <input
      disabled={disabled}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      className={classNames([
        'w-full appearance-none rounded bg-gray-700 py-3 px-4 text-gray-200 placeholder-gray-500 outline',
        !disabled && hasError ? 'outline outline-red-500' : 'outline-gray-500',
        !disabled && !hasError && 'focus:bg-gray-800', //focus:outline-orange-500
        disabled && 'opacity-30',
        className,
      ])}
      {...props}
    />
  )
}
