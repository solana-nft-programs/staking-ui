import {
  getImageFromTokenData,
  getNameFromTokenData,
} from 'common/tokenDataUtils'
import type { AllowedTokenData } from 'hooks/useAllowedTokenDatas'
import { useMintMetadata } from 'hooks/useMintMetadata'

export interface TokenImageProps {
  token: AllowedTokenData
}

export const TokenImage = ({ token }: TokenImageProps) => {
  const mintMetadata = useMintMetadata(token)

  return (
    <>
      {mintMetadata.isFetched &&
      getImageFromTokenData(token, mintMetadata.data) ? (
        <>
          <img
            loading="lazy"
            className={`absolute w-full rounded-t-xl object-contain`}
            src={getImageFromTokenData(token, mintMetadata?.data)}
            alt={getNameFromTokenData(token, mintMetadata?.data)}
          />
          <div className="absolute top-[90%] left-0 right-0 -bottom-2 bg-gradient-to-b from-transparent via-gray-700 to-gray-700" />
        </>
      ) : (
        <div
          className={`w-full grow animate-pulse rounded-t-xl bg-white bg-opacity-5 `}
        />
      )}
    </>
  )
}
