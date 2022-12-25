import { PlusCircleIcon } from '@heroicons/react/24/outline'
import type { Dispatch, SetStateAction } from 'react'

import type { PANE_OPTIONS } from '@/components/admin/AdminPool'
import { TreasuryBalance } from '@/components/stats/TreasuryBalance'
import { BodyCopy } from '@/components/UI/typography/BodyCopy'

export type StakePoolBalanceProps = {
  setPane: Dispatch<SetStateAction<PANE_OPTIONS>>
}

export const StakePoolBalance = ({ setPane }: StakePoolBalanceProps) => {
  return (
    <div className="flex h-full w-full items-center justify-center space-x-4">
      <BodyCopy className="font-bold">Stake Pool Balance:</BodyCopy>
      <TreasuryBalance />
      <PlusCircleIcon
        className="h-6 w-6 cursor-pointer text-orange-500"
        onClick={() => setPane('reward-funds')}
      />
    </div>
  )
}
