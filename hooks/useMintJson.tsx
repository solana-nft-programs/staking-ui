import type { AccountData } from '@cardinal/common'
import { tryPublicKey } from '@cardinal/common'
import { useQueries, useQuery } from '@tanstack/react-query'

import type { AllowedTokenData } from './useAllowedTokenDatas'
import type { StakeEntryTokenData } from './useStakedTokenDatas'

export type MintJson = AccountData<{
  image?: string
  name?: string
  attributes?: { trait_type: string; value: string }[]
}>

export const mintJsonQueryKey = (
  tokenData: AllowedTokenData | StakeEntryTokenData
) => {
  return ['useMintJson', getMintfromTokenData(tokenData)?.toString()]
}

export const getMintfromTokenData = (
  tokenData: AllowedTokenData | StakeEntryTokenData
) => {
  return (
    ('stakeEntry' in tokenData && tokenData.stakeEntry?.parsed?.stakeMint) ||
    tokenData.metaplexData?.data.mint ||
    tryPublicKey(tokenData.tokenListData?.address)
  )
}

export const mintJsonQuery = async (
  tokenData: AllowedTokenData | StakeEntryTokenData
) => {
  if ('metaplexData' in tokenData && tokenData?.metaplexData?.data.data.uri) {
    const uri = tokenData?.metaplexData?.data.data.uri
    const json = await fetch(uri).then((r) => r.json())
    return {
      pubkey: tokenData.metaplexData.pubkey,
      parsed: json,
    }
  }
  return null
}

export const useMintJson = (
  tokenData: AllowedTokenData | StakeEntryTokenData
) => {
  return useQuery<MintJson | null>(
    mintJsonQueryKey(tokenData),
    () => mintJsonQuery(tokenData),
    {
      refetchOnMount: false,
    }
  )
}

export const useMintJsons = (
  tokenDatas: (AllowedTokenData | StakeEntryTokenData)[]
) => {
  return useQueries({
    queries: tokenDatas.map((tokenData) => {
      return {
        queryKey: mintJsonQueryKey(tokenData),
        queryFn: () => mintJsonQuery(tokenData),
      }
    }),
  })
}
