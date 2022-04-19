import { PublicKey } from '@solana/web3.js'
import { getTokenAccountsWithData, getTokenDatas } from 'api/api'
import { getStakeEntryDatas } from 'api/api'
import { StakeEntryTokenData, TokenData } from 'api/types'
import type { ReactChild } from 'react'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useEnvironmentCtx } from './EnvironmentProvider'
import { useRouter } from 'next/router'
import { StakePoolData } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { AccountData } from '@cardinal/common'
import { handlePoolMapping } from 'common/utils'
import { TokenListData, useTokenList } from './TokenListProvider'

export interface StakedTokenDataValues {
  stakedTokenDatas: TokenData[]
  refreshTokenAccounts: () => void
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
    refreshTokenAccounts: () => {},
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
  const { stakePoolId } = router.query
  const [stakePool, setStakePool] = useState<AccountData<StakePoolData>>()
  const { connection } = useEnvironmentCtx()
  const [stakedAddress, setStakedAddress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [stakedTokenDatas, setStakedTokenDatas] = useState<TokenData[]>([])
  const [stakedRefreshing, setStakedRefreshing] = useState<boolean>(false)
  const [stakedLoaded, setStakedLoaded] = useState<boolean>(false)
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

  const refreshTokenAccounts = useCallback(() => {
    if (!stakedAddress) {
      setError(`Address not set please connect wallet to continue`)
      return
    }

    if (!stakePool) {
      setError(`Invalid stake pool id`)
      return []
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
  }, [connection, setError, stakedAddress, setStakedRefreshing])

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
    <StakedTokenData.Provider
      value={{
        stakedAddress,
        stakedTokenDatas,
        stakedLoaded,
        refreshTokenAccounts,
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

export function useStakedTokenData(): StakedTokenDataValues {
  return useContext(StakedTokenData)
}
