import { AccountData } from '@cardinal/common'
import { getPendingRewardsForPool } from '../api/utils'
import { StakePoolData } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { BN } from '@project-serum/anchor'
import type { PublicKey } from '@solana/web3.js'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useMemo, useState } from 'react'
import { useRewardDistributorData } from './useRewardDistributorData'
import { useStakedTokenData } from './useStakedTokenDatas'
import { useUTCNow } from 'providers/UTCNowProvider'

export interface UseRewardsValues {
  claimableRewards: BN
  refreshRewards: (reload?: boolean) => void
  rewardsLoaded: boolean
  refreshingRewards: boolean
  stakedAddress: PublicKey | undefined | null
  error: string | null
}

export const useRewards = (
  stakedAddress: PublicKey | undefined | null,
  stakePool: AccountData<StakePoolData> | undefined
): UseRewardsValues => {
  const { connection } = useEnvironmentCtx()

  const { rewardDistributor } = useRewardDistributorData(
    stakedAddress,
    stakePool
  )

  const { UTCNow } = useUTCNow()

  const { stakedTokenDatas } = useStakedTokenData(stakedAddress, stakePool)

  const [error, setError] = useState<string | null>(null)
  const [claimableRewards, setClaimableRewards] = useState<BN>(new BN(0))
  const [refreshingRewards, setRefreshingRewards] = useState<boolean>(false)
  const [rewardsLoaded, setRewardsLoaded] = useState<boolean>(false)

  const refreshRewards = async (reload?: boolean) => {
    if (!stakedAddress) {
      setError(`Address not set please connect wallet to continue`)
      return
    }

    if (!stakePool) {
      setError(`Invalid stake pool id`)
      return
    }

    if (reload) {
      setRewardsLoaded(false)
    }

    setRefreshingRewards(true)
    setError(null)

    if (rewardDistributor) {
      try {
        let mintIds: PublicKey[] = []
        stakedTokenDatas.forEach((tk) => {
          if (!tk || !tk.stakeEntry) {
            return
          }
          mintIds.push(tk.stakeEntry?.parsed.originalMint!)
        })
        const rewards = await getPendingRewardsForPool(
          connection,
          stakedAddress,
          mintIds,
          rewardDistributor,
          UTCNow
        )
        setClaimableRewards(rewards)
      } catch (e) {
        console.log('Error fetching rewards', e)
        setError(`${e}`)
      } finally {
        setRewardsLoaded(true)
        setRefreshingRewards(false)
      }
    }
  }

  useMemo(() => {
    void refreshRewards()
  }, [
    (stakedAddress || '').toString(),
    stakePool?.pubkey.toString(),
    rewardDistributor?.pubkey.toString(),
  ])

  return {
    stakedAddress,
    claimableRewards,
    rewardsLoaded,
    refreshRewards,
    refreshingRewards,
    error,
  }
}
