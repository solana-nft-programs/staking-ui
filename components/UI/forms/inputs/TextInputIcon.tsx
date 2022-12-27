import { useState } from 'react'
import { twMerge } from 'tailwind-merge'

import { inputClassNames } from './TextInput'

type Props = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  disabled?: boolean
  icon: React.ReactNode
  onIconClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  className?: string
  error?: boolean
}

export const TextInputIcon = ({
  disabled,
  error,
  onIconClick,
  icon,
  className,
  ...props
}: Props) => {
  const [focus, setFocus] = useState(false)
  return (
    <div
      className={twMerge([
        inputClassNames({ disabled, error }),
        'flex items-center',
        focus && 'bg-dark-4',
        className,
      ])}
    >
      <input
        className={`mr-5 w-full bg-transparent focus:outline-none`}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        autoComplete="off"
        {...props}
      />
      <div
        className="cursor-pointer text-xs text-gray-400"
        onClick={onIconClick}
      >
        {icon}
      </div>
    </div>
  )
}
