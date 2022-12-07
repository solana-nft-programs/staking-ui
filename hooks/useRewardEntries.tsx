import type { IdlAccountData, RewardEntry } from '@cardinal/rewards-center'
import {
  fetchIdlAccountDataById,
  findRewardEntryId as findRewardEntryIdV2,
} from '@cardinal/rewards-center'
import { getRewardEntries } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/accounts'
import { findRewardEntryId } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/pda'
import { rewardEntryDataToV2 } from 'api/fetchRewardEntry'
import { REWARD_QUERY_KEY } from 'handlers/useHandleClaimRewards'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useQuery } from 'react-query'

import {
  isRewardDistributorV2,
  useRewardDistributorData,
} from './useRewardDistributorData'
import { useStakedTokenDatas } from './useStakedTokenDatas'

export const useRewardEntries = () => {
  const { data: rewardDistibutorData } = useRewardDistributorData()
  const { data: stakedTokenDatas } = useStakedTokenDatas()
  const { secondaryConnection } = useEnvironmentCtx()
  const { connection } = useEnvironmentCtx()

  return useQuery<
    Pick<IdlAccountData<'rewardEntry'>, 'pubkey' | 'parsed'>[] | undefined
  >(
    [
      REWARD_QUERY_KEY,
      'useRewardEntries',
      rewardDistibutorData?.pubkey?.toString(),
      stakedTokenDatas?.map((s) => s.stakeEntry?.pubkey.toString()).join(','),
    ],
    async () => {
      const rewardDistibutorId = rewardDistibutorData?.pubkey
      if (
        !rewardDistibutorData ||
        !stakedTokenDatas ||
        !rewardDistibutorId ||
        !rewardDistibutorData.parsed
      ) {
        return []
      }

      const stakeEntryIds = stakedTokenDatas
        .filter((tk) => tk && tk.stakeEntry)
        .map((tk) => tk.stakeEntry!)
        .map((entry) => entry.pubkey)
      if (isRewardDistributorV2(rewardDistibutorData.parsed)) {
        const rewardEntryIds = await Promise.all(
          stakeEntryIds.map(async (stakeEntryId) =>
            findRewardEntryIdV2(rewardDistibutorId, stakeEntryId)
          )
        )

        const idlData = await fetchIdlAccountDataById(
          connection,
          rewardEntryIds
        )
        const rewardEntryData = Object.values(idlData).reduce(
          (acc, account) => {
            if (account.type === 'rewardEntry') {
              return [...acc, account]
            }
            return acc
          },
          [] as RewardEntry[]
        )

        return rewardEntryData
      } else {
        const rewardEntryIds = await Promise.all(
          stakeEntryIds.map(
            async (stakeEntryId) =>
              (
                await findRewardEntryId(rewardDistibutorId, stakeEntryId)
              )[0]
          )
        )

        return (await getRewardEntries(secondaryConnection, rewardEntryIds))
          .filter((rewardEntry) => rewardEntry.parsed)
          .map((entry) => {
            return {
              pubkey: entry.pubkey,
              parsed: rewardEntryDataToV2(entry.parsed),
            }
          })
      }
    }
  )
}
