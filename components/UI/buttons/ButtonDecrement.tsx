import { MinusIcon } from '@heroicons/react/24/solid'

export type ButtonDecrementProps = {
  onClick: () => void
}

export const ButtonDecrement = ({ onClick }: ButtonDecrementProps) => {
  return (
    <button
      className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gray-600 p-2 outline outline-gray-600"
      onClick={onClick}
    >
      <MinusIcon className="h-4 w-4 text-gray-400" />
    </button>
  )
}
