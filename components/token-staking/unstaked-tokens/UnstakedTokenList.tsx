import type { ReceiptType } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { contrastify } from 'common/colors'
import { notify } from 'common/Notification'
import type { AllowedTokenData } from 'hooks/useAllowedTokenDatas'
import { useAllowedTokenDatas } from 'hooks/useAllowedTokenDatas'
import { isStakePoolV2, useStakePoolData } from 'hooks/useStakePoolData'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'
import { useRef, useState } from 'react'
import type { UseMutationResult } from 'react-query'

import { UnstakedToken } from '@/components/token-staking/unstaked-tokens/UnstakedToken'
import { DEFAULT_PAGE, PAGE_SIZE } from '@/components/token-staking/constants'

export type UnstakedTokensProps = {
  showFungibleTokens: boolean
  receiptType: ReceiptType
  unstakedSelected: AllowedTokenData[]
  setUnstakedSelected: (unstakedSelected: AllowedTokenData[]) => void
  handleStake: UseMutationResult<
    string[],
    unknown,
    {
      tokenDatas: AllowedTokenData[]
      receiptType?: ReceiptType | undefined
    },
    unknown
  >
}

export const UnstakedTokenList = ({
  showFungibleTokens,
  receiptType,
  unstakedSelected,
  handleStake,
  setUnstakedSelected,
}: UnstakedTokensProps) => {
  const { data: stakePoolMetadata } = useStakePoolMetadata()
  const { data: stakePoolData } = useStakePoolData()
  const ref = useRef<HTMLDivElement | null>(null)
  const [pageNum, setPageNum] = useState<[number, number]>(DEFAULT_PAGE)
  const allowedTokenDatas = useAllowedTokenDatas(showFungibleTokens)

  const isUnstakedTokenSelected = (tk: AllowedTokenData) =>
    unstakedSelected.some(
      (utk) =>
        utk.tokenAccount?.parsed.mint.toString() ===
        tk.tokenAccount?.parsed.mint.toString()
    )

  const selectUnstakedToken = (tk: AllowedTokenData, targetValue?: string) => {
    if (handleStake.isLoading) return
    const amount = Number(targetValue)
    if ((tk.tokenAccount?.parsed.tokenAmount.amount ?? 0) > 1) {
      let newUnstakedSelected = unstakedSelected.filter(
        (data) =>
          data.tokenAccount?.parsed.mint.toString() !==
          tk.tokenAccount?.parsed.mint.toString()
      )
      if (targetValue && targetValue?.length > 0 && !amount) {
        notify({
          message: 'Please enter a valid amount',
          type: 'error',
        })
      } else if (targetValue) {
        tk.amountToStake = targetValue.toString()
        newUnstakedSelected = [...newUnstakedSelected, tk]
        setUnstakedSelected(newUnstakedSelected)
        return
      }
      setUnstakedSelected(
        unstakedSelected.filter(
          (data) =>
            data.tokenAccount?.parsed.mint.toString() !==
            tk.tokenAccount?.parsed.mint.toString()
        )
      )
    } else {
      if (isUnstakedTokenSelected(tk)) {
        setUnstakedSelected(
          unstakedSelected.filter(
            (data) =>
              data.tokenAccount?.parsed.mint.toString() !==
              tk.tokenAccount?.parsed.mint.toString()
          )
        )
      } else {
        setUnstakedSelected([...unstakedSelected, tk])
      }
    }
  }

  return (
    <div
      className="relative my-auto mb-4 h-[60vh] overflow-y-auto overflow-x-hidden rounded-md bg-white bg-opacity-5 p-5"
      style={{
        background:
          stakePoolMetadata?.colors?.backgroundSecondary &&
          contrastify(0.05, stakePoolMetadata?.colors?.backgroundSecondary),
      }}
      ref={ref}
      onScroll={() => {
        if (ref.current) {
          const { scrollTop, scrollHeight, clientHeight } = ref.current
          if (scrollHeight - scrollTop <= clientHeight * 1.1) {
            setPageNum(([n, prevScrollHeight]) => {
              return prevScrollHeight !== scrollHeight
                ? [n + 1, scrollHeight]
                : [n, prevScrollHeight]
            })
          }
        }
      }}
    >
      {!allowedTokenDatas.isFetched ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="aspect-square animate-pulse rounded-lg bg-white bg-opacity-5 p-10"></div>
          <div className="aspect-square animate-pulse rounded-lg bg-white bg-opacity-5 p-10"></div>
          <div className="aspect-square animate-pulse rounded-lg bg-white bg-opacity-5 p-10"></div>
        </div>
      ) : (allowedTokenDatas.data || []).length === 0 ? (
        <p
          className={`font-normal ${
            stakePoolMetadata?.colors?.fontColor
              ? `text-[${stakePoolMetadata?.colors?.fontColor}]`
              : 'text-gray-400'
          }`}
        >
          No allowed tokens found in wallet.
        </p>
      ) : (
        <div className={'grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3'}>
          {(stakePoolMetadata?.notFound
            ? []
            : allowedTokenDatas.data?.slice(0, PAGE_SIZE * pageNum[0]) ?? []
          )
            .filter((tk) => {
              if (
                stakePoolData?.parsed &&
                isStakePoolV2(stakePoolData?.parsed)
              ) {
                if ((tk.tokenAccount?.parsed.tokenAmount.amount ?? 0) > 1) {
                  return false
                }
              }
              return true
            })
            .map((tk) => (
              <UnstakedToken
                key={tk?.tokenAccount?.pubkey.toBase58()}
                tk={tk}
                receiptType={receiptType}
                select={(tk, amount) => selectUnstakedToken(tk, amount)}
                selected={isUnstakedTokenSelected(tk)}
                loading={handleStake.isLoading && isUnstakedTokenSelected(tk)}
              />
            ))}
        </div>
      )}
    </div>
  )
}
