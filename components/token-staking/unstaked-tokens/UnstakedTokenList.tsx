import type { ReceiptType } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { notify } from 'common/Notification'
import type { AllowedTokenData } from 'hooks/useAllowedTokenDatas'
import { useAllowedTokenDatas } from 'hooks/useAllowedTokenDatas'
import { isStakePoolV2, useStakePoolData } from 'hooks/useStakePoolData'
import { useStakePoolMetadataCtx } from 'providers/StakePoolMetadataProvider'
import { useState } from 'react'
import type { UseMutationResult } from '@tanstack/react-query'

import { DEFAULT_PAGE, PAGE_SIZE } from '@/components/token-staking/constants'
import { TokenListEmptyState } from '@/components/token-staking/token-list/TokenListEmptyState'
import { TokenListLoader } from '@/components/token-staking/token-list/TokenListLoader'
import { TokenListWrapper } from '@/components/token-staking/token-list/TokenListWrapper'
import { UnstakedToken } from '@/components/token-staking/unstaked-tokens/UnstakedToken'

export type UnstakedTokensProps = {
  showFungibleTokens: boolean
  receiptType: ReceiptType
  unstakedSelected: AllowedTokenData[]
  setUnstakedSelected: (unstakedSelected: AllowedTokenData[]) => void
  handleStake: UseMutationResult<
    (string | null)[][],
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
  const { data: stakePoolMetadata } = useStakePoolMetadataCtx()
  const { data: stakePoolData } = useStakePoolData()
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
    <TokenListWrapper setPageNum={setPageNum}>
      {!allowedTokenDatas.isFetched ? (
        <TokenListLoader />
      ) : (allowedTokenDatas.data || []).length === 0 ? (
        <TokenListEmptyState
          fontColor={stakePoolMetadata?.colors?.fontColor}
          message="No allowed tokens found in wallet."
        />
      ) : (
        <div className={'grid grid-cols-1 gap-4 xl:grid-cols-2'}>
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
                handleStake={handleStake}
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
    </TokenListWrapper>
  )
}
