import {
  getBatchedMultipleAccounts,
  tryDecodeIdlAccount,
} from '@cardinal/common'
import { CONFIGS_IDL } from '@cardinal/configs/dist/cjs/programs/constants'
import { findConfigEntryId } from '@cardinal/configs/dist/cjs/programs/pda'
import type { PublicKey } from '@solana/web3.js'
import { Keypair } from '@solana/web3.js'
import { useQuery } from '@tanstack/react-query'
import type { StakePoolMetadata } from 'api/mapping'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'

export const useStakePoolsMetadatas = (
  stakePoolIds: PublicKey[] | undefined
) => {
  const { connection } = useEnvironmentCtx()
  return useQuery<{ [mintId: string]: StakePoolMetadata }>(
    ['useStakePoolsMetadatas', stakePoolIds?.toString()],
    async () => {
      if (!stakePoolIds) return {}
      const reverseConfigAccountInfos = await getBatchedMultipleAccounts(
        connection,
        stakePoolIds.map((stakePoolId) =>
          findConfigEntryId(Buffer.from('s', 'utf-8'), stakePoolId.toBuffer())
        )
      )
      const configAccountInfos = await getBatchedMultipleAccounts(
        connection,
        reverseConfigAccountInfos.reduce((acc, info) => {
          if (info) {
            const configEntry = tryDecodeIdlAccount<
              'configEntry',
              typeof CONFIGS_IDL
            >(info, 'configEntry', CONFIGS_IDL)
            if (configEntry?.parsed?.extends) {
              return [...acc, configEntry.parsed.extends[0]!]
            } else {
              return acc
            }
          }
          return [...acc, Keypair.generate().publicKey]
        }, [] as PublicKey[])
      )
      return configAccountInfos.reduce((acc, configInfo) => {
        if (configInfo) {
          try {
            const configEntry = tryDecodeIdlAccount<
              'configEntry',
              typeof CONFIGS_IDL
            >(configInfo, 'configEntry', CONFIGS_IDL)
            const stakePoolMetadata = JSON.parse(
              configEntry.parsed!.value
            ) as StakePoolMetadata
            acc[stakePoolMetadata.stakePoolAddress.toString()] =
              stakePoolMetadata
          } catch (e) {}
        }
        return acc
      }, {} as { [id: string]: StakePoolMetadata })
    },
    {
      enabled: !!stakePoolIds && stakePoolIds?.length > 0,
    }
  )
}
