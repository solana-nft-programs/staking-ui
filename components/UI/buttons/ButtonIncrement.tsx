import { PlusIcon } from '@heroicons/react/24/solid'

export type ButtonIncrementProps = {
  onClick: () => void
}

export const ButtonIncrement = ({ onClick }: ButtonIncrementProps) => {
  return (
    <button
      className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gray-600 p-2 outline outline-gray-600"
      onClick={onClick}
    >
      <PlusIcon className="h-4 w-4 text-gray-400" />
    </button>
  )
}
