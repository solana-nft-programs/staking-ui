import { StepIndicatorBubble } from '@/components/stake-pool-creation/master-panel/step-indicator/StepIndicatorBubble'
import { HorizontalDivider } from '@/components/UI/HorizontalDivider'

export type StepIndicatorProps = {
  currentStep: number
}

const numberOfSteps = 5

export const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  return (
    <div className="relative flex items-center justify-between py-2">
      <div className="absolute w-full px-1">
        <HorizontalDivider />
      </div>
      {}
      {[...Array(numberOfSteps)].map((_, index) => (
        <StepIndicatorBubble
          isPast={index + 1 < currentStep}
          isActive={index + 1 === currentStep}
          key={index}
        />
      ))}
    </div>
  )
}
