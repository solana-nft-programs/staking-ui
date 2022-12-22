import classNames from 'classnames'
import { withCluster } from 'common/utils'
import type { StakePool } from 'hooks/useAllStakePools'
import { useRouter } from 'next/router'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'

import { ListViewItemContent } from '@/components/admin/admin-pool-list/list-view/ListViewItemContent'

export type ListViewItemProps = {
  stakePool: StakePool
  className?: string
}

export const ListViewItem = ({ stakePool, className }: ListViewItemProps) => {
  const router = useRouter()
  const { environment } = useEnvironmentCtx()

  return (
    <div
      className={classNames([
        'cursor-pointer rounded-lg bg-gray-600 p-4 shadow-deep outline outline-4 outline-gray-700 transition-all duration-300 hover:scale-[1.01] hover:bg-gray-800 hover:shadow-deep-float hover:outline-orange-500 active:bg-black',
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
      <ListViewItemContent stakePool={stakePool} />
    </div>
  )
}
