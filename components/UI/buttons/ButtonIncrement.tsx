import { PlusIcon } from '@heroicons/react/24/solid'
import classNames from 'classnames'

export type ButtonIncrementProps = {
  onClick: () => void
  className?: string
  disabled?: boolean
}

export const ButtonIncrement = ({
  onClick,
  className,
  disabled,
}: ButtonIncrementProps) => {
  return (
    <button
      disabled={disabled}
      className={classNames([
        'flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-gray-600 p-2 outline outline-4 outline-gray-600',
        className,
        { 'cursor-not-allowed': disabled },
      ])}
      onClick={onClick}
    >
      <PlusIcon className="h-4 w-4 text-gray-400" />
    </button>
  )
}
