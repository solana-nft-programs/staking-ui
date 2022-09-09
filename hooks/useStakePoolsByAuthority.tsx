import type { AccountData } from '@cardinal/common'
import type { StakePoolData } from '@cardinal/staking/dist/cjs/programs/stakePool'
import {
  STAKE_POOL_ADDRESS,
  STAKE_POOL_IDL,
} from '@cardinal/staking/dist/cjs/programs/stakePool'
import { BorshAccountsCoder, utils } from '@project-serum/anchor'
import type { Connection, PublicKey } from '@solana/web3.js'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useQuery } from 'react-query'

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

  return useQuery<AccountData<StakePoolData>[] | undefined>(
    ['useStakePoolsByAuthority', walletId?.toString()],
    async () => {
      if (!walletId) return
      return getStakePoolsByAuthority(secondaryConnection, walletId)
    },
    {
      enabled: !!walletId,
    }
  )
}
