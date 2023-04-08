import { tryPublicKey } from '@cardinal/common'
import { GlyphPlus } from 'assets/GlyphPlus'
import { AsyncButton } from 'common/Button'
import { FormFieldTitleInput } from 'common/FormFieldInput'
import { LoadingSpinner } from 'common/LoadingSpinner'
import { ParsedAccount } from 'common/ParsedAccount'
import { useHandleMultiplierBasisPoints } from 'handlers/useHandleMultiplierBasisPoints'
import { useHandleMultiplierStakeSecondsDecrement } from 'handlers/useHandleMultiplierStakeSecondsDecrement'
import { useHandleMultiplierStakeSecondsIncrement } from 'handlers/useHandleMultiplierStakeSecondsIncrement'
import { useHandleMultiplierStakeSecondsSet } from 'handlers/useHandleMultiplierStakeSecondsSet'
import { useStakeEntry } from 'hooks/useStakeEntry'
import { useStakePoolData } from 'hooks/useStakePoolData'
import { useWalletId } from 'hooks/useWalletId'
import { useUTCNow } from 'providers/UTCNowProvider'
import { useState } from 'react'
import { BiMinus } from 'react-icons/bi'

import { NumberInput } from '@/components/UI/inputs/NumberInput'
import { TextInput } from '@/components/UI/inputs/TextInput'

