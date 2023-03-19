import type { AllowedTokenData } from 'hooks/useAllowedTokenDatas'
import type { MintJson } from 'hooks/useMintJson'
import type { StakeEntryTokenData } from 'hooks/useStakedTokenDatas'

export const getNameFromTokenData = (
  tokenData: AllowedTokenData | StakeEntryTokenData,
  mintMetadata?: MintJson | null,
  defaultName?: string
) => {
  return (
    mintMetadata?.parsed?.name ||
    tokenData.metaplexData?.data.data.name ||
    tokenData.tokenListData?.name ||
    defaultName ||
    ''
  ).replace(/\0/g, '')
}

export const getImageFromTokenData = (
  tokenData: AllowedTokenData | StakeEntryTokenData,
  mintMetadata?: MintJson | null
) => {
  return mintMetadata?.parsed?.image || tokenData.tokenListData?.logoURI
}
