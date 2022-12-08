import { Intro } from '@/components/stake-pool-creation/slave-panel-content/Intro'
import { HeadingPrimary } from '@/components/UI/typography/HeadingPrimary'

export type SlavePanelProps = {
  currentStep: number
}

export const SlavePanel = ({ currentStep }: SlavePanelProps) => {
  return (
    <div className="ml-8 flex w-3/5 flex-col">
      <div className="relative flex h-full w-full flex-col items-center justify-center overflow-clip rounded-2xl bg-black py-16">
        {currentStep === 0 ? (
          <Intro />
        ) : (
          <>
            <HeadingPrimary className="mb-8">Step {currentStep}</HeadingPrimary>
          </>
        )}
      </div>
    </div>
  )
}
