import { TabSelector } from 'common/TabSelector'
import { useStakePoolData } from 'hooks/useStakePoolData'
import { useState } from 'react'

export type PANE_OPTIONS = 'points-lookup' | 'point-multipliers' | 'set-points'

export const AdminPointsRewards = () => {
  const stakePool = useStakePoolData()
  const [pane, setPane] = useState<PANE_OPTIONS>('points-lookup')
  const paneTabs: {
    label: JSX.Element
    value: PANE_OPTIONS
    disabled?: boolean
    tooltip?: string
  }[] = [
    {
      label: <div className="flex items-center gap-2">Point Lookup</div>,
      value: 'points-lookup',
      disabled: !stakePool.data,
      tooltip: 'Lookup points for tokens',
    },
    {
      label: <div className="flex items-center gap-2">Point Multipliers</div>,
      value: 'point-multipliers',
      disabled: !stakePool.data,
      tooltip: 'Set points multipliers for tokens',
    },
    {
      label: <div className="flex items-center gap-2">Set Points</div>,
      value: 'set-points',
      disabled: !stakePool.data,
      tooltip: 'Set point values for tokens',
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
            'points-lookup': <div className="w-full"></div>,
            'point-multipliers': <div className="w-full"></div>,
            'set-points': <div className="w-full"></div>,
          }[pane]
        }
      </div>
    </div>
  )
}
