import classNames from 'classnames'

export type NumberInputProps = {
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  placeholder?: string
}

export const NumberInput = ({
  value,
  onChange,
  className,
  placeholder,
}: NumberInputProps) => {
  return (
    <input
      placeholder={placeholder}
      onChange={onChange}
      type="number"
      value={value}
      className={classNames([
        'w-full rounded-lg bg-gray-800 p-2 outline outline-gray-600 focus:outline-orange-500',
        className,
      ])}
    />
  )
}
