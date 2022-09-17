import React from 'react'
import { ProgressBar } from 'common/ProgressBar'
import { MouseoverTooltip } from 'common/Tooltip'
import { useSentriesStats } from 'hooks/useSentriesStats'

export default function EpochProgress() {
  const epochStats = useSentriesStats()

  if (epochStats.isFetched) {
    const data = epochStats?.data

    return (
      <MouseoverTooltip title={`Epoch ${data?.epoch}`}>
        <div className="w-full text-center group">
          <span className="text-[12px] text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity"></span>
          <div className="w-full text-center flex items-center gap-2 -mt-2">
              <div className="w-full">
                <ProgressBar color="grey" value={((data?.epochPct || 0) * 100) as number} />
              </div>
            <div className="w-1/12 mt-2">
              <span className="inline-block text-sm text-neutral-600">
                {(data?.epochPct || 0) * 100}%
              </span>
            </div>
          </div>
        </div>
      </MouseoverTooltip>
    )
  } else {
    return null
  }

}

