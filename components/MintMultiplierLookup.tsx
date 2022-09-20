import { LoadingSpinner } from 'common/LoadingSpinner'
import { useMintMultiplier } from 'hooks/useMintMultiplier'
import { useState } from 'react'

export const MintMultiplierLookup = () => {
  const [mintLookupId, setMintLookupId] = useState<string>('')
  const mintMultiplier = useMintMultiplier(mintLookupId)

  return (
    <div className="mb-5">
      <label
        className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-200"
        htmlFor="require-authorization"
      >
        Look up reward multiplier for mint
      </label>
      <div className="flex items-center gap-4">
        <input
          className="w-3/5 appearance-none flex-col rounded border border-gray-500 bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800 focus:outline-none"
          type="text"
          placeholder={'Enter Mint ID'}
          onChange={(e) => {
            setMintLookupId(e.target.value)
          }}
        />
        <div>
          {mintMultiplier.isLoading ? (
            <LoadingSpinner height="30" />
          ) : (
            !!mintMultiplier.data && (
              <span className="text-md border px-4 py-2 font-semibold">
                {mintMultiplier.data}x
              </span>
            )
          )}
        </div>
      </div>
    </div>
  )
}
