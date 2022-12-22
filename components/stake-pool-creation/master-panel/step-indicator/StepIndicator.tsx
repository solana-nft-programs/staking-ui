import { StepIndicatorBubble } from '@/components/stake-pool-creation/master-panel/step-indicator/StepIndicatorBubble'
import { HorizontalDivider } from '@/components/UI/HorizontalDivider'

export type StepIndicatorProps = {
  currentStep: number
  stepNames?: string[]
  numberOfSteps: number
  setCurrentStep: (step: number) => void
}

export const StepIndicator = ({
  currentStep,
  stepNames,
  numberOfSteps,
  setCurrentStep,
}: StepIndicatorProps) => {
  return (
    <div className="relative flex w-full items-center justify-between px-8 py-6 pb-14">
      <div className="absolute -ml-8 w-full px-8">
        <HorizontalDivider />
      </div>
      {[...Array(numberOfSteps)].map((_, i) => (
        <StepIndicatorBubble
          setCurrentStep={setCurrentStep}
          stepIndex={i}
          isPast={i + 1 < currentStep}
          isActive={i + 1 === currentStep}
          key={i}
          stepName={stepNames?.[i] || ''}
        />
      ))}
    </div>
  )
}
