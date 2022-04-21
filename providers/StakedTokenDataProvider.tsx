import { PublicKey } from '@solana/web3.js'
import { getStakeEntryDatas } from 'api/api'
import { StakeEntryTokenData, TokenData } from 'api/types'
import type { ReactChild } from 'react'
import React, { useCallback, useEffect, useState } from 'react'
import { useEnvironmentCtx } from './EnvironmentProvider'
import { useRouter } from 'next/router'
import { TokenListData, useTokenList } from './TokenListProvider'
import { useStakePoolData } from 'hooks/useStakePoolData'

export interface StakedTokenDataValues {
  stakedTokenDatas: TokenData[]
  refreshStakedTokenDatas: (reload?: boolean) => void
  setStakedTokenDatas: (newEnvironment: TokenData[]) => void
  setStakedAddress: (address: string) => void
  stakedLoaded: boolean
  stakedRefreshing: boolean
  stakedAddress: string | null
  error: string | null
}

const StakedTokenData: React.Context<StakedTokenDataValues> =
  React.createContext<StakedTokenDataValues>({
    stakedTokenDatas: [],
    refreshStakedTokenDatas: () => {},
    setStakedTokenDatas: () => {},
    setStakedAddress: () => {},
    stakedLoaded: false,
    stakedRefreshing: true,
    stakedAddress: null,
    error: null,
  })

export function StakedTokenDataProvider({
  children,
}: {
  children: ReactChild
}) {
  const router = useRouter()
  const { connection } = useEnvironmentCtx()
  const [stakedAddress, setStakedAddress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [stakedTokenDatas, setStakedTokenDatas] = useState<TokenData[]>([])
  const [stakedRefreshing, setStakedRefreshing] = useState<boolean>(false)
  const [stakedLoaded, setStakedLoaded] = useState<boolean>(false)
  const { tokenList } = useTokenList()
  const { data: stakePool } = useStakePoolData()

  const refreshStakedTokenDatas = useCallback(
    (reload?: boolean) => {
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
      getStakeEntryDatas(
        connection,
        stakePool.pubkey,
        new PublicKey(stakedAddress)
      )
        .then((tokenDatas) => {
          const hydratedTokenDatas = tokenDatas.reduce((acc, tokenData) => {
            let tokenListData: TokenListData | undefined
            try {
              tokenListData = tokenList.find(
                (t) =>
                  t.address ===
                  tokenData.stakeEntry?.parsed.originalMint.toString()
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
        })
        .catch((e) => {
          console.log(e)
          setError(`${e}`)
        })
        .finally(() => {
          setStakedLoaded(true)
          setStakedRefreshing(false)
        })
    },
    [connection, setError, stakedAddress, setStakedRefreshing]
  )

  useEffect(() => {
    const interval = setInterval(
      (function getTokenAccountsInterval(): () => void {
        refreshStakedTokenDatas()
        return getTokenAccountsInterval
      })(),
      20000
    )
    return () => clearInterval(interval)
  }, [refreshStakedTokenDatas])

  return (
    <StakedTokenData.Provider
      value={{
        stakedAddress,
        stakedTokenDatas,
        stakedLoaded,
        refreshStakedTokenDatas,
        setStakedTokenDatas,
        setStakedAddress,
        stakedRefreshing,
        error,
      }}
    >
      {children}
    </StakedTokenData.Provider>
  )
}

// export function useStakedTokenData(): StakedTokenDataValues {
//   return useContext(StakedTokenData)
// }
