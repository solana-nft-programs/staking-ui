import { AccountData } from '@cardinal/common'
import { StakePoolData } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { getTokenAccountsWithData, getTokenDatas } from 'api/api'
import { TokenData } from 'api/types'
import type { ReactChild } from 'react'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useEnvironmentCtx } from './EnvironmentProvider'
import { useRouter } from 'next/router'
import { handlePoolMapping } from 'common/utils'
import { TokenListData, useTokenList } from './TokenListProvider'

export interface UserTokenDataValues {
  tokenDatas: TokenData[]
  refreshTokenAccounts: (reload?: boolean) => void
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
  const router = useRouter()
  const { stakePoolId } = router.query
  const [stakePool, setStakePool] = useState<AccountData<StakePoolData>>()
  const { connection } = useEnvironmentCtx()
  const [address, setAddress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [tokenDatas, setTokenDatas] = useState<TokenData[]>([])
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [loaded, setLoaded] = useState<boolean>(false)
  const { tokenList } = useTokenList()

  useEffect(() => {
    if (stakePoolId) {
      const setData = async () => {
        const pool = await handlePoolMapping(connection, stakePoolId as string)
        setStakePool(pool)
      }
      setData().catch(console.error)
    }
  }, [stakePoolId])

  const refreshTokenAccounts = useCallback(
    (reload?: boolean) => {
      if (!address) {
        setError(`Address not set please connect wallet to continue`)
        return
      }

      if (!stakePool) {
        setError(`Invalid stake pool id`)
        return []
      }

      if (reload) {
        setLoaded(false)
      }

      setRefreshing(true)
      setError(null)
      getTokenAccountsWithData(connection, stakePool?.pubkey, address)
        .then(async (tokenDatas) => {
          const hydratedTokenDatas = tokenDatas.reduce((acc, tokenData) => {
            let tokenListData: TokenListData | undefined
            try {
              tokenListData = tokenList.find(
                (t) =>
                  t.address ===
                  tokenData.tokenAccount?.account.data.parsed.info.mint.toString()
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
          }, [] as TokenData[])

          setTokenDatas(hydratedTokenDatas)
        })
        .catch((e) => {
          console.log(e)
          setError(`${e}`)
        })
        .finally(() => {
          setLoaded(true)
          setRefreshing(false)
        })
    },
    [connection, setError, address, setRefreshing]
  )

  useEffect(() => {
    const interval = setInterval(
      (function getTokenAccountsInterval(): () => void {
        refreshTokenAccounts()
        return getTokenAccountsInterval
      })(),
      20000
    )
    return () => clearInterval(interval)
  }, [refreshTokenAccounts, tokenList])

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
