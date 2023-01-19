import { ReceiptType } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { Tooltip } from '@mui/material'
import { defaultSecondaryColor, TokenStandard } from 'api/mapping'
import { LoadingSpinner } from 'common/LoadingSpinner'
import { notify } from 'common/Notification'
import { RefreshButton } from 'common/RefreshButton'
import { Toggle } from 'common/Toggle'
import { useHandleStake } from 'handlers/useHandleStake'
import type { AllowedTokenData } from 'hooks/useAllowedTokenDatas'
import { useAllowedTokenDatas } from 'hooks/useAllowedTokenDatas'
import { isStakePoolV2, useStakePoolData } from 'hooks/useStakePoolData'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'
import { useTokenAccounts } from 'hooks/useTokenAccounts'
import { useEffect, useState } from 'react'
import { FaInfoCircle } from 'react-icons/fa'

import { UnstakedTokenList } from '@/components/token-staking/unstaked-tokens/UnstakedTokenList'

export const UnstakedTokens = () => {
  const { data: stakePoolData } = useStakePoolData()
  const { data: stakePoolMetadata } = useStakePoolMetadata()

  const [unstakedSelected, setUnstakedSelected] = useState<AllowedTokenData[]>(
    []
  )
  const [receiptType, setReceiptType] = useState<ReceiptType>(
    ReceiptType.Original
  )
  const [showFungibleTokens, setShowFungibleTokens] = useState(false)
  const tokenAccounts = useTokenAccounts()
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
            isFetching={
              tokenAccounts.isFetching || allowedTokenDatas.isFetching
            }
            dataUpdatdAtMs={Math.max(
              tokenAccounts.dataUpdatedAt,
              allowedTokenDatas.dataUpdatedAt
            )}
            handleClick={() => tokenAccounts.refetch()}
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
        <UnstakedTokenList
          setUnstakedSelected={setUnstakedSelected}
          unstakedSelected={unstakedSelected}
          showFungibleTokens={showFungibleTokens}
          receiptType={receiptType}
          handleStake={handleStake}
        />
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
          <></>
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
              className="my-auto flex items-center justify-center rounded-md px-4 py-2 hover:scale-[1.03]"
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
                setUnstakedSelected(
                  unstakedSelected.length > 0
                    ? []
                    : allowedTokenDatas.data || []
                )
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
              <span className="my-auto">
                {unstakedSelected.length > 0 ? 'Unselect All' : 'Select All'}
              </span>
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}
