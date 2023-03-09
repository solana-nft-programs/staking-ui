import classNames from 'classnames'
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
  classNames([
    'w-full appearance-none rounded-lg bg-gray-800 py-3 px-4 ring-[1px] ring-gray-700',
    {
      'ring-red-500': !disabled && error,
      'focus:ring-orange-500': !disabled && !error,
      'opacity-30 bg-gray-500 placeholder:text-white cursor-not-allowed':
        disabled,
    },
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
      value={value}
      onChange={onChange}
      className={twMerge([
        inputClassNames({ disabled, error: hasError }),
        className,
      ])}
      {...props}
    />
  )
}
