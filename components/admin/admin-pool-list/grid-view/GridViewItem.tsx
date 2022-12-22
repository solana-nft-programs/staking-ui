import classNames from 'classnames'
import { withCluster } from 'common/utils'
import type { StakePool } from 'hooks/useAllStakePools'
import { useRouter } from 'next/router'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'

import { GridViewItemContent } from '@/components/admin/admin-pool-list/grid-view/GridViewItemContent'

export type GridViewItemProps = {
  stakePool: StakePool
  className?: string
}

export const GridViewItem = ({ stakePool, className }: GridViewItemProps) => {
  const router = useRouter()
  const { environment } = useEnvironmentCtx()

  return (
    <div
      className={classNames([
        'h-[300px] cursor-pointer rounded-lg bg-gray-600 p-10 shadow-deep outline outline-4 outline-gray-700 transition-all duration-300 hover:scale-[1.01] hover:bg-gray-800 hover:shadow-deep-float hover:outline-orange-500 active:bg-black',
        className,
      ])}
      onClick={() => {
        router.push(
          withCluster(
            `/admin/${
              stakePool.stakePoolMetadata?.name ||
              stakePool.stakePoolData.pubkey.toString()
            }`,
            environment.label
          )
        )
      }}
    >
      <GridViewItemContent stakePool={stakePool} />
    </div>
  )
}
