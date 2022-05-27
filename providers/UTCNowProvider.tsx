import { Connection } from '@solana/web3.js'
import { ReactChild, useMemo } from 'react'
import React, { useContext, useEffect, useState } from 'react'
import { useEnvironmentCtx } from './EnvironmentProvider'

const CLOCK_DRIFT_WARNING_THRESHOLD_SECONDS = 60 * 5
export interface UTCNowContextValues {
  UTCNow: number
  clockDrift: number | undefined
}

const UTCNowContext: React.Context<UTCNowContextValues> =
  React.createContext<UTCNowContextValues>({
    UTCNow: Math.floor(Date.now() / 1000),
    clockDrift: 0,
  })

const getSolanaClock = async (
  connection: Connection
): Promise<number | null> => {
  const epochInfo = await connection.getEpochInfo()
  const blockTimeInEpoch = await connection.getBlockTime(epochInfo.absoluteSlot)
  return blockTimeInEpoch
}

export function UTCNowProvider({ children }: { children: ReactChild }) {
  const { connection, environment } = useEnvironmentCtx()
  const [UTCNow, setUTCNow] = useState(Date.now() / 1000)
  const [clockDrift, setClockDrift] = useState<number | undefined>(undefined)

  useMemo(() => {
    const interval = setInterval(
      (function fetchInterval(): () => void {
        setUTCNow(Date.now() / 1000)
        // setUTCNow(UTCNow + 1)
        return fetchInterval
      })(),
      1000
    )
    return () => clearInterval(interval)
  }, [Math.floor(Date.now() / 1000)])

  useMemo(async () => {
    const solanaClock = await getSolanaClock(connection)
    if (
      solanaClock &&
      Math.abs(Date.now() / 1000 - solanaClock) >
        CLOCK_DRIFT_WARNING_THRESHOLD_SECONDS
    ) {
      setClockDrift(Date.now() / 1000 - solanaClock)
      setUTCNow(solanaClock)
    }
  }, [environment])

  return (
    <UTCNowContext.Provider
      value={{
        UTCNow,
        clockDrift,
      }}
    >
      {children}
    </UTCNowContext.Provider>
  )
}

export function useUTCNow(): UTCNowContextValues {
  const context = useContext(UTCNowContext)
  return context
}
