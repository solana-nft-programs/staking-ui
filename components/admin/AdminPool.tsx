import { pubKeyUrl, shortPubKey } from '@solana-nft-programs/common'
import { LinkIcon } from '@heroicons/react/24/outline'
import { TabSelector } from 'common/TabSelector'
import { withCluster } from 'common/utils'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { isStakePoolV2, useStakePoolData } from 'hooks/useStakePoolData'
import { useStakePoolId } from 'hooks/useStakePoolId'
import Image from 'next/image'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useStakePoolMetadataCtx } from 'providers/StakePoolMetadataProvider'
import { useState } from 'react'

import { AdvancedConfigForm } from '@/components/admin/AdvancedConfigForm'
import { AdminPointsRewards } from '@/components/admin/points-rewards/AdminPointsRewards'

import { AuthorizeMints } from '../AuthorizeMints'
import { PoolVersionIndicator } from '../fee-info/PoolVersionIndicator'
import { StakePoolImage } from '../StakePoolImage'
import { AdminFungibleRewards } from './fungible-rewards/AdminFungibleRewards'
import { Snapshot } from './Snapshot'
import { StakePoolBalance } from './StakePoolBalance'
import { StakePoolUpdate } from './StakePoolUpdate'

export type PANE_OPTIONS =
  | 'stake-pool'
  | 'mint-authorization'
  | 'fungible-rewards'
  | 'points'
  | 'snapshot'
  | 'advanced-config'

export const AdminStakePool = () => {
  const { environment } = useEnvironmentCtx()
  const { data: config } = useStakePoolMetadataCtx()
  const { data: stakePoolId } = useStakePoolId()
  const stakePool = useStakePoolData()
  const rewardDistributor = useRewardDistributorData()
  const [pane, setPane] = useState<PANE_OPTIONS>('stake-pool')
  const paneTabs: {
    label: JSX.Element
    value: PANE_OPTIONS
    disabled?: boolean
    tooltip?: string
  }[] = [
    {
      label: <div className="flex items-center gap-2">Stake pool</div>,
      value: 'stake-pool',
      tooltip: 'Edit stake pool',
    },
    {
      label: <div className="flex items-center gap-2">Mint authorization</div>,
      value: 'mint-authorization',
      disabled: !stakePool.data || !stakePool.data.parsed.requiresAuthorization,
      tooltip:
        !stakePool.data || !stakePool.data.parsed.requiresAuthorization
          ? 'Only applicable for stake pools that have mint list enabled'
          : 'Edit mint authorizations',
    },
    {
      label: <div className="flex items-center gap-2">Token Rewards</div>,
      value: 'fungible-rewards',
      disabled: !stakePool.data,
      tooltip: !stakePool.data
        ? 'Can be added after stake pool creation'
        : 'Edit reward distributor',
    },
    {
      label: <div className="flex items-center gap-2">Point Rewards</div>,
      disabled: !stakePool.data || !isStakePoolV2(stakePool.data.parsed),
      value: 'points',
      tooltip:
        !stakePool.data || !isStakePoolV2(stakePool.data.parsed)
          ? 'Create a new pool for access to point rewards'
          : 'Adjust point settings for tokens',
    },
    {
      label: <div className="flex items-center gap-2">Snapshot</div>,
      value: 'snapshot',
      disabled: !stakePool.data,
      tooltip: !stakePool.data
        ? `Enabled once pool is created to receive snapshot of staked tokens`
        : `Tool to get pool's snapshot of staked tokens`,
    },
    {
      label: <div className="flex items-center gap-2">Config</div>,
      value: 'advanced-config',
      tooltip: 'Set advanced configuration settings',
    },
  ]

  return (
    <div className="mx-auto flex w-full flex-grow flex-col items-center gap-6">
      <div className="flex w-full flex-col items-center justify-center gap-6">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="text-4xl text-light-0">
            {config?.displayName ?? shortPubKey(stakePoolId)}
          </div>
          <PoolVersionIndicator />
        </div>
        <div className="flex space-x-3">
          <a
            target="_blank"
            className="transition hover:text-blue-500"
            href={pubKeyUrl(stakePoolId, environment.label)}
            rel="noreferrer"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-[2px] border-gray-700 bg-gray-700 transition hover:border-orange-500">
              <Image src="/logos/solana-explorer.png" width={12} height={12} />
            </div>
          </a>
          <a
            className="transition hover:text-blue-500"
            href={withCluster(
              `/${config?.name ?? stakePoolId}`,
              environment.label
            )}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-[2px] border-gray-700 bg-gray-700 transition hover:border-orange-500">
              <LinkIcon className="h-4 w-4 text-gray-400" />
            </div>
          </a>
        </div>
        {stakePool.data && rewardDistributor.data && (
          <StakePoolBalance onClick={() => setPane('fungible-rewards')} />
        )}
        {stakePool.data && (
          <StakePoolImage onClick={() => setPane('advanced-config')} />
        )}
        <TabSelector<PANE_OPTIONS>
          defaultOption={paneTabs[0]}
          options={paneTabs}
          value={paneTabs.find((p) => p.value === pane)}
          onChange={(o) => {
            setPane(o.value)
          }}
        />
      </div>
      <div className="flex w-full max-w-[640px] flex-grow justify-center">
        {
          {
            'stake-pool': (
              <div className="mt-4">
                <StakePoolUpdate />{' '}
              </div>
            ),
            'mint-authorization': (
              <div className="mt-4">
                <AuthorizeMints />
              </div>
            ),
            'fungible-rewards': <AdminFungibleRewards />,
            points: <AdminPointsRewards />,
            snapshot: (
              <div className="mt-4 w-full">
                <Snapshot />
              </div>
            ),
            'advanced-config': (
              <div className="mt-4 w-full">
                <AdvancedConfigForm />
              </div>
            ),
          }[pane]
        }
      </div>
    </div>
  )
}
