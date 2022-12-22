import type { StakePool } from 'hooks/useAllStakePools'

import { GridViewItem } from '@/components/admin/admin-pool-list/grid-view/GridViewItem'

export type GridViewProps = {
  allPools: StakePool[]
}

export const GridView = ({ allPools }: GridViewProps) => {
  return (
    <div className="grid-grid-cols-1 -mt-2 grid gap-5 py-10 md:grid-cols-3">
      {allPools.map((stakePool) => (
        <GridViewItem
          key={stakePool.stakePoolData.pubkey.toString()}
          stakePool={stakePool}
        />
      ))}
    </div>
  )
}
