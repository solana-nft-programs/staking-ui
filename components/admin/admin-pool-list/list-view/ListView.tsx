import type { StakePool } from 'hooks/useAllStakePools'

import { ListViewItem } from '@/components/admin/admin-pool-list/list-view/ListViewItem'

export type ListViewProps = {
  allPools: StakePool[]
}

export const ListView = ({ allPools }: ListViewProps) => {
  return (
    <div className="mt-8 flex w-full flex-wrap space-y-4">
      {allPools.map((stakePool) => (
        <ListViewItem
          className="w-full"
          key={stakePool.stakePoolData.pubkey.toString()}
          stakePool={stakePool}
        />
      ))}
    </div>
  )
}
