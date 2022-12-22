import { pubKeyUrl, shortPubKey } from '@cardinal/common'
import type { PublicKey } from '@solana/web3.js'
import { TabSelector } from 'common/TabSelector'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { useRewardDistributorTokenAccount } from 'hooks/useRewardDistributorTokenAccount'
import { useStakePoolData } from 'hooks/useStakePoolData'
import { useStakePoolId } from 'hooks/useStakePoolId'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useState } from 'react'

import { StakePoolBalance } from '@/components/admin/StakePoolBalance'

import { AuthorizeMints } from '../AuthorizeMints'
import { MintMultiplierLookup } from '../MintMultiplierLookup'
import { MintMultipliers } from '../MintMultipliers'
import { StakePoolImage } from '../StakePoolImage'
import { ReclaimFunds } from './ReclaimFunds'
import { RewardDistributorUpdate } from './RewardDistributorUpdate'
import { StakePoolUpdate } from './StakePoolUpdate'
import { TransferFunds } from './TransferFunds'
import Image from 'next/image'
import { LinkIcon } from '@heroicons/react/24/outline'
import { withCluster } from 'common/utils'

export type PANE_OPTIONS =
  | 'stake-pool'
  | 'mint-authorization'
  | 'reward-distributor'
  | 'reward-multipliers'
  | 'reward-funds'

export const AdminStakePool = ({
  onSuccess,
}: {
  onSuccess?: (p: PublicKey | undefined) => void
}) => {
  const { environment } = useEnvironmentCtx()
  const { data: config } = useStakePoolMetadata()
  const stakePoolId = useStakePoolId()
  const rewardDistributorTokenAccountData = useRewardDistributorTokenAccount()
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
      label: <div className="flex items-center gap-2">Reward distributor</div>,
      value: 'reward-distributor',
      disabled: !stakePool.data,
      tooltip: !stakePool.data
        ? 'Can be added after stake pool creation'
        : 'Edit reward distributor',
    },
    {
      label: <div className="flex items-center gap-2">Reward multipliers</div>,
      value: 'reward-multipliers',
      disabled: !rewardDistributor.data,
      tooltip: !rewardDistributor.data
        ? 'Only applicable for stake pools that have reward distribution'
        : 'Edit reward multipliers',
    },
    {
      label: <div className="flex items-center gap-2">Reward funds</div>,
      value: 'reward-funds',
      disabled: !rewardDistributor.data,
      tooltip: !rewardDistributor.data
        ? 'Only applicable for stake pools that have reward distribution'
        : 'Manage reward distributor funds',
    },
  ]

  return (
    <div className="mx-auto flex w-full flex-grow flex-col items-center gap-6">
      <div className="flex w-full flex-col items-center justify-center gap-6">
        <div
          className="text-4xl text-light-0"
          style={{ color: config?.colors?.fontColor }}
        >
          {config?.displayName ?? shortPubKey(stakePoolId)}
        </div>
        <div className="flex space-x-3">
          <a
            target="_blank"
            className="transition hover:text-blue-500"
            href={pubKeyUrl(stakePoolId, environment.label)}
            rel="noreferrer"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 outline outline-gray-700 hover:outline-orange-500">
              <Image src="/logos/solana-explorer.png" width={12} height={12} />
            </div>
          </a>
          <a
            className="transition hover:text-blue-500"
            href={withCluster(`/${stakePoolId}`, environment.label)}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 outline outline-gray-700 hover:outline-orange-500">
              <LinkIcon className="h-4 w-4 text-gray-400" />
            </div>
          </a>
        </div>
        {stakePool.data && <StakePoolBalance setPane={setPane} />}
        {stakePool.data && <StakePoolImage />}
        <TabSelector<PANE_OPTIONS>
          defaultOption={paneTabs[0]}
          options={paneTabs}
          value={paneTabs.find((p) => p.value === pane)}
          onChange={(o) => {
            setPane(o.value)
          }}
        />
      </div>
      <div className="mt-4 flex w-full max-w-[640px] flex-grow justify-center">
        {
          {
            'stake-pool': <StakePoolUpdate onSuccess={onSuccess} />,
            'mint-authorization': <AuthorizeMints />,
            'reward-distributor': <RewardDistributorUpdate />,
            'reward-multipliers': (
              <div>
                <MintMultiplierLookup />
                <MintMultipliers />
              </div>
            ),
            'reward-funds': (
              <div className="w-full">
                <ReclaimFunds />
                <TransferFunds />
              </div>
            ),
          }[pane]
        }
      </div>
    </div>
  )
}
