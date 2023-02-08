import type { UseQueryResult } from '@tanstack/react-query'
import type { StakePoolMetadata } from 'api/mapping'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'
import React, { useContext } from 'react'

export interface StakePoolMetadataValues {
  stakePoolMetadata: UseQueryResult<StakePoolMetadata | undefined>
}

const StakePoolMetadataContext: React.Context<null | StakePoolMetadataValues> =
  React.createContext<null | StakePoolMetadataValues>(null)

export function StakePoolMetadataProvider({
  children,
  hostname,
}: {
  children: React.ReactChild
  hostname: string
}) {
  const stakePoolMetadata = useStakePoolMetadata(hostname)

  return (
    <StakePoolMetadataContext.Provider value={{ stakePoolMetadata }}>
      {children}
    </StakePoolMetadataContext.Provider>
  )
}

export function useStakePoolMetadataCtx(): UseQueryResult<
  StakePoolMetadata | undefined
> {
  const context = useContext(StakePoolMetadataContext)
  if (!context) {
    throw new Error('Missing stakePoolMetadata context')
  }
  return context.stakePoolMetadata
}
