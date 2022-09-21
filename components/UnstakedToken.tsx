import type { ReceiptType } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { LoadingSpinner } from 'common/LoadingSpinner'
import { QuickActions } from 'common/QuickActions'
import { formatAmountAsDecimal } from 'common/units'
import type { AllowedTokenData } from 'hooks/useAllowedTokenDatas'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'

export const UnstakedToken = ({
  tk,
  selected,
  receiptType,
  loadingUnstake,
  loadingClaim,
  select,
}: {
  tk: AllowedTokenData
  receiptType: ReceiptType
  selected: boolean
  loadingUnstake: boolean
  loadingClaim: boolean
  select: (tokenData: AllowedTokenData, amount?: string) => void
}) => {
  const { data: stakePoolMetadata } = useStakePoolMetadata()
  return (
    <div key={tk.tokenAccount?.pubkey.toString()} className="mx-auto">
      <div className="relative w-44 md:w-auto 2xl:w-48">
        <label
          htmlFor={tk?.tokenAccount?.pubkey.toBase58()}
          className="relative"
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
            {(loadingClaim || loadingUnstake) && (
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
            <img
              className="mx-auto mt-4 rounded-t-xl bg-white bg-opacity-5 object-contain md:h-40 md:w-40 2xl:h-48 2xl:w-48"
              src={tk.metadata?.data.image || tk.tokenListData?.logoURI}
              alt={tk.metadata?.data.name || tk.tokenListData?.name}
            />
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
              <div className="truncate font-semibold">
                {tk.metadata?.data.name || tk.tokenListData?.symbol}
              </div>
              {tk.tokenAccount &&
                tk.tokenAccount?.account.data.parsed.info.tokenAmount.amount >
                  1 && (
                  <div className="mt-2">
                    <div className="truncate font-semibold">
                      <div className="flex w-full flex-row justify-between text-xs font-semibold">
                        <span>Available:</span>
                        <span className="px-1">
                          {formatAmountAsDecimal(
                            tk.tokenAccount.account.data.parsed.info.tokenAmount
                              .decimals,
                            tk.tokenAccount?.account.data.parsed.info
                              .tokenAmount.amount,
                            tk.tokenAccount.account.data.parsed.info.tokenAmount
                              .decimals
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
                          console.log(e.target.value)
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
                backgroundColor:
                  stakePoolMetadata?.colors?.primary || '#FFFFFF',
                borderRadius: '50%',
                display: 'inline-block',
              }}
            />
          )}
        </label>
      </div>
    </div>
  )
}
