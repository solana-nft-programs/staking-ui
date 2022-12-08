import { Intro } from '@/components/stake-pool-creation/master-panel/Intro'
import { Authorization } from '@/components/stake-pool-creation/master-panel/step-content/Authorization'

export type StepContentProps = {
  majorStep: number
  minorStep: number
}

export const StepContent = ({ majorStep, minorStep }: StepContentProps) => {
  return (
    <div>
      {majorStep === 0 && <Intro />}
      {majorStep === 1 && <Authorization minorStep={minorStep} />}
    </div>
  )
}