export const AdminPointsLookup = () => {
  const [mintLookupId, setMintLookupId] = useState<string>('')
  const walletId = useWalletId()
  const stakeEntry = useStakeEntry(tryPublicKey(mintLookupId))
  const { UTCNow } = useUTCNow()
  const { data: stakePoolData } = useStakePoolData()
  const [multiplierBasisPoints, setMultiplierBasisPoints] = useState<number>()
  const [incrementPoints, setIncrementPoints] = useState<number>()
  const [decrementPoints, setDecrementPoints] = useState<number>()
  const [totalStakeSeconds, setTotalStakeSeconds] = useState<number>()
  const handleMultiplierBasisPoints = useHandleMultiplierBasisPoints()
  const handleMultiplierStakeSecondsSet = useHandleMultiplierStakeSecondsSet()
  const handleMultiplierStakeSecondsIncrement =
    useHandleMultiplierStakeSecondsIncrement()
  const handleMultiplierStakeSecondsDecrement =
    useHandleMultiplierStakeSecondsDecrement()

  return (
    <div className="mb-5 w-full">
      <FormFieldTitleInput
        title="Lookup mint"
        description={
          'Points is computed based on the following formula: (multiplierStakeSeconds || totalStakeSeconds) + (UTCNow - lastUpdatedAt).'
        }
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
      <div className="mt-4 flex flex-col gap-4">
        <div>
          <FormFieldTitleInput
            title={'Set multiplier basis points'}
            description={
              'Input multiplier to set in basis points (10,000 = 1x, 15,000 = 1.5x)'
            }
          />
          <div className="flex items-center justify-between gap-2">
            <NumberInput
              placeholder="Multiplier basis points"
              value={
                multiplierBasisPoints?.toString() ??
                stakeEntry.data?.parsed.multiplierBasisPoints?.toString() ??
                ''
              }
              onChange={(e) => setMultiplierBasisPoints(Number(e.target.value))}
            />
            <AsyncButton
              inlineLoader
              disabled={
                !stakeEntry.data ||
                stakePoolData?.parsed.authority.toString() !==
                  walletId?.toString()
              }
              loading={handleMultiplierBasisPoints.isLoading}
              onClick={() =>
                !!multiplierBasisPoints &&
                stakeEntry.data?.pubkey &&
                handleMultiplierBasisPoints.mutate(
                  {
                    stakeEntryId: stakeEntry.data.pubkey,
                    multiplierBasisPoints,
                  },
                  {
                    onSuccess: () => stakeEntry.remove(),
                  }
                )
              }
            >
              Update
            </AsyncButton>
          </div>
        </div>
        <div>
          <FormFieldTitleInput
            title={'Increment points'}
            description={
              'Points is computed based on the following formula: (multiplierStakeSeconds || totalStakeSeconds) + (UTCNow - lastUpdatedAt). This will updated lastUpdatedAt and increment points by the specified amount.'
            }
          />
          <div className="flex items-center justify-between gap-2">
            <NumberInput
              placeholder="Value to set"
              value={incrementPoints?.toString() ?? ''}
              onChange={(e) => setIncrementPoints(Number(e.target.value))}
            />
            <AsyncButton
              inlineLoader
              disabled={
                !stakeEntry.data ||
                stakePoolData?.parsed.authority.toString() !==
                  walletId?.toString()
              }
              loading={handleMultiplierStakeSecondsIncrement.isLoading}
              onClick={() =>
                !!incrementPoints &&
                stakeEntry.data?.pubkey &&
                handleMultiplierStakeSecondsIncrement.mutate(
                  {
                    stakeEntryId: stakeEntry.data.pubkey,
                    multiplierStakeSeconds: incrementPoints,
                  },
                  {
                    onSuccess: () => stakeEntry.remove(),
                  }
                )
              }
            >
              {`Add`}
              <GlyphPlus />
            </AsyncButton>
          </div>
        </div>
        <div>
          <FormFieldTitleInput
            title={'Decrement points'}
            description={
              'Points is computed based on the following formula: (multiplierStakeSeconds || totalStakeSeconds) + (UTCNow - lastUpdatedAt). This will updated lastUpdatedAt and decrement points by the specified amount.'
            }
          />
          <div className="flex items-center justify-between gap-2">
            <NumberInput
              placeholder="Value to set"
              value={decrementPoints?.toString() ?? ''}
              onChange={(e) => setDecrementPoints(Number(e.target.value))}
            />
            <AsyncButton
              className="bg-red-500 hover:bg-red-600"
              inlineLoader
              disabled={
                !stakeEntry.data ||
                stakePoolData?.parsed.authority.toString() !==
                  walletId?.toString()
              }
              loading={handleMultiplierStakeSecondsDecrement.isLoading}
              onClick={() =>
                !!decrementPoints &&
                stakeEntry.data?.pubkey &&
                handleMultiplierStakeSecondsDecrement.mutate(
                  {
                    stakeEntryId: stakeEntry.data.pubkey,
                    multiplierStakeSeconds: decrementPoints,
                  },
                  {
                    onSuccess: () => stakeEntry.remove(),
                  }
                )
              }
            >
              Sub <BiMinus className="text-xl" />
            </AsyncButton>
          </div>
        </div>
        <div>
          <FormFieldTitleInput
            title={'Set points'}
            description={
              'This will set multiplierStakeSeconds to a desired value. Points is computed based on the following formula: (multiplierStakeSeconds || totalStakeSeconds) + (UTCNow - lastUpdatedAt)'
            }
          />
          <div className="flex items-center justify-between gap-2">
            <NumberInput
              placeholder="Value to set"
              value={totalStakeSeconds?.toString() ?? ''}
              onChange={(e) => setTotalStakeSeconds(Number(e.target.value))}
            />
            <AsyncButton
              inlineLoader
              disabled={
                !stakeEntry.data ||
                stakePoolData?.parsed.authority.toString() !==
                  walletId?.toString()
              }
              loading={handleMultiplierStakeSecondsSet.isLoading}
              onClick={() =>
                totalStakeSeconds !== undefined &&
                stakeEntry.data?.pubkey &&
                handleMultiplierStakeSecondsSet.mutate(
                  {
                    stakeEntryId: stakeEntry.data.pubkey,
                    multiplierStakeSeconds: totalStakeSeconds,
                  },
                  {
                    onSuccess: () => {
                      stakeEntry.remove()
                      setTotalStakeSeconds(undefined)
                    },
                  }
                )
              }
            >
              Update
            </AsyncButton>
          </div>
        </div>
        <ParsedAccount data={stakeEntry.data} />
      </div>
    </div>
  )
}
