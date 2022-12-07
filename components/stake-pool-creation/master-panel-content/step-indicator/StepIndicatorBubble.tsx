import classNames from 'classnames'

export type StepIndicatorBubbleProps = {
  isActive: boolean
}

export const StepIndicatorBubble = ({ isActive }: StepIndicatorBubbleProps) => {
  return (
    <div
      className={classNames([
        'relative z-10 h-3 w-3 rounded-full ',
        isActive ? 'bg-white' : 'bg-gray-500',
      ])}
    >
      {!!isActive && (
        <div className="absolute -top-2.5 -left-2.5 h-8 w-8 rounded-full border border-white" />
      )}
    </div>
  )
}
