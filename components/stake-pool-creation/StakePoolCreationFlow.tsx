import { MasterPanel } from '@/components/stake-pool-creation/MasterPanel'
import { SlavePanel } from '@/components/stake-pool-creation/SlavePanel'

export const StakePoolCreationFlow = () => {
  return (
    <div className="mb-8 flex w-full py-8 px-10">
      <MasterPanel />
      <SlavePanel />
    </div>
  )
}
