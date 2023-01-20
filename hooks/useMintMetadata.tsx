import type { AccountData } from '@cardinal/common'
import { tryPublicKey } from '@cardinal/common'
import { useQueries, useQuery } from 'react-query'

import type { AllowedTokenData } from './useAllowedTokenDatas'
import type { StakeEntryTokenData } from './useStakedTokenDatas'

export type MintMetadata = AccountData<{
  image?: string
  name?: string
  attributes?: { trait_type: string; value: string }[]
}>

export const mintMetadataQueryKey = (
  tokenData: AllowedTokenData | StakeEntryTokenData
) => {
  return ['useMintMetadata', getMintfromTokenData(tokenData)?.toString()]
}

export const getMintfromTokenData = (
  tokenData: AllowedTokenData | StakeEntryTokenData
) => {
  return (
    ('stakeEntry' in tokenData && tokenData.stakeEntry?.parsed?.stakeMint) ||
    tryPublicKey(tokenData.metaplexData?.data.mint) ||
    tryPublicKey(tokenData.tokenListData?.address)
  )
}

export const mintMetadataQuery = async (
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
}

export const useMintMetadata = (
  tokenData: AllowedTokenData | StakeEntryTokenData
) => {
  return useQuery<MintMetadata | undefined>(
    mintMetadataQueryKey(tokenData),
    () => mintMetadataQuery(tokenData),
    {
      refetchOnMount: false,
    }
  )
}

export const useMintMetadatas = (
  tokenDatas: (AllowedTokenData | StakeEntryTokenData)[]
) => {
  return useQueries(
    tokenDatas.map((tokenData) => {
      return {
        queryKey: mintMetadataQueryKey(tokenData),
        queryFn: () => mintMetadataQuery(tokenData),
      }
    })
  )
}
