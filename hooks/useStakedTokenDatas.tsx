import { AccountData } from '@cardinal/common'
import { StakePoolData } from '@cardinal/staking/dist/cjs/programs/stakePool'
import type { PublicKey } from '@solana/web3.js'
import { getStakeEntryDatas } from 'api/api'
import { StakeEntryTokenData, TokenData } from 'api/types'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useTokenList } from 'providers/TokenListProvider'
import { useEffect, useMemo, useState } from 'react'

export interface UseStakedTokenDataValues {
  stakedTokenDatas: TokenData[]
  refreshStakedTokenDatas: (reload?: boolean) => void
  setStakedTokenDatas: (newEnvironment: TokenData[]) => void
  stakedLoaded: boolean
  stakedRefreshing: boolean
  stakedAddress: PublicKey | undefined | null
  error: string | null
}

export const useStakedTokenData = (
  stakedAddress: PublicKey | undefined | null,
  stakePool: AccountData<StakePoolData> | undefined
): UseStakedTokenDataValues => {
  const { connection } = useEnvironmentCtx()
  const [error, setError] = useState<string | null>(null)
  const [stakedTokenDatas, setStakedTokenDatas] = useState<TokenData[]>([])
  const [stakedRefreshing, setStakedRefreshing] = useState<boolean>(false)
  const [stakedLoaded, setStakedLoaded] = useState<boolean>(false)
  const { tokenList } = useTokenList()

  const refreshStakedTokenDatas = async (reload?: boolean) => {
    if (!stakedAddress) {
      setError(`Address not set please connect wallet to continue`)
      return
    }

    if (!stakePool) {
      setError(`Invalid stake pool id`)
      return []
    }

    if (reload) {
      setStakedLoaded(false)
    }

    setStakedRefreshing(true)
    setError(null)

    try {
      const tokenDatas = await getStakeEntryDatas(
        connection,
        stakePool.pubkey,
        stakedAddress
      )
      const hydratedTokenDatas = tokenDatas.reduce((acc, tokenData) => {
        let tokenListData
        try {
          tokenListData = tokenList.find(
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

      setStakedTokenDatas(hydratedTokenDatas)
    } catch (e) {
      console.log('Error fetching staked token datas', e)
      setError(`${e}`)
    } finally {
      setStakedLoaded(true)
      setStakedRefreshing(false)
    }
  }

  useMemo(() => {
    void refreshStakedTokenDatas()
  }, [(stakedAddress || '').toString(), stakePool?.pubkey.toString()])

  //   useEffect(() => {
  //     const interval = setInterval(
  //       (function getTokenAccountsInterval(): () => void {
  //         refreshStakedTokenDatas()
  //         return getTokenAccountsInterval
  //       })(),
  //       20000
  //     )
  //     return () => clearInterval(interval)
  //   }, [refreshStakedTokenDatas])

  return {
    stakedAddress,
    stakedTokenDatas,
    stakedLoaded,
    refreshStakedTokenDatas,
    setStakedTokenDatas,
    stakedRefreshing,
    error,
  }
}
