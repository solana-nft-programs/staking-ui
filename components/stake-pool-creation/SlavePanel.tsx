import { Intro } from '@/components/stake-pool-creation/slave-panel-content/Intro'
import { HeadingPrimary } from '@/components/UI/typography/HeadingPrimary'
import { HeadingSecondary } from '@/components/UI/typography/HeadingSecondary'

export type SlavePanelProps = {
  majorStep: number
  minorStep: number
}

export const SlavePanel = ({ majorStep, minorStep }: SlavePanelProps) => {
  return (
    <div className="ml-8 flex w-3/5 flex-col">
      <div className="relative flex h-full w-full flex-col items-center justify-center overflow-clip rounded-2xl bg-black py-16">
        {majorStep === 0 ? (
          <Intro />
        ) : (
          <>
            <HeadingPrimary className="mb-8">Step {majorStep}</HeadingPrimary>
            <HeadingSecondary>Sub-step {minorStep}</HeadingSecondary>
          </>
        )}
      </div>
    </div>
  )
}
