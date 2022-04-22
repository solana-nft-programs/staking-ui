import { getTokenAccountsWithData } from 'api/api'
import { TokenData } from 'api/types'
import type { ReactChild } from 'react'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useEnvironmentCtx } from './EnvironmentProvider'
import { TokenListData, useTokenList } from './TokenListProvider'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'

export interface UserTokenDataValues {
  tokenDatas: TokenData[]
  refreshTokenAccounts: (reload?: boolean) => Promise<void>
  setTokenDatas: (newEnvironment: TokenData[]) => void
  setAddress: (address: string) => void
  setStakePoolId: (stakePoolId: PublicKey) => void
  loaded: boolean
  refreshing: boolean
  address: string | undefined
  error: string | undefined
}

const UserTokenData: React.Context<UserTokenDataValues> =
  React.createContext<UserTokenDataValues>({
    tokenDatas: [],
    refreshTokenAccounts: async () => {},
    setTokenDatas: () => {},
    setAddress: () => {},
    setStakePoolId: () => {},
    loaded: false,
    refreshing: true,
    address: undefined,
    error: undefined,
  })

export function TokenAccountsProvider({ children }: { children: ReactChild }) {
  const { connection } = useEnvironmentCtx()
  const wallet = useWallet()
  const [address, setAddress] = useState<string>()
  const [stakePoolId, setStakePoolId] = useState<PublicKey>()
  const [error, setError] = useState<string>()
  const [tokenDatas, setTokenDatas] = useState<TokenData[]>([])
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [loaded, setLoaded] = useState<boolean>(false)
  const { tokenList } = useTokenList()

  useEffect(() => {
    if (wallet && wallet.connected && wallet.publicKey) {
      setAddress(wallet.publicKey.toBase58())
    }
  }, [wallet.publicKey?.toString()])

  const refreshTokenAccounts = useCallback(
    async (reload?: boolean) => {
      if (!address) {
        setError(`Address not set please connect wallet to continue`)
        return
      }

      if (reload) {
        setLoaded(false)
      }

      setRefreshing(true)
      setError(undefined)
      try {
        console.log('Fetching user token datas')
        const tokenDatas = await getTokenAccountsWithData(
          connection,
          address,
          stakePoolId
        )
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
      } catch (e) {
        console.log('Failed to get token datas: ', e)
        setError(`${e}`)
      } finally {
        setLoaded(true)
        setRefreshing(false)
      }
    },
    [connection, setError, address, stakePoolId?.toString(), setRefreshing]
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
        setStakePoolId,
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
