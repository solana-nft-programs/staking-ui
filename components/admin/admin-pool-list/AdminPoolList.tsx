import type { StakePool } from 'hooks/useAllStakePools'

import { GridView } from '@/components/admin/admin-pool-list/grid-view/GridView'
import { ListView } from '@/components/admin/admin-pool-list/list-view/ListView'

export type AdminPoolListProps = {
  allPools: StakePool[]
  layoutType: 'list' | 'grid'
}

export const AdminPoolList = ({ allPools, layoutType }: AdminPoolListProps) => {
  switch (layoutType) {
    case 'list':
      return <ListView allPools={allPools} />
    case 'grid':
    default:
      return <GridView allPools={allPools} />
  }
}
