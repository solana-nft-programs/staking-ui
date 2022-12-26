import type { ReceiptType } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { BN } from '@project-serum/anchor'
import { LoadingSpinner } from 'common/LoadingSpinner'
import { QuickActions } from 'common/QuickActions'
import {
  getImageFromTokenData,
  getNameFromTokenData,
} from 'common/tokenDataUtils'
import { formatAmountAsDecimal } from 'common/units'
import type { AllowedTokenData } from 'hooks/useAllowedTokenDatas'
import { useMintMetadata } from 'hooks/useMintMetadata'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'

export const UnstakedToken = ({
  tk,
  selected,
  receiptType,
  loading,
  select,
}: {
  tk: AllowedTokenData
  receiptType: ReceiptType
  selected: boolean
  loading: boolean
  select: (tokenData: AllowedTokenData, amount?: string) => void
}) => {
  const { data: stakePoolMetadata } = useStakePoolMetadata()
  const mintMetadata = useMintMetadata(tk)
  return (
    <div
      key={tk.tokenAccount?.pubkey.toString()}
      className="relative mx-auto min-w-full"
    >
      <div
        className="relative cursor-pointer rounded-xl"
        onClick={() => select(tk)}
        style={{
          boxShadow: selected
            ? `0px 0px 20px ${
                stakePoolMetadata?.colors?.secondary || '#FFFFFF'
              }`
            : '',
        }}
      >
        {loading && (
          <div>
            <div className="absolute top-0 left-0 z-10 flex h-full w-full justify-center rounded-xl bg-black bg-opacity-80 align-middle text-white">
              <div className="my-auto flex">
                <span className="mr-2">
                  <LoadingSpinner height="20px" />
                </span>
                Staking token...
              </div>
            </div>
          </div>
        )}
        <QuickActions
          receiptType={receiptType}
          unstakedTokenData={tk}
          selectUnstakedToken={select}
          selectStakedToken={() => {}}
        />
        <div className="aspect-square w-full grow overflow-hidden rounded-t-xl">
          {mintMetadata.isFetched &&
          getImageFromTokenData(tk, mintMetadata.data) ? (
            <img
              loading="lazy"
              className={`w-full rounded-t-xl object-contain`}
              src={getImageFromTokenData(tk, mintMetadata.data)}
              alt={getNameFromTokenData(tk, mintMetadata?.data)}
            />
          ) : (
            <div
              className={`w-full grow animate-pulse rounded-t-xl bg-white bg-opacity-5 `}
            />
          )}
        </div>

        <div
          className={`flex-col rounded-b-xl p-2 ${
            stakePoolMetadata?.colors?.fontColor
              ? `text-[${stakePoolMetadata?.colors?.fontColor}]`
              : 'text-gray-200'
          } ${
            stakePoolMetadata?.colors?.backgroundSecondary
              ? `bg-[${stakePoolMetadata?.colors?.backgroundSecondary}]`
              : 'bg-white bg-opacity-10'
          }`}
          style={{
            background: stakePoolMetadata?.colors?.backgroundSecondary,
          }}
        >
          <div className="max-w-[120px] truncate font-semibold">
            {getNameFromTokenData(tk, mintMetadata?.data)}
          </div>
          {tk.tokenAccount &&
            tk.tokenAccount?.parsed.tokenAmount.amount > 1 && (
              <div className="mt-2">
                <div className="truncate font-semibold">
                  <div className="flex w-full flex-row justify-between text-xs font-semibold">
                    <span>Available:</span>
                    <span className="px-1">
                      {formatAmountAsDecimal(
                        tk.tokenAccount.parsed.tokenAmount.decimals,
                        new BN(tk.tokenAccount?.parsed.tokenAmount.amount),
                        tk.tokenAccount.parsed.tokenAmount.decimals
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex w-full flex-row justify-between text-xs font-semibold">
                  <span>Amount:</span>
                  <input
                    className="flex w-3/4 rounded-md bg-transparent px-1 text-right text-xs font-medium focus:outline-none"
                    type="text"
                    placeholder={'Enter Amount'}
                    onChange={(e) => {
                      select(tk, e.target.value)
                    }}
                  />
                </div>
              </div>
            )}
        </div>
      </div>
      {selected && (
        <div
          className={`absolute top-2 left-2`}
          style={{
            height: '10px',
            width: '10px',
            backgroundColor: stakePoolMetadata?.colors?.primary || '#FFFFFF',
            borderRadius: '50%',
            display: 'inline-block',
          }}
        />
      )}
    </div>
  )
}
