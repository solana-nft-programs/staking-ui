import type { StakePoolMetadata } from 'api/mapping'
import { queryClient } from 'pages/_app'
import React, { useContext, useState } from 'react'

export interface StakePoolMetadataValues {
  stakePoolMetadata: StakePoolMetadata | null
  setStakePoolMetadata: (stakePoolMetadata: StakePoolMetadata | null) => void
}

const EnvironmentContext: React.Context<null | StakePoolMetadataValues> =
  React.createContext<null | StakePoolMetadataValues>(null)

export function StakePoolMetadataProvider({
  children,
  poolMapping,
}: {
  children: React.ReactChild
  poolMapping: StakePoolMetadata | undefined
}) {
  const [stakePoolMetadata, setStakePoolMetadata] =
    useState<StakePoolMetadata | null>(poolMapping || null)

  return (
    <EnvironmentContext.Provider
      value={{
        stakePoolMetadata,
        setStakePoolMetadata: (x) => {
          queryClient.removeQueries(), setStakePoolMetadata(x)
        },
      }}
    >
      {children}
    </EnvironmentContext.Provider>
  )
}

export function useStakePoolMetadataCtx(): StakePoolMetadataValues {
  const context = useContext(EnvironmentContext)
  if (!context) {
    throw new Error('Missing stakePoolMetadata context')
  }
  return context
}
