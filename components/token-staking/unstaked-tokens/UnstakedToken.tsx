import type { ReceiptType } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { BN } from '@project-serum/anchor'
import { defaultSecondaryColor } from 'api/mapping'
import { LoadingSpinner } from 'common/LoadingSpinner'
import { QuickActions } from 'common/QuickActions'
import { getNameFromTokenData } from 'common/tokenDataUtils'
import { formatAmountAsDecimal } from 'common/units'
import type { AllowedTokenData } from 'hooks/useAllowedTokenDatas'
import { useMintMetadata } from 'hooks/useMintMetadata'
import { useStakePoolMetadataCtx } from 'providers/StakePoolMetadataProvider'
import type { UseMutationResult } from '@tanstack/react-query'

import { TokenImage } from '@/components/token-staking/token/TokenImage'
import { TokenImageWrapper } from '@/components/token-staking/token/TokenImageWrapper'
import { TokenWrapper } from '@/components/token-staking/token/TokenWrapper'

export const UnstakedToken = ({
  tk,
  selected,
  receiptType,
  loading,
  select,
  handleStake,
}: {
  tk: AllowedTokenData
  receiptType: ReceiptType
  selected: boolean
  loading: boolean
  select: (tokenData: AllowedTokenData, amount?: string) => void
  handleStake: UseMutationResult<
    (string | null)[][],
    unknown,
    {
      tokenDatas: AllowedTokenData[]
      receiptType?: ReceiptType | undefined
    },
    unknown
  >
}) => {
  const { data: stakePoolMetadata } = useStakePoolMetadataCtx()
  const mintMetadata = useMintMetadata(tk)
  return (
    <div
      key={tk.tokenAccount?.pubkey.toString()}
      className="relative mx-auto min-w-full"
    >
      <TokenWrapper token={tk} selected={selected} select={select}>
        {loading && (
          <div className="absolute top-0 left-0 z-10 flex h-full w-full justify-center rounded-xl bg-black bg-opacity-80 align-middle text-white">
            <div className="my-auto flex">
              <span className="mr-2">
                <LoadingSpinner height="20px" />
              </span>
              Staking token...
            </div>
          </div>
        )}
        <QuickActions
          receiptType={receiptType}
          unstakedTokenData={tk}
          selectUnstakedToken={select}
          selectStakedToken={() => {}}
        />
        <TokenImageWrapper>
          <TokenImage token={tk} />
        </TokenImageWrapper>

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
          <div className="mb-2 truncate px-2 text-xl font-bold">
            {getNameFromTokenData(tk, mintMetadata?.data)}
          </div>
          {!!tk.tokenListData?.symbol && (
            <div className="mb-2 truncate font-semibold">
              {tk.tokenListData?.symbol}
            </div>
          )}
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
          <div className="flex p-2">
            <button
              style={{
                background:
                  stakePoolMetadata?.colors?.secondary || defaultSecondaryColor,
                color:
                  stakePoolMetadata?.colors?.fontColorSecondary ||
                  stakePoolMetadata?.colors?.fontColor,
              }}
              className="flex-grow rounded-lg p-2 transition-all hover:scale-[1.03]"
              onClick={(e) => {
                e.stopPropagation()
                !selected && select(tk)
                handleStake.mutate({
                  tokenDatas: [tk],
                  receiptType,
                })
              }}
            >
              Stake
            </button>
          </div>
        </div>
      </TokenWrapper>
    </div>
  )
}
