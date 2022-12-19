import { twMerge } from 'tailwind-merge'

type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  disabled?: boolean
  className?: string
  placeholder?: string
  hasError?: boolean
}

export const inputClassNames = ({
  disabled,
  error,
}: {
  disabled?: boolean
  error?: boolean
}) =>
  twMerge([
    'w-full appearance-none rounded bg-gray-700 py-3 px-4 text-gray-200 placeholder-gray-500 outline',
    !disabled && error ? 'outline outline-red-500' : 'outline-gray-500',
    !disabled && !error && 'focus:bg-gray-800', //focus:outline-orange-500
    disabled && 'opacity-30',
  ])

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
      className={twMerge([
        inputClassNames({ disabled, error: hasError }),
        className,
      ])}
      {...props}
    />
  )
}
