import * as splToken from '@solana/spl-token'
import { AccountData, findAta } from '@cardinal/common'
import { calculatePendingRewards, getRewardEntries } from '../api/utils'
import { StakePoolData } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { BN } from '@project-serum/anchor'
import { Keypair, PublicKey } from '@solana/web3.js'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useMemo, useState } from 'react'
import { useRewardDistributorData } from './useRewardDistributorData'
import { useStakedTokenData } from './useStakedTokenDatas'
import { useUTCNow } from 'providers/UTCNowProvider'
import { findRewardEntryId } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/pda'
import { RewardEntryData } from '@cardinal/staking/dist/cjs/programs/rewardDistributor'

export interface UseRewardsValues {
  rewardMap: { [mintId: string]: { claimableRewards: BN; nextRewardsIn: BN } }
  refreshRewards: (reload?: boolean) => void
  claimableRewards: BN
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
  const [rewardEntries, setRewardEntries] =
    useState<AccountData<RewardEntryData>[]>()

  const [
    rewardDistributorTokenAccountInfo,
    setRewardDistributorTokenAccountInfo,
  ] = useState<splToken.AccountInfo>()
  const [refreshingRewards, setRefreshingRewards] = useState<boolean>(false)
  const [rewardsLoaded, setRewardsLoaded] = useState<boolean>(false)
  const [rewardMap, setRewardMap] = useState<{
    [mintId: string]: { claimableRewards: BN; nextRewardsIn: BN }
  }>({})

  const refreshRewardDistributorAccount = async () => {
    if (rewardDistributor) {
      try {
        const rewardDistributorTokenAccount = await findAta(
          rewardDistributor.parsed.rewardMint,
          rewardDistributor.pubkey,
          true
        )
        const rewardMint = new splToken.Token(
          connection,
          rewardDistributor.parsed.rewardMint,
          splToken.TOKEN_PROGRAM_ID,
          Keypair.generate() // not used
        )
        const rewardDistributorTokenAccountInfo =
          await rewardMint.getAccountInfo(rewardDistributorTokenAccount)
        setRewardDistributorTokenAccountInfo(rewardDistributorTokenAccountInfo)
      } catch (e) {
        console.log('Error fetching reward distributor account info', e)
        setError(`${e}`)
      }
    }
  }

  const refreshRewardEntries = async (reload?: boolean) => {
    if (rewardDistributor) {
      try {
        const stakeEntries = stakedTokenDatas
          .filter((tk) => tk && tk.stakeEntry)
          .map((tk) => tk.stakeEntry!)

        const mintIds = stakeEntries.map((entry) => entry.parsed.originalMint)

        const rewardEntryIds = await Promise.all(
          mintIds.map(
            async (mintId) =>
              (
                await findRewardEntryId(rewardDistributor.pubkey, mintId)
              )[0]
          )
        )

        const rewardEntries = await getRewardEntries(connection, rewardEntryIds)
        setRewardEntries(rewardEntries)
      } catch (e) {
        console.log('Error fetching rewards', e)
        setError(`${e}`)
      }
    }
  }

  const refreshRewardMap = () => {
    const rewardMap: {
      [mintId: string]: { claimableRewards: BN; nextRewardsIn: BN }
    } = {}
    if (
      rewardDistributor &&
      rewardEntries &&
      rewardDistributorTokenAccountInfo
    ) {
      const stakeEntries = stakedTokenDatas
        .filter((tk) => tk && tk.stakeEntry)
        .map((tk) => tk.stakeEntry!)

      const mintIds = stakeEntries.map((entry) => entry.parsed.originalMint)

      for (let i = 0; i < mintIds.length; i++) {
        const mintId = mintIds[i]
        const stakeEntry = stakeEntries[i]
        const rewardEntry = rewardEntries[i]
        if (mintId && stakeEntry && rewardEntry) {
          const [claimableRewards, nextRewardsIn] = calculatePendingRewards(
            rewardDistributor,
            stakeEntry,
            rewardEntry,
            rewardDistributorTokenAccountInfo.amount,
            UTCNow
          )
          rewardMap[mintId.toString()] = {
            claimableRewards,
            nextRewardsIn,
          }
        }
      }
    }

    setRewardMap(rewardMap)
  }

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
        await refreshRewardDistributorAccount()
        await refreshRewardEntries()
        // let mintIds: PublicKey[] = []
        // stakedTokenDatas.forEach((tk) => {
        //   if (!tk || !tk.stakeEntry) {
        //     return
        //   }
        //   mintIds.push(tk.stakeEntry?.parsed.originalMint!)
        // })
        // const rewards = await getPendingRewardsForPool(
        //   connection,
        //   stakedAddress,
        //   mintIds,
        //   rewardDistributor,
        //   UTCNow
        // )
        // console.log(rewards.toString(), UTCNow)
        // setClaimableRewards(rewards)
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
    stakedTokenDatas,
  ])

  useMemo(() => {
    void refreshRewardMap()
  }, [
    (stakedAddress || '').toString(),
    stakePool?.pubkey.toString(),
    rewardDistributor?.pubkey.toString(),
    UTCNow,
  ])

  const claimableRewards = Object.values(rewardMap).reduce(
    (acc, { claimableRewards }) => acc.add(claimableRewards),
    new BN(0)
  )

  return {
    stakedAddress,
    rewardMap,
    claimableRewards,
    rewardsLoaded,
    refreshRewards,
    refreshingRewards,
    error,
  }
}
