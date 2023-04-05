import { TabSelector } from 'common/TabSelector'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { useStakePoolData } from 'hooks/useStakePoolData'
import { useState } from 'react'

import { AdminClaimRewardsForHolders } from '@/components/admin/fungible-rewards/AdminClaimRewardsForHolders'
import { MintMultiplierLookup } from '@/components/admin/fungible-rewards/MintMultiplierLookup'
import { MintMultipliers } from '@/components/admin/fungible-rewards/MintMultipliers'
import { ReclaimFunds } from '@/components/admin/fungible-rewards/ReclaimFunds'
import { RewardDistributorUpdate } from '@/components/admin/fungible-rewards/RewardDistributorUpdate'
import { TransferFunds } from '@/components/admin/fungible-rewards/TransferFunds'

export type PANE_OPTIONS =
  | 'reward-distributor'
  | 'reward-multipliers'
  | 'reward-funds'
  | 'claim-rewards'

export const AdminFungibleRewards = () => {
  const stakePool = useStakePoolData()
  const rewardDistributor = useRewardDistributorData()
  const [pane, setPane] = useState<PANE_OPTIONS>('reward-distributor')
  const paneTabs: {
    label: JSX.Element
    value: PANE_OPTIONS
    disabled?: boolean
    tooltip?: string
  }[] = [
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
    {
      label: <div className="flex items-center gap-2">Claim rewards</div>,
      value: 'claim-rewards',
      disabled: !rewardDistributor.data,
      tooltip: !rewardDistributor.data
        ? 'Only applicable for stake pools that have reward distribution'
        : 'Claim rewards for holders',
    },
  ]

  return (
    <div className="flex w-full flex-col items-center justify-center gap-6">
      <TabSelector<PANE_OPTIONS>
        defaultOption={paneTabs[0]}
        options={paneTabs}
        value={paneTabs.find((p) => p.value === pane)}
        onChange={(o) => {
          setPane(o.value)
        }}
      />
      <div className="flex w-full max-w-[640px] flex-grow justify-center">
        {
          {
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
            'claim-rewards': <AdminClaimRewardsForHolders />,
          }[pane]
        }
      </div>
    </div>
  )
}
