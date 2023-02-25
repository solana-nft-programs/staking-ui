import {
  getBatchedMultipleAccounts,
  tryDecodeIdlAccount,
} from '@cardinal/common'
import { CONFIGS_IDL } from '@cardinal/configs/dist/cjs/programs/constants'
import { findConfigEntryId } from '@cardinal/configs/dist/cjs/programs/pda'
import type { IdlAccountData } from '@cardinal/rewards-center'
import { rewardsCenterProgram } from '@cardinal/rewards-center'
import { getAllStakePools } from '@cardinal/staking/dist/cjs/programs/stakePool/accounts'
import { useWallet } from '@solana/wallet-adapter-react'
import type { PublicKey } from '@solana/web3.js'
import { Keypair } from '@solana/web3.js'
import { useQuery } from '@tanstack/react-query'
import type { StakePoolMetadata } from 'api/mapping'
import { asWallet } from 'common/Wallets'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'

import { stakePoolDataToV2 } from './useStakePoolData'

export type StakePool = {
  stakePoolMetadata?: StakePoolMetadata
  stakePoolData: Pick<IdlAccountData<'stakePool'>, 'pubkey' | 'parsed'>
}

export const percentStaked = (stakePool: StakePool, minimum = 0) => {
  return stakePool.stakePoolMetadata?.maxStaked &&
    stakePool.stakePoolMetadata?.maxStaked > minimum
    ? ((stakePool.stakePoolData.parsed.totalStaked ?? 0) * 100) /
        stakePool.stakePoolMetadata?.maxStaked
    : undefined
}

export const totalStaked = (stakePool: StakePool) => {
  return stakePool.stakePoolData.parsed.totalStaked ?? 0
}

export const compareStakePools = (a: StakePool, b: StakePool) => {
  const pctAMin = percentStaked(a, 100)
  const pctA = percentStaked(a)
  const pctBMin = percentStaked(b, 100)
  const pctB = percentStaked(b)
  const totalA = totalStaked(a)
  const totalB = totalStaked(b)
  return pctAMin && pctBMin
    ? pctBMin - pctAMin
    : pctAMin
    ? -1
    : pctBMin
    ? 1
    : pctA
    ? -1
    : pctB
    ? 1
    : totalB - totalA
}

export const useAllStakePools = () => {
  const { connection } = useEnvironmentCtx()
  const wallet = useWallet()

  return useQuery<
    | {
        stakePoolsWithMetadata: StakePool[]
        stakePoolsWithoutMetadata: StakePool[]
      }
    | undefined
  >(['useAllStakePools'], async () => {
    const program = rewardsCenterProgram(connection, asWallet(wallet))
    const [stakePoolsV1, stakePoolsV2] = await Promise.all([
      getAllStakePools(connection),
      program.account.stakePool.all(),
    ])
    const allStakePoolDatas = [
      ...stakePoolsV1.map((pool) => {
        return {
          pubkey: pool.pubkey,
          parsed: stakePoolDataToV2(pool.parsed),
        }
      }),
      ...stakePoolsV2.map((pool) => {
        return {
          pubkey: pool.publicKey,
          parsed: pool.account,
        }
      }),
    ]
    const reverseConfigAccountInfos = await getBatchedMultipleAccounts(
      connection,
      allStakePoolDatas.map((stakePool) =>
        findConfigEntryId(
          Buffer.from('s', 'utf-8'),
          stakePool.pubkey.toBuffer()
        )
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

    const [stakePoolsWithMetadata, stakePoolsWithoutMetadata] =
      allStakePoolDatas.reduce(
        (acc, stakePoolData, index) => {
          const stakePoolMetadataInfo = configAccountInfos[index]
          if (stakePoolMetadataInfo) {
            try {
              const configEntry = tryDecodeIdlAccount<
                'configEntry',
                typeof CONFIGS_IDL
              >(stakePoolMetadataInfo, 'configEntry', CONFIGS_IDL)
              const stakePoolMetadata = JSON.parse(
                configEntry.parsed!.value
              ) as StakePoolMetadata
              return [
                [
                  ...acc[0],
                  {
                    stakePoolMetadata,
                    stakePoolData,
                  },
                ],
                acc[1],
              ]
            } catch (e) {
              console.log(e, stakePoolData, stakePoolData.pubkey.toString())
            }
          }
          return [
            acc[0],
            [
              ...acc[1],
              {
                stakePoolData,
              },
            ],
          ]
        },
        [[] as StakePool[], [] as StakePool[]]
      )
    return {
      stakePoolsWithMetadata: stakePoolsWithMetadata.sort((a, b) =>
        a
          .stakePoolMetadata!.name.toString()
          .localeCompare(b.stakePoolMetadata!.name.toString())
      ),
      stakePoolsWithoutMetadata: stakePoolsWithoutMetadata,
    }
  })
}
