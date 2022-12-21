import { MinusIcon } from '@heroicons/react/24/solid'
import classNames from 'classnames'

export type ButtonDecrementProps = {
  onClick: () => void
  className?: string
  disabled?: boolean
}

export const ButtonDecrement = ({
  onClick,
  className,
  disabled = false,
}: ButtonDecrementProps) => {
  return (
    <button
      disabled={disabled}
      className={classNames([
        'flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-gray-600 p-2 outline outline-4 outline-gray-600',
        className,
        { 'cursor-not-allowed bg-gray-500 opacity-30': disabled },
      ])}
      onClick={onClick}
    >
      <MinusIcon className="h-4 w-4 text-gray-400" />
    </button>
  )
}
