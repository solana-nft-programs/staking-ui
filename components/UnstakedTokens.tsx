import { ReceiptType } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { Tooltip } from '@mui/material'
import { defaultSecondaryColor, TokenStandard } from 'api/mapping'
import { contrastify } from 'common/colors'
import { LoadingSpinner } from 'common/LoadingSpinner'
import { notify } from 'common/Notification'
import { RefreshButton } from 'common/RefreshButton'
import { Toggle } from 'common/Toggle'
import { useHandleStake } from 'handlers/useHandleStake'
import type { AllowedTokenData } from 'hooks/useAllowedTokenDatas'
import { useAllowedTokenDatas } from 'hooks/useAllowedTokenDatas'
import { isStakePoolV2, useStakePoolData } from 'hooks/useStakePoolData'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'
import { useEffect, useRef, useState } from 'react'
import { FaInfoCircle } from 'react-icons/fa'

import { UnstakedToken } from './UnstakedToken'

export const PAGE_SIZE = 3
export const DEFAULT_PAGE: [number, number] = [3, 0]

export const UnstakedTokens = () => {
  const { data: stakePoolData } = useStakePoolData()
  const { data: stakePoolMetadata } = useStakePoolMetadata()
  const [pageNum, setPageNum] = useState<[number, number]>(DEFAULT_PAGE)
  const ref = useRef<HTMLDivElement | null>(null)

  const [unstakedSelected, setUnstakedSelected] = useState<AllowedTokenData[]>(
    []
  )
  const [receiptType, setReceiptType] = useState<ReceiptType>(
    ReceiptType.Original
  )
  const [showFungibleTokens, setShowFungibleTokens] = useState(false)
  const allowedTokenDatas = useAllowedTokenDatas(showFungibleTokens)
  const handleStake = useHandleStake(() => setUnstakedSelected([]))

  useEffect(() => {
    stakePoolMetadata?.tokenStandard &&
      setShowFungibleTokens(
        stakePoolMetadata?.tokenStandard === TokenStandard.Fungible
      )
    stakePoolMetadata?.receiptType &&
      setReceiptType(stakePoolMetadata?.receiptType)
  }, [stakePoolMetadata?.name])

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

  const isUnstakedTokenSelected = (tk: AllowedTokenData) =>
    unstakedSelected.some(
      (utk) =>
        utk.tokenAccount?.parsed.mint.toString() ===
        tk.tokenAccount?.parsed.mint.toString()
    )

  return (
    <div
      className={`flex-col rounded-xl p-10 ${
        stakePoolMetadata?.colors?.fontColor ? '' : 'text-gray-200'
      } bg-white bg-opacity-5`}
      style={{
        background: stakePoolMetadata?.colors?.backgroundSecondary,
        border: stakePoolMetadata?.colors?.accent
          ? `2px solid ${stakePoolMetadata?.colors?.accent}`
          : '',
      }}
    >
      <div className="mt-2 flex w-full flex-row items-center justify-between">
        <div className="flex flex-row">
          <div className="mb-3 mr-3 inline-block text-lg">
            Select Your Tokens
          </div>
        </div>
        <div className="flex flex-row items-center justify-center">
          <RefreshButton
            colorized
            isFetching={allowedTokenDatas.isFetching}
            dataUpdatdAtMs={allowedTokenDatas.dataUpdatedAt}
            handleClick={() => allowedTokenDatas.refetch()}
          />
          {stakePoolData?.parsed &&
            !stakePoolMetadata?.tokenStandard &&
            !isStakePoolV2(stakePoolData?.parsed) && (
              <button
                onClick={() => {
                  setShowFungibleTokens(!showFungibleTokens)
                }}
                className="text-md inline-block rounded-md bg-white bg-opacity-5 px-4 py-1 hover:bg-opacity-10"
              >
                {showFungibleTokens ? 'Show NFTs' : 'Show FTs'}
              </button>
            )}
        </div>
      </div>
      <div className="my-3 flex-auto overflow-auto">
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
            <div
              className={'grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3'}
            >
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
                    loading={
                      handleStake.isLoading && isUnstakedTokenSelected(tk)
                    }
                  />
                ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-2 flex flex-col items-center justify-between gap-5 md:flex-row">
        {!stakePoolMetadata?.receiptType &&
        stakePoolData?.parsed &&
        !isStakePoolV2(stakePoolData?.parsed) ? (
          <Tooltip
            title={
              receiptType === ReceiptType.Original
                ? 'Lock the original token(s) in your wallet when you stake'
                : 'Receive a dynamically generated NFT receipt representing your stake'
            }
          >
            <div className="flex cursor-pointer flex-row gap-2">
              <Toggle
                defaultValue={receiptType === ReceiptType.Original}
                onChange={() =>
                  setReceiptType(
                    receiptType === ReceiptType.Original
                      ? ReceiptType.Receipt
                      : ReceiptType.Original
                  )
                }
                style={{
                  background:
                    stakePoolMetadata?.colors?.secondary ||
                    defaultSecondaryColor,
                  color: stakePoolMetadata?.colors?.fontColor,
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full`}
              />
              <div className="flex items-center gap-1">
                <span
                  style={{
                    color: stakePoolMetadata?.colors?.fontColor,
                  }}
                >
                  {receiptType === ReceiptType.Original
                    ? 'Original'
                    : 'Receipt'}
                </span>
                <FaInfoCircle />
              </div>
            </div>
          </Tooltip>
        ) : (
          <div></div>
        )}
        <div className="flex gap-5">
          <Tooltip title="Click on tokens to select them">
            <button
              onClick={() => {
                if (unstakedSelected.length === 0) {
                  notify({
                    message: `No tokens selected`,
                    type: 'error',
                  })
                } else {
                  handleStake.mutate({
                    tokenDatas: unstakedSelected,
                    receiptType,
                  })
                }
              }}
              style={{
                background:
                  stakePoolMetadata?.colors?.secondary || defaultSecondaryColor,
                color:
                  stakePoolMetadata?.colors?.fontColorSecondary ||
                  stakePoolMetadata?.colors?.fontColor,
              }}
              className="my-auto flex rounded-md px-4 py-2 hover:scale-[1.03]"
            >
              <span className="mr-1 inline-block">
                {handleStake.isLoading && (
                  <LoadingSpinner
                    fill={
                      stakePoolMetadata?.colors?.fontColor
                        ? stakePoolMetadata?.colors?.fontColor
                        : '#FFF'
                    }
                    height="20px"
                  />
                )}
              </span>
              <span className="my-auto">Stake ({unstakedSelected.length})</span>
            </button>
          </Tooltip>
          <Tooltip title="Attempt to stake all tokens at once">
            <button
              onClick={() => {
                setUnstakedSelected(allowedTokenDatas.data || [])
              }}
              style={{
                background:
                  stakePoolMetadata?.colors?.secondary || defaultSecondaryColor,
                color:
                  stakePoolMetadata?.colors?.fontColorSecondary ||
                  stakePoolMetadata?.colors?.fontColor,
              }}
              className="my-auto flex cursor-pointer rounded-md px-4 py-2 hover:scale-[1.03]"
            >
              <span className="my-auto">Select All</span>
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}
