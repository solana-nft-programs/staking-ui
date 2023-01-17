import type { StakePool } from 'hooks/useAllStakePools'

import { percentStaked, totalStaked } from '../hooks/useAllStakePools'

export const PercentStaked = ({ stakePool }: { stakePool: StakePool }) => {
  const { stakePoolMetadata, stakePoolData } = stakePool
  return (
    <div>
      {stakePoolMetadata?.maxStaked && stakePoolData ? (
        <div>
          <div>{(percentStaked(stakePool) ?? 0).toFixed(2)}%</div>
        </div>
      ) : (
        totalStaked(stakePool) || '-'
      )}
    </div>
  )
}
