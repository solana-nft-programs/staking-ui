import type { AllowedTokenData } from 'hooks/useAllowedTokenDatas'
import type { MintMetadata } from 'hooks/useMintMetadata'
import type { StakeEntryTokenData } from 'hooks/useStakedTokenDatas'

export const getNameFromTokenData = (
  tokenData: AllowedTokenData | StakeEntryTokenData,
  mintMetadata?: MintMetadata | null,
  defaultName?: string
) => {
  return (
    mintMetadata?.parsed?.name ||
    tokenData.metaplexData?.data.data.name ||
    tokenData.tokenListData?.name ||
    defaultName
  )
}

export const getImageFromTokenData = (
  tokenData: AllowedTokenData | StakeEntryTokenData,
  mintMetadata?: MintMetadata | null
) => {
  return mintMetadata?.parsed?.image || tokenData.tokenListData?.logoURI
}
