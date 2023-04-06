import { PlusCircleIcon } from '@heroicons/react/24/outline'

import { TreasuryBalance } from '@/components/hero-stats/TreasuryBalance'
import { BodyCopy } from '@/components/UI/typography/BodyCopy'

export type StakePoolBalanceProps = {
  onClick: () => void
}

export const StakePoolBalance = ({ onClick }: StakePoolBalanceProps) => {
  return (
    <div className="flex h-full w-full items-center justify-center space-x-4">
      <BodyCopy className="font-bold">Stake Pool Balance:</BodyCopy>
      <TreasuryBalance />
      <PlusCircleIcon
        className="h-6 w-6 cursor-pointer text-orange-500"
        onClick={onClick}
      />
    </div>
  )
}
