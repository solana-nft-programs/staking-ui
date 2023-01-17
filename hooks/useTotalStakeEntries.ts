import { getProgramIdlAccounts } from '@cardinal/rewards-center'
import {
  STAKE_POOL_ADDRESS,
  STAKER_OFFSET,
} from '@cardinal/staking/dist/cjs/programs/stakePool'
import { BorshAccountsCoder, utils } from '@project-serum/anchor'
import { PublicKey } from '@solana/web3.js'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useQuery } from 'react-query'

export const useTotalStakeEntries = () => {
  const { connection } = useEnvironmentCtx()

  // TODO move to cardinal-stats
  return useQuery(['useTotalStakeEntries'], async () => {
    const [
      v1UnstakedStakeEntriesCount,
      v1AllStakeEntriesCount,
      v2UnstakedStakeEntriesCount,
      v2AllStakeEntriesCount,
    ] = await Promise.all([
      connection.getProgramAccounts(STAKE_POOL_ADDRESS, {
        dataSlice: {
          offset: 0,
          length: 0,
        },
        filters: [
          {
            memcmp: {
              offset: 0,
              bytes: utils.bytes.bs58.encode(
                BorshAccountsCoder.accountDiscriminator('stakeEntry')
              ),
            },
          },
          {
            memcmp: {
              offset: STAKER_OFFSET,
              bytes: PublicKey.default.toBase58(),
            },
          },
        ],
      }),
      connection.getProgramAccounts(STAKE_POOL_ADDRESS, {
        dataSlice: {
          offset: 0,
          length: 0,
        },
        filters: [
          {
            memcmp: {
              offset: 0,
              bytes: utils.bytes.bs58.encode(
                BorshAccountsCoder.accountDiscriminator('stakeEntry')
              ),
            },
          },
        ],
      }),
      getProgramIdlAccounts(connection, 'stakeEntry', {
        dataSlice: {
          offset: 0,
          length: 0,
        },
        filters: [
          {
            memcmp: {
              offset: STAKER_OFFSET,
              bytes: PublicKey.default.toBase58(),
            },
          },
        ],
      }),
      getProgramIdlAccounts(connection, 'stakeEntry', {
        dataSlice: {
          offset: 0,
          length: 0,
        },
      }),
    ])
    return (
      v1AllStakeEntriesCount.length -
      v1UnstakedStakeEntriesCount.length +
      (v2AllStakeEntriesCount.length - v2UnstakedStakeEntriesCount.length)
    )
  })
}
