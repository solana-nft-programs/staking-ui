import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useStakePoolId } from './useStakePoolId'
import { getStakeEntryDatas } from 'api/api'
import { useWalletIds } from './useWalletIds'
import { useQuery } from 'react-query'
import { PublicKey } from '@solana/web3.js'
import { AccountData } from '@cardinal/stake-pool'
import * as metaplex from '@metaplex-foundation/mpl-token-metadata'
import { StakeEntryData } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { TokenListData, useTokenList } from './useTokenList'

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

export const useStakedTokenDatas = () => {
  const stakePoolId = useStakePoolId()
  const walletIds = useWalletIds()
  const { data: tokenList } = useTokenList()
  const { connection } = useEnvironmentCtx()
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
          getStakeEntryDatas(connection, stakePoolId, walletId)
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
        } else if (tokenData.metadata) {
          acc.push({
            ...tokenData,
            tokenListData: undefined,
          })
        }
        return acc
      }, [] as StakeEntryTokenData[])
      return hydratedTokenDatas
    },
    { refetchInterval: 10000 }
  )
}
