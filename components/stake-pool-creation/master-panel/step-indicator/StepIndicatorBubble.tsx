import { CheckIcon } from '@heroicons/react/24/solid'
import classNames from 'classnames'

export type StepIndicatorBubbleProps = {
  isActive: boolean
  isPast: boolean
}

export const StepIndicatorBubble = ({
  isActive = false,
  isPast = false,
}: StepIndicatorBubbleProps) => {
  return (
    <div
      className={classNames([
        'relative z-10 rounded-full ',
        isActive ? 'bg-white' : 'bg-gray-500',
        isPast ? 'h-3 w-3 bg-teal-500' : 'h-3 w-3',
      ])}
    >
      {!!isActive && (
        <div className="absolute -top-2.5 -left-2.5 h-8 w-8 rounded-full border border-white" />
      )}
      {!!isPast && (
        <>
          <div className="absolute -top-2.5 -left-2.5 h-8 w-8 rounded-full bg-teal-500" />
          <CheckIcon className="absolute -top-1 -left-1 h-5 w-5 text-black" />
        </>
      )}
    </div>
  )
}
