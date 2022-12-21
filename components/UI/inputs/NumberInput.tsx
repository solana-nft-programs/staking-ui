import classNames from 'classnames'
import type { CompositionEvent, SyntheticEvent } from 'react'

export type NumberInputProps = {
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  placeholder?: string
  disabled?: boolean
  hasError?: boolean
}

export const NumberInput = ({
  value,
  onChange,
  className,
  placeholder,
  disabled,
  hasError,
}: NumberInputProps) => {
  return (
    <input
      onBeforeInput={(e: SyntheticEvent) => {
        const event = e as CompositionEvent
        // @ts-ignore
        if (event.target.value === '-') event.target.value = ''
      }}
      disabled={disabled}
      placeholder={placeholder}
      onChange={onChange}
      type="text"
      inputMode="numeric"
      value={value}
      className={classNames([
        'w-full appearance-none rounded-lg py-3 px-4 outline outline-gray-700',
        {
          'bg-gray-800 outline-red-500': !disabled && hasError,
          'bg-gray-800 focus:outline-orange-500': !disabled && !hasError,
          'cursor-not-allowed bg-gray-500 opacity-30 placeholder:text-white':
            disabled,
        },
        className,
      ])}
    />
  )
}
