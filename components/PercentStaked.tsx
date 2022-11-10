import type { StakePool } from 'hooks/useAllStakePools'

import {
  percentStaked,
  totalStaked,
  useStakePoolEntryCounts,
} from '../hooks/useStakePoolEntryCounts'

export const PercentStaked = ({ stakePool }: { stakePool: StakePool }) => {
  const stakePoolEntryCounts = useStakePoolEntryCounts()
  const { stakePoolMetadata, stakePoolData } = stakePool
  const poolId =
    stakePoolMetadata?.stakePoolAddress.toString() ??
    stakePoolData?.pubkey.toString() ??
    ''
  return (
    <div>
      {stakePoolMetadata?.maxStaked &&
      stakePoolEntryCounts.data &&
      stakePoolEntryCounts.data[poolId] ? (
        <div>
          <div>
            {(
              percentStaked(stakePoolMetadata, stakePoolEntryCounts.data) ?? 0
            ).toFixed(2)}
            %
          </div>
        </div>
      ) : (
        totalStaked(stakePoolMetadata, stakePoolEntryCounts.data ?? {}) || '-'
      )}
    </div>
  )
}
