import type { Connection } from '@solana/web3.js'
import type { ReactChild} from 'react';
import React, { useContext, useEffect, useMemo , useState } from 'react'

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
  const { secondaryConnection, environment } = useEnvironmentCtx()
  const [UTCNow, setUTCNow] = useState(Date.now() / 1000)
  const [clockDrift, setClockDrift] = useState<number | undefined>(undefined)

  useEffect(() => {
    const interval = setInterval(
      (function fetchInterval(): () => void {
        setUTCNow((oldUTCNow) => oldUTCNow + 1)
        return fetchInterval
      })(),
      1000
    )
    return () => clearInterval(interval)
  }, [])

  useMemo(async () => {
    try {
      const solanaClock = await getSolanaClock(secondaryConnection)
      if (
        solanaClock &&
        Math.abs(Date.now() / 1000 - solanaClock) >
          CLOCK_DRIFT_WARNING_THRESHOLD_SECONDS
      ) {
        setClockDrift(Date.now() / 1000 - solanaClock)
        setUTCNow(solanaClock)
      }
    } catch (e) {}
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
