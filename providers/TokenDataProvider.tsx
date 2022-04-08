import type { TokenData } from 'api/api'
import { getTokenAccountsWithData } from 'api/api'
import type { ReactChild } from 'react'
import React, { useCallback, useContext, useEffect, useState } from 'react'

import { useEnvironmentCtx } from './EnvironmentProvider'

export interface UserTokenDataValues {
  tokenDatas: TokenData[]
  refreshTokenAccounts: () => void
  setTokenDatas: (newEnvironment: TokenData[]) => void
  setAddress: (address: string) => void
  loaded: boolean
  refreshing: boolean
  address: string | null
  error: string | null
}

const UserTokenData: React.Context<UserTokenDataValues> =
  React.createContext<UserTokenDataValues>({
    tokenDatas: [],
    refreshTokenAccounts: () => {},
    setTokenDatas: () => {},
    setAddress: () => {},
    loaded: false,
    refreshing: true,
    address: null,
    error: null,
  })

export function TokenAccountsProvider({ children }: { children: ReactChild }) {
  const { connection } = useEnvironmentCtx()
  const [address, setAddress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [tokenDatas, setTokenDatas] = useState<TokenData[]>([])
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [loaded, setLoaded] = useState<boolean>(false)

  const refreshTokenAccounts = useCallback(() => {
    if (!address) {
      setError(`Address not set please connect wallet to continue`)
      return
    }

    setRefreshing(true)
    setError(null)
    getTokenAccountsWithData(connection, address)
      .then((tokenDatas) => {
        let tokensWithMetadata = tokenDatas.filter((td) => td.metadata)
        // tokensWithMetadata = filterTokens(config.filters, tokensWithMetadata)
        setTokenDatas(tokensWithMetadata)
      })
      .catch((e) => {
        console.log(e)
        setError(`${e}`)
      })
      .finally(() => {
        setLoaded(true)
        setRefreshing(false)
      })
  }, [connection, setError, address, setRefreshing])

  useEffect(() => {
    const interval = setInterval(
      (function getTokenAccountsInterval(): () => void {
        refreshTokenAccounts()
        return getTokenAccountsInterval
      })(),
      10000
    )
    return () => clearInterval(interval)
  }, [refreshTokenAccounts])

  return (
    <UserTokenData.Provider
      value={{
        address,
        tokenDatas,
        loaded,
        refreshTokenAccounts,
        setTokenDatas,
        setAddress,
        refreshing,
        error,
      }}
    >
      {children}
    </UserTokenData.Provider>
  )
}

export function useUserTokenData(): UserTokenDataValues {
  return useContext(UserTokenData)
}
