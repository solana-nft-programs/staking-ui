import * as splToken from '@solana/spl-token'
import { AccountData, tryGetAccount } from '@cardinal/common'
import { RewardDistributorData } from '@cardinal/staking/dist/cjs/programs/rewardDistributor'
import { getRewardDistributor } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/accounts'
import { findRewardDistributorId } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/pda'
import { StakePoolData } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { Keypair, PublicKey } from '@solana/web3.js'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useTokenList } from 'providers/TokenListProvider'
import { useMemo, useState } from 'react'

export interface UseRewardDistributorDataValues {
  rewardDistributor: AccountData<RewardDistributorData> | undefined
  refreshRewardDistributorData: (reload?: boolean) => void
  loadedRewardDistributorData: boolean
  refreshingRewardDistributorData: boolean
  rewardDistributorDataError: string | undefined
}

export const useRewardDistributorData = (
  stakedAddress: PublicKey | undefined | null,
  stakePool: AccountData<StakePoolData> | undefined
): UseRewardDistributorDataValues => {
  const { connection } = useEnvironmentCtx()
  const [rewardDistributorDataError, setRewardDistributorDataError] =
    useState<string>()
  const [rewardDistributor, setRewardDistributor] =
    useState<AccountData<RewardDistributorData>>()
  const [refreshingRewardDistributorData, setRefreshingRewardDistributorData] =
    useState<boolean>(false)
  const [loadedRewardDistributorData, setLoadedRewardDistributorData] =
    useState<boolean>(false)
  const { tokenList } = useTokenList()

  const refreshRewardDistributorData = async (reload?: boolean) => {
    if (!stakedAddress) {
      setRewardDistributorDataError(
        `Address not set please connect wallet to continue`
      )
      return
    }
    if (!stakePool) {
      setRewardDistributorDataError(`Invalid stake pool id`)
      return []
    }

    if (reload) {
      setLoadedRewardDistributorData(false)
    }
    setRewardDistributorDataError(undefined)

    try {
      // Reload reward distributor
      const [rewardDistributorId] = await findRewardDistributorId(
        stakePool.pubkey
      )
      let rewardDistributorAcc: AccountData<RewardDistributorData> | null
      rewardDistributorAcc = await tryGetAccount(() =>
        getRewardDistributor(connection, rewardDistributorId)
      )
      if (!rewardDistributorAcc) {
        return
      }
      setRewardDistributor(rewardDistributorAcc)

      // // Reload mint name
      // const tokenListData = tokenList.find(
      //   (tk) => tk.address === rewardDistributor?.parsed.rewardMint.toString()
      // )
      // if (tokenListData) {
      //   setRewardMintName(tokenListData.name)
      // }

      // if (rewardDistributor) {
      //   let mint = new splToken.Token(
      //     connection,
      //     rewardDistributor.parsed.rewardMint,
      //     splToken.TOKEN_PROGRAM_ID,
      //     Keypair.generate() // not used
      //   )
      //   setRewardMintInfo(await mint.getMintInfo())
      // }
    } catch (e) {
      console.log('Error fetching staked token datas', e)
      setRewardDistributorDataError(`${e}`)
    } finally {
      setLoadedRewardDistributorData(true)
      setRefreshingRewardDistributorData(false)
    }
  }

  useMemo(() => {
    void refreshRewardDistributorData()
  }, [(stakedAddress || '').toString(), stakePool?.pubkey.toString()])

  return {
    rewardDistributor,
    loadedRewardDistributorData,
    refreshRewardDistributorData,
    refreshingRewardDistributorData,
    rewardDistributorDataError,
  }
}
