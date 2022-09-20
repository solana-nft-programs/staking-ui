import { tryPublicKey } from '@cardinal/common'
import { getRewardEntry } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/accounts'
import { findRewardEntryId } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/pda'
import { findStakeEntryIdFromMint } from '@cardinal/staking/dist/cjs/programs/stakePool/utils'
import type { PublicKey } from '@solana/web3.js'
import { notify } from 'common/Notification'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useQuery } from 'react-query'

import { useRewardDistributorData } from './useRewardDistributorData'
import { useStakePoolId } from './useStakePoolId'
import { useWalletId } from './useWalletId'

export const useMintMultiplier = (mint: string) => {
  const stakePoolId = useStakePoolId()
  const walletId = useWalletId()
  const rewardDistributor = useRewardDistributorData()
  const { connection } = useEnvironmentCtx()
  return useQuery<number | undefined>(
    ['useMintMultiplier', mint?.toString()],
    async () => {
      if (!walletId) throw 'Wallet not found'
      if (!stakePoolId) throw 'No stake pool found'
      if (!rewardDistributor.data) throw 'No reward distributor found'
      const mintId = tryPublicKey(mint)
      if (!mintId) {
        notify({ message: 'Invalid mint' })
        return undefined
      }
      let stakeEntryId: PublicKey
      try {
        stakeEntryId = (
          await findStakeEntryIdFromMint(
            connection,
            walletId,
            stakePoolId,
            mintId
          )
        )[0]
      } catch (e) {
        throw 'Invalid mint ID or no reward entry for mint'
      }
      const [rewardEntryId] = await findRewardEntryId(
        rewardDistributor.data.pubkey,
        stakeEntryId
      )
      const rewardEntryData = await getRewardEntry(connection, rewardEntryId)
      return (
        rewardEntryData.parsed.multiplier.toNumber() /
        10 ** rewardDistributor.data.parsed.multiplierDecimals
      )
    },
    { enabled: !!stakePoolId && mint.length > 0 }
  )
}
