import { tryPublicKey } from '@cardinal/common'
import type { IdlAccountData } from '@cardinal/rewards-center'
import {
  fetchIdlAccount,
  findRewardEntryId as findRewardEntryIdV2,
  findStakeEntryId,
} from '@cardinal/rewards-center'
import { getRewardEntry } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/accounts'
import { findRewardEntryId } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/pda'
import { findStakeEntryIdFromMint } from '@cardinal/staking/dist/cjs/programs/stakePool/utils'
import type { PublicKey } from '@solana/web3.js'
import { useQuery } from '@tanstack/react-query'
import { notify } from 'common/Notification'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'

import {
  isRewardDistributorV2,
  useRewardDistributorData,
} from './useRewardDistributorData'
import { useStakePoolId } from './useStakePoolId'

export const useMintMultiplier = (mint: string) => {
  const { data: stakePoolId } = useStakePoolId()
  const rewardDistributor = useRewardDistributorData()
  const { connection } = useEnvironmentCtx()
  return useQuery<number | null>(
    ['useMintMultiplier', mint?.toString()],
    async () => {
      if (!stakePoolId) throw 'No stake pool found'
      if (!rewardDistributor.data || !rewardDistributor.data.parsed)
        throw 'No reward distributor found'
      const mintId = tryPublicKey(mint)
      if (!mintId) {
        notify({ message: 'Invalid mint' })
        return null
      }
      let stakeEntryId: PublicKey
      let rewardEntryData: Pick<
        IdlAccountData<'rewardEntry'>,
        'pubkey' | 'parsed'
      >
      if (isRewardDistributorV2(rewardDistributor.data.parsed)) {
        const stakeEntryId = findStakeEntryId(
          stakePoolId,
          mintId,
          // TODO change for fungible
          undefined,
          false
        )
        const rewardEntryId = findRewardEntryIdV2(
          rewardDistributor.data.pubkey,
          stakeEntryId
        )
        rewardEntryData = await fetchIdlAccount(
          connection,
          rewardEntryId,
          'rewardEntry'
        )
      } else {
        try {
          stakeEntryId = await findStakeEntryIdFromMint(
            connection,
            // TODO change for fungible
            stakePoolId,
            stakePoolId,
            mintId
          )
        } catch (e) {
          throw 'Invalid mint ID or no reward entry for mint'
        }
        const rewardEntryId = findRewardEntryId(
          rewardDistributor.data.pubkey,
          stakeEntryId
        )
        rewardEntryData = await getRewardEntry(connection, rewardEntryId)
      }
      if (!rewardEntryData.parsed) return null
      return (
        rewardEntryData.parsed.multiplier.toNumber() /
        10 ** (rewardDistributor.data.parsed?.multiplierDecimals || 0)
      )
    },
    { enabled: !!stakePoolId && mint.length > 0, retry: false }
  )
}
