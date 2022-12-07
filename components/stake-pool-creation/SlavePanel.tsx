import { Intro } from '@/components/stake-pool-creation/slave-panel-content/Intro'

export type SlavePanelProps = {
  majorStep: number
  minorStep: number
}

export const SlavePanel = ({ majorStep, minorStep }: SlavePanelProps) => {
  return (
    <div className="ml-8 flex w-2/3 flex-col">
      <div className="relative flex h-full w-full flex-col items-center justify-center overflow-clip rounded-2xl bg-black py-16">
        {majorStep === 0 && <Intro />}
      </div>
    </div>
  )
}
