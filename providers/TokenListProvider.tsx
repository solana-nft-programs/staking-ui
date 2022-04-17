import { getMintsDetails } from 'common/utils'
import type { ReactChild } from 'react'
import React, { useCallback, useContext, useEffect, useState } from 'react'

export type TokenListData = {
  chainId: number
  address: string
  symbol: string
  name: string
  decimals: number
  logoURI: string
  tags: string[]
}

export interface TokenListValues {
  tokenList: TokenListData[]
  setTokenList: (newEnvironment: TokenListData[]) => void
  loaded: boolean
  refreshing: boolean
  error: string | null
}

const TokenList: React.Context<TokenListValues> =
  React.createContext<TokenListValues>({
    tokenList: [],
    setTokenList: () => {},
    loaded: false,
    refreshing: true,
    error: null,
  })

export function TokenListProvider({ children }: { children: ReactChild }) {
  const [error, setError] = useState<string | null>(null)
  const [tokenList, setTokenList] = useState<TokenListData[]>([])
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [loaded, setLoaded] = useState<boolean>(false)

  useEffect(() => {
    const fetchData = async () => {
      const data = await getMintsDetails()
      setTokenList(data)
    }
    fetchData().catch(console.error)
  }, [])

  return (
    <TokenList.Provider
      value={{
        tokenList,
        loaded,
        setTokenList,
        refreshing,
        error,
      }}
    >
      {children}
    </TokenList.Provider>
  )
}

export function useTokenList(): TokenListValues {
  return useContext(TokenList)
}
