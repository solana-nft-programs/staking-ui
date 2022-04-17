import type { ReactChild } from 'react'
import React, { useContext, useEffect, useState } from 'react'

export interface UTCNowContextValues {
  UTCNow: number
}

const UTCNowContext: React.Context<UTCNowContextValues> =
  React.createContext<UTCNowContextValues>({
    UTCNow: Math.floor(Date.now() / 1000),
  })

export function UTCNowProvider({ children }: { children: ReactChild }) {
  const [UTCNow, setUTCNow] = useState(Date.now() / 1000)
  useEffect(() => {
    const interval = setInterval(
      (function expirationStringUpdate() {
        setUTCNow(Math.floor(Date.now() / 1000))
        return expirationStringUpdate
      })(),
      1000
    )
    return () => clearInterval(interval)
  })
  return (
    <UTCNowContext.Provider
      value={{
        UTCNow,
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
