import { getBatchedMultipleAccounts } from '@cardinal/common'
import type { IdlAccountData } from '@cardinal/rewards-center'
import * as metaplex from '@metaplex-foundation/mpl-token-metadata'
import { useWallet } from '@solana/wallet-adapter-react'
import type { Connection, PublicKey } from '@solana/web3.js'
import { fetchStakeEntriesForUser } from 'api/fetchStakeEntry'
import { asWallet } from 'common/Wallets'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useQuery } from 'react-query'

import * as useAllowedTokenDatas from './useAllowedTokenDatas'
import { useStakePoolData } from './useStakePoolData'
import type { TokenListData } from './useTokenList'
import { useTokenList } from './useTokenList'
import { useWalletIds } from './useWalletIds'

export type StakeEntryTokenData = {
  tokenListData?: TokenListData
  metaplexData?: { pubkey: PublicKey; data: metaplex.MetadataData } | null
  stakeEntry:
    | Pick<IdlAccountData<'stakeEntry'>, 'pubkey' | 'parsed'>
    | null
    | undefined
}

export async function getStakeEntryDatas(
  connection: Connection,
  wallet: Parameters<typeof fetchStakeEntriesForUser>[1],
  stakePoolData: Pick<IdlAccountData<'stakePool'>, 'pubkey' | 'parsed'>,
  userId: PublicKey
): Promise<StakeEntryTokenData[]> {
  const stakeEntries = (
    await fetchStakeEntriesForUser(connection, wallet, stakePoolData, userId)
  ).filter(
    (entry) => entry.parsed?.pool.toString() === stakePoolData.pubkey.toString()
  )

  const metaplexIds = await Promise.all(
    stakeEntries.map(
      async (stakeEntry) =>
        (
          await metaplex.MetadataProgram.findMetadataAccount(
            stakeEntry.parsed!.stakeMint
          )
        )[0]
    )
  )
  const metaplexAccountInfos = await getBatchedMultipleAccounts(
    connection,
    metaplexIds
  )
  const metaplexData = metaplexAccountInfos.reduce(
    (acc, accountInfo, i) => {
      try {
        acc[stakeEntries[i]!.pubkey.toString()] = {
          pubkey: metaplexIds[i]!,
          ...accountInfo,
          data: metaplex.MetadataData.deserialize(
            accountInfo?.data as Buffer
          ) as metaplex.MetadataData,
        }
      } catch (e) {}
      return acc
    },
    {} as {
      [stakeEntryId: string]: {
        pubkey: PublicKey
        data: metaplex.MetadataData
      }
    }
  )

  return stakeEntries.map((stakeEntry) => ({
    stakeEntry,
    metaplexData: metaplexData[stakeEntry.pubkey.toString()],
  }))
}

export const useStakedTokenDatas = () => {
  const walletIds = useWalletIds()
  const wallet = useWallet()
  const tokenList = useTokenList()
  const { secondaryConnection } = useEnvironmentCtx()
  const { data: stakePoolData } = useStakePoolData()

  return useQuery<StakeEntryTokenData[] | undefined>(
    [
      useAllowedTokenDatas.TOKEN_DATAS_KEY,
      'stakedTokenDatas',
      stakePoolData?.pubkey?.toString(),
      walletIds.join(','),
      tokenList?.data?.length,
    ],
    async () => {
      if (
        !stakePoolData?.pubkey ||
        !walletIds ||
        walletIds.length <= 0 ||
        !stakePoolData ||
        !stakePoolData.parsed
      )
        return
      const stakeEntryDataGroups = await Promise.all(
        walletIds.map((walletId) =>
          getStakeEntryDatas(
            secondaryConnection,
            asWallet(wallet),
            stakePoolData,
            walletId
          )
        )
      )
      const tokenDatas = stakeEntryDataGroups.flat()
      const hydratedTokenDatas = tokenDatas.reduce((acc, tokenData) => {
        let tokenListData
        try {
          tokenListData = tokenList.data?.find(
            (t) =>
              t.address === tokenData.stakeEntry?.parsed?.stakeMint.toString()
          )
        } catch (e) {}

        if (tokenListData) {
          acc.push({
            ...tokenData,
            tokenListData: tokenListData,
          })
        } else {
          acc.push({
            ...tokenData,
            tokenListData: undefined,
          })
        }
        return acc
      }, [] as StakeEntryTokenData[])
      return hydratedTokenDatas
    },
    {
      enabled:
        tokenList.isFetched && !!stakePoolData?.pubkey && walletIds.length > 0,
    }
  )
}
