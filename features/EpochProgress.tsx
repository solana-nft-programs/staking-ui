import React from 'react'
import { ProgressBar } from 'common/ProgressBar'
import { roundXDigitValue } from 'common/utils'
import { MouseoverTooltip } from 'common/Tooltip'
import { useSentriesStats } from 'hooks/useSentriesStats'

export default function EpochProgress() {
  const epochStats = useSentriesStats()

  if (!epochStats.isFetched) return null

  const data = epochStats?.data
  const percentage = formatPct(data?.epochPct || 0)

  return (
    <MouseoverTooltip title={`Epoch ${data?.epoch}`}>
      <div className="xs:hidden sm:hidden md:block lg:block w-full text-center group">
        <span className="text-[12px] text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity"></span>
        <div className="w-full text-center flex items-center gap-2 -mt-2">
            <div className="w-full">
              <h2>Epoch {data?.epoch} ({data?.epochTimeLeft})</h2>
              <ProgressBar color="grey" value={parseFloat(percentage)} />
            </div>
          <div className="w-1/12 mt-2">
            <br />
            <span className="inline-block text-sm text-neutral-600">
              {percentage}%
            </span>
          </div>
        </div>
      </div>
    </MouseoverTooltip>
  )
}

function formatPct(pct: number) {
  return Number.isInteger(pct)
    ? pct.toString() 
    : roundXDigitValue(pct * 100)
}