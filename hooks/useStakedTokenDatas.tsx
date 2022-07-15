import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useStakePoolId } from './useStakePoolId'
import { useWalletIds } from './useWalletIds'
import { useQuery } from 'react-query'
import { Connection, PublicKey } from '@solana/web3.js'
import { AccountData } from '@cardinal/stake-pool'
import * as metaplex from '@metaplex-foundation/mpl-token-metadata'
import { StakeEntryData } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { TokenListData, useTokenList } from './useTokenList'
import { getStakeEntriesForUser } from '@cardinal/staking/dist/cjs/programs/stakePool/accounts'
import { getBatchedMultipleAccounts } from '@cardinal/common'

export type StakeEntryTokenData = {
  tokenListData?: TokenListData
  metaplexData?: { pubkey: PublicKey; data: metaplex.MetadataData } | null
  metadata?:
    | {
        pubkey: PublicKey
        data: any
      }
    | undefined
    | null
  stakeEntry: AccountData<StakeEntryData> | null | undefined
}

export async function getStakeEntryDatas(
  connection: Connection,
  stakePoolId: PublicKey,
  userId: PublicKey
): Promise<StakeEntryTokenData[]> {
  const stakeEntries = (
    await getStakeEntriesForUser(connection, userId)
  ).filter((entry) => entry.parsed.pool.toString() === stakePoolId.toString())

  const metaplexIds = await Promise.all(
    stakeEntries.map(
      async (stakeEntry) =>
        (
          await metaplex.MetadataProgram.findMetadataAccount(
            stakeEntry.parsed.originalMint
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

  const metadata = await Promise.all(
    Object.values(metaplexData).map(async (md, i) => {
      try {
        if (!md) return null
        const json = await fetch(md.data.data.uri).then((r) => r.json())
        return {
          pubkey: md.pubkey!,
          data: json,
        }
      } catch (e) {
        return null
      }
    })
  )

  return stakeEntries.map((stakeEntry) => ({
    stakeEntry,
    metaplexData: metaplexData[stakeEntry.pubkey.toString()],
    metadata: metadata.find((data) =>
      data
        ? data.pubkey.toBase58() ===
          metaplexData[stakeEntry.pubkey.toString()]?.pubkey.toBase58()
        : undefined
    ),
  }))
}

export const useStakedTokenDatas = () => {
  const stakePoolId = useStakePoolId()
  const walletIds = useWalletIds()
  const { data: tokenList } = useTokenList()
  const { secondaryConnection } = useEnvironmentCtx()
  return useQuery<StakeEntryTokenData[] | undefined>(
    [
      'stakedTokenDatas',
      stakePoolId?.toString(),
      walletIds.join(','),
      tokenList?.length,
    ],
    async () => {
      if (!stakePoolId || !walletIds || walletIds.length <= 0) return
      const stakeEntryDataGroups = await Promise.all(
        walletIds.map((walletId) =>
          getStakeEntryDatas(secondaryConnection, stakePoolId, walletId)
        )
      )
      const tokenDatas = stakeEntryDataGroups.flat()
      const hydratedTokenDatas = tokenDatas.reduce((acc, tokenData) => {
        let tokenListData
        try {
          tokenListData = tokenList?.find(
            (t) =>
              t.address === tokenData.stakeEntry?.parsed.originalMint.toString()
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
    { refetchInterval: 30000, enabled: !!stakePoolId && walletIds.length > 0 }
  )
}
