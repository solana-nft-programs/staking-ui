import { FormFieldTitleInput } from 'common/FormFieldInput'
import { LoadingSpinner } from 'common/LoadingSpinner'
import { TextInput } from 'components/UI/inputs/TextInput'
import { useMintMultiplier } from 'hooks/useMintMultiplier'
import { useState } from 'react'

export const MintMultiplierLookup = () => {
  const [mintLookupId, setMintLookupId] = useState<string>('')
  const mintMultiplier = useMintMultiplier(mintLookupId)

  return (
    <div className="mb-5">
      <FormFieldTitleInput
        title="Lookup mint multiplier"
        description="Remember to account for multiplier decimals"
      />
      <div className="flex items-center gap-2">
        <TextInput
          placeholder="Enter Mint ID"
          onChange={(e) => {
            setMintLookupId(e.target.value)
          }}
        />
        <div className="w-1/6">
          <div className="flex items-center justify-center rounded-md border border-gray-500 py-3 px-4">
            {mintMultiplier.isLoading ? (
              <LoadingSpinner height="30" />
            ) : (
              mintMultiplier.data ?? '-'
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
