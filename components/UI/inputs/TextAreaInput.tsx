import { twMerge } from 'tailwind-merge'

import { inputClassNames } from './TextInput'

type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
> & {
  disabled?: boolean
  className?: string
  placeholder?: string
  hasError?: boolean
}

export const TextAreaInput = ({
  disabled,
  hasError,
  value,
  onChange,
  className,
  placeholder,
  ...props
}: Props) => {
  return (
    <textarea
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
