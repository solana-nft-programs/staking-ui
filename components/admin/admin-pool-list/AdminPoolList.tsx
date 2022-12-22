import type { StakePool } from 'hooks/useAllStakePools'

import { AdminPoolListItem } from '@/components/admin/admin-pool-list/AdminPoolListItem'

export type AdminPoolListProps = {
  allPools: StakePool[]
}

export const AdminPoolList = ({ allPools }: AdminPoolListProps) => {
  return (
    <div className="grid-grid-cols-1 grid gap-5 py-10 md:grid-cols-3">
      {allPools.map((stakePool) => (
        <AdminPoolListItem
          key={stakePool.stakePoolData.pubkey.toString()}
          stakePool={stakePool}
        />
      ))}
    </div>
  )
}
