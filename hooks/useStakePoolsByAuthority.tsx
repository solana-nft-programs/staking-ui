import type { AccountData } from '@solana-nft-programs/common'
import type { IdlAccountData } from '@solana-nft-programs/rewards-center'
import { rewardsCenterProgram } from '@solana-nft-programs/rewards-center'
import type { StakePoolData } from '@solana-nft-programs/staking/dist/cjs/programs/stakePool'
import {
  STAKE_POOL_ADDRESS,
  STAKE_POOL_IDL,
} from '@solana-nft-programs/staking/dist/cjs/programs/stakePool'
import { BorshAccountsCoder, utils } from '@coral-xyz/anchor'
import type { Connection, PublicKey } from '@solana/web3.js'
import { useQuery } from '@tanstack/react-query'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'

import { stakePoolDataToV2 } from './useStakePoolData'
import { useWalletId } from './useWalletId'

export const getStakePoolsByAuthority = async (
  connection: Connection,
  user: PublicKey
): Promise<AccountData<StakePoolData>[]> => {
  const programAccounts = await connection.getProgramAccounts(
    STAKE_POOL_ADDRESS,
    {
      filters: [
        {
          memcmp: {
            offset: 0,
            bytes: utils.bytes.bs58.encode(
              BorshAccountsCoder.accountDiscriminator('stakePool')
            ),
          },
        },
        {
          memcmp: {
            offset: 17,
            bytes: user.toBase58(),
          },
        },
      ],
    }
  )
  const stakePoolDatas: AccountData<StakePoolData>[] = []
  const coder = new BorshAccountsCoder(STAKE_POOL_IDL)
  programAccounts.forEach((account) => {
    try {
      const stakePoolData: StakePoolData = coder.decode(
        'stakePool',
        account.account.data
      )
      if (stakePoolData) {
        stakePoolDatas.push({
          ...account,
          parsed: stakePoolData,
        })
      }
      // eslint-disable-next-line no-empty
    } catch (e) {}
  })
  return stakePoolDatas.sort((a, b) =>
    a.pubkey.toBase58().localeCompare(b.pubkey.toBase58())
  )
}

export const useStakePoolsByAuthority = () => {
  const { secondaryConnection } = useEnvironmentCtx()
  const walletId = useWalletId()

  return useQuery<
    Pick<IdlAccountData<'stakePool'>, 'pubkey' | 'parsed'>[] | undefined
  >(
    ['useStakePoolsByAuthority', walletId?.toString()],
    async () => {
      if (!walletId) return
      const stakePoolsV1 = (
        await getStakePoolsByAuthority(secondaryConnection, walletId)
      ).map((pool) => {
        return {
          pubkey: pool.pubkey,
          parsed: stakePoolDataToV2(pool.parsed),
        }
      })
      const stakePoolsV2 = (
        await rewardsCenterProgram(secondaryConnection).account.stakePool.all([
          {
            memcmp: {
              offset: 9,
              bytes: walletId.toString(),
            },
          },
        ])
      ).map((e) => {
        return { pubkey: e.publicKey, parsed: e.account }
      })
      return [...stakePoolsV1, ...stakePoolsV2]
    },
    {
      enabled: !!walletId,
    }
  )
}
