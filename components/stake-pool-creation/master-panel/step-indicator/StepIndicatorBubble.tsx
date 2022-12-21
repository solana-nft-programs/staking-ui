import { CheckIcon } from '@heroicons/react/24/solid'
import classNames from 'classnames'

export type StepIndicatorBubbleProps = {
  isActive: boolean
  isPast: boolean
  stepName: string
  setCurrentStep: (step: number) => void
  stepIndex: number
}

export const StepIndicatorBubble = ({
  isActive = false,
  isPast = false,
  stepName,
  setCurrentStep,
  stepIndex,
}: StepIndicatorBubbleProps) => {
  return (
    <div
      className="step-indicator-bubble-wrapper flex cursor-pointer flex-col"
      onClick={() => setCurrentStep(stepIndex + 1)}
    >
      <div
        className={classNames([
          'step-indicator-bubble relative z-10 rounded-full',
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
      <div className="step-name-text absolute mt-7 -ml-10 w-24 text-center text-xs font-bold text-gray-400">
        {stepName}
      </div>
      <style>{`
        .step-indicator-bubble-wrapper:hover .step-name-text {
          color: #F2A93C; 
        }
        .step-indicator-bubble-wrapper:hover .step-indicator-bubble {
          background-color: #F2A93C; 
        }
      `}</style>
    </div>
  )
}
