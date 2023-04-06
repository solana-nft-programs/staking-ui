import { tryPublicKey } from '@cardinal/common'
import { FormFieldTitleInput } from 'common/FormFieldInput'
import { LoadingSpinner } from 'common/LoadingSpinner'
import { pubKeyUrl } from 'common/utils'
import { useStakeEntry } from 'hooks/useStakeEntry'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useUTCNow } from 'providers/UTCNowProvider'
import { useState } from 'react'

import { TextInput } from '@/components/UI/inputs/TextInput'

export const AdminPointsLookup = () => {
  const [mintLookupId, setMintLookupId] = useState<string>('')
  const { environment } = useEnvironmentCtx()
  const stakeEntry = useStakeEntry(tryPublicKey(mintLookupId))
  const { UTCNow } = useUTCNow()

  return (
    <div className="mb-5 w-full">
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
          <div className="flex items-center justify-center rounded-md border border-gray-500 py-[11px] px-4">
            {stakeEntry.isFetching ? (
              <LoadingSpinner height="24" />
            ) : stakeEntry.data?.parsed ? (
              (stakeEntry.data?.parsed.multiplierStakeSeconds?.toNumber() ??
                stakeEntry.data?.parsed.totalStakeSeconds.toNumber()) +
              Math.floor(
                UTCNow - stakeEntry.data?.parsed.lastUpdatedAt.toNumber()
              )
            ) : (
              '-'
            )}
          </div>
        </div>
      </div>
      <div className="mt-2 flex underline">
        {stakeEntry.data?.pubkey && (
          <a
            href={pubKeyUrl(
              stakeEntry.data?.pubkey,
              environment.label,
              'anchor-account'
            )}
            target={'_blank'}
            rel="noreferrer"
          >
            View in explorer
          </a>
        )}
      </div>
    </div>
  )
}
