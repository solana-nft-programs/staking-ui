import { Intro } from '@/components/stake-pool-creation/slave-panel-content/Intro'

export type ContentPrimaryProps = {
  currentStep: number
}

export const ContentPrimary = ({ currentStep }: ContentPrimaryProps) => {
  return (
    <div className="z-10 flex flex-col items-center">
      {currentStep === 0 && <Intro />}
    </div>
  )
}
