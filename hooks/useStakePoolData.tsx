import * as splToken from '@solana/spl-token'
import { AccountData } from '@cardinal/common'
import { StakePoolData } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { Keypair, PublicKey } from '@solana/web3.js'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useTokenList } from 'providers/TokenListProvider'
import { useMemo, useState } from 'react'
import { useRewardDistributorData } from './useRewardDistributorData'

export interface UseRewardMintInfoValues {
  rewardRewardMintInfo: (reload?: boolean) => void
  loadedRewardMintInfo: boolean
  refreshingRewardMintInfo: boolean
  rewardMintInfoError: string | undefined
  rewardMintInfo: splToken.MintInfo | undefined
  rewardMintName: string
}

export const useRewardMintInfo = (
  stakedAddress: PublicKey | undefined | null,
  stakePoolId: PublicKey | undefined
): UseRewardMintInfoValues => {
  const { connection } = useEnvironmentCtx()
  const { rewardDistributor } = useRewardDistributorData(
    stakedAddress,
    stakePool
  )
  const [rewardMintInfoError, setRewardMintInfoError] = useState<string>()
  const [rewardMintInfo, setRewardMintInfo] = useState<splToken.MintInfo>()
  const [rewardMintName, setRewardMintName] = useState('')
  const [refreshingRewardMintInfo, setRefreshingRewardMintInfo] =
    useState<boolean>(false)
  const [loadedRewardMintInfo, setLoadedRewardMintInfo] =
    useState<boolean>(false)
  const { tokenList } = useTokenList()

  const rewardRewardMintInfo = async (reload?: boolean) => {
    if (reload) {
      setLoadedRewardMintInfo(false)
    }
    setRewardMintInfoError(undefined)

    try {
      // Reload mint name
      const tokenListData = tokenList.find(
        (tk) => tk.address === rewardDistributor?.parsed.rewardMint.toString()
      )
      if (tokenListData) {
        setRewardMintName(tokenListData.name)
      }

      if (rewardDistributor) {
        let mint = new splToken.Token(
          connection,
          rewardDistributor.parsed.rewardMint,
          splToken.TOKEN_PROGRAM_ID,
          Keypair.generate() // not used
        )
        setRewardMintInfo(await mint.getMintInfo())
      }
    } catch (e) {
      console.log('Error fetching staked token datas', e)
      setRewardMintInfoError(`${e}`)
    } finally {
      setLoadedRewardMintInfo(true)
      setRefreshingRewardMintInfo(false)
    }
  }

  useMemo(() => {
    void rewardRewardMintInfo()
  }, [rewardDistributor?.pubkey.toString()])

  return {
    loadedRewardMintInfo,
    rewardRewardMintInfo,
    refreshingRewardMintInfo,
    rewardMintInfoError,
    rewardMintInfo,
    rewardMintName,
  }
}
