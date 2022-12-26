import { Tooltip } from '@mui/material'
import { BN } from '@project-serum/anchor'
import { useWallet } from '@solana/wallet-adapter-react'
import { defaultSecondaryColor } from 'api/mapping'
import { contrastify } from 'common/colors'
import { LoadingSpinner } from 'common/LoadingSpinner'
import { notify } from 'common/Notification'
import { RefreshButton } from 'common/RefreshButton'
import { useHandleClaimRewards } from 'handlers/useHandleClaimRewards'
import { useHandleUnstake } from 'handlers/useHandleUnstake'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { useRewards } from 'hooks/useRewards'
import type { StakeEntryTokenData } from 'hooks/useStakedTokenDatas'
import { useStakedTokenDatas } from 'hooks/useStakedTokenDatas'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'
import { useRef, useState } from 'react'

import { StakedToken } from './StakedToken'

export const PAGE_SIZE = 3
export const DEFAULT_PAGE: [number, number] = [3, 0]

export const StakedTokens = () => {
  const { data: stakePoolMetadata } = useStakePoolMetadata()
  const wallet = useWallet()
  const [pageNum, setPageNum] = useState<[number, number]>(DEFAULT_PAGE)
  const ref = useRef<HTMLDivElement | null>(null)

  const [stakedSelected, setStakedSelected] = useState<StakeEntryTokenData[]>(
    []
  )
  const stakedTokenDatas = useStakedTokenDatas()
  const rewardDistributorData = useRewardDistributorData()
  const rewards = useRewards()
  const handleUnstake = useHandleUnstake(() => setStakedSelected([]))
  const handleClaimRewards = useHandleClaimRewards()

  const selectStakedToken = (tk: StakeEntryTokenData) => {
    if (handleUnstake.isLoading) return
    if (
      tk.stakeEntry?.parsed?.lastStaker.toString() !==
      wallet.publicKey?.toString()
    ) {
      return
    }
    if (isStakedTokenSelected(tk)) {
      setStakedSelected(
        stakedSelected.filter(
          (data) =>
            data.stakeEntry?.pubkey.toString() !==
            tk.stakeEntry?.pubkey.toString()
        )
      )
    } else {
      setStakedSelected([...stakedSelected, tk])
    }
  }

  const isStakedTokenSelected = (tk: StakeEntryTokenData) =>
    stakedSelected.some(
      (stk) =>
        stk.stakeEntry?.parsed?.stakeMint.toString() ===
        tk.stakeEntry?.parsed?.stakeMint.toString()
    )

  return (
    <div
      className={`rounded-xl p-10 ${
        stakePoolMetadata?.colors?.fontColor ? '' : 'text-gray-200'
      } bg-white bg-opacity-5`}
      style={{
        background: stakePoolMetadata?.colors?.backgroundSecondary,
        border: stakePoolMetadata?.colors?.accent
          ? `2px solid ${stakePoolMetadata?.colors?.accent}`
          : '',
      }}
    >
      <div className="mb-5 flex flex-row items-center justify-between">
        <div className="mt-2 flex flex-row">
          <div className="mr-3 text-lg">
            View Staked Tokens{' '}
            {stakedTokenDatas.isFetched &&
              stakedTokenDatas.data &&
              `(${stakedTokenDatas.data.length})`}
          </div>
        </div>
        <div className="flex flex-row items-center justify-center">
          <RefreshButton
            colorized
            isFetching={stakedTokenDatas.isFetching}
            dataUpdatdAtMs={stakedTokenDatas.dataUpdatedAt}
            handleClick={() => stakedTokenDatas.refetch()}
          />
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
          {!stakedTokenDatas.isFetched ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="aspect-square animate-pulse rounded-lg bg-white bg-opacity-5 p-10"></div>
              <div className="aspect-square animate-pulse rounded-lg bg-white bg-opacity-5 p-10"></div>
              <div className="aspect-square animate-pulse rounded-lg bg-white bg-opacity-5 p-10"></div>
            </div>
          ) : stakedTokenDatas.data?.length === 0 ? (
            <p
              className={`font-normal ${
                stakePoolMetadata?.colors?.fontColor
                  ? ''
                  : 'text-gray-400 opacity-50'
              }`}
            >
              No tokens currently staked.
            </p>
          ) : (
            <div
              className={'grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3'}
            >
              {!stakePoolMetadata?.notFound &&
                stakedTokenDatas.data &&
                stakedTokenDatas.data
                  .slice(0, PAGE_SIZE * pageNum[0])
                  .map((tk) => (
                    <StakedToken
                      key={tk?.stakeEntry?.pubkey.toBase58()}
                      tk={tk}
                      select={(tk) => selectStakedToken(tk)}
                      selected={isStakedTokenSelected(tk)}
                      loadingClaim={
                        handleClaimRewards.isLoading &&
                        isStakedTokenSelected(tk)
                      }
                      loadingUnstake={
                        handleUnstake.isLoading && isStakedTokenSelected(tk)
                      }
                    />
                  ))}
            </div>
          )}
        </div>
      </div>
      <div className="mt-2 flex flex-row-reverse flex-wrap justify-between gap-5">
        <div className="flex flex-wrap gap-5">
          <Tooltip title={'Unstake will automatically claim reward for you.'}>
            <button
              onClick={() => {
                if (stakedSelected.length === 0) {
                  notify({
                    message: `No tokens selected`,
                    type: 'error',
                  })
                } else {
                  handleUnstake.mutate({ tokenDatas: stakedSelected })
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
                {handleUnstake.isLoading && (
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
              <span className="my-auto">Unstake ({stakedSelected.length})</span>
            </button>
          </Tooltip>
          <Tooltip title="Attempt to unstake all tokens at once">
            <button
              onClick={() => {
                setStakedSelected(stakedTokenDatas.data || [])
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
        <div className="flex gap-5">
          {rewardDistributorData.data &&
            rewards.data?.claimableRewards.gt(new BN(0)) && (
              <button
                onClick={() => {
                  if (stakedSelected.length === 0) {
                    notify({
                      message: `No tokens selected`,
                      type: 'error',
                    })
                  } else {
                    handleClaimRewards.mutate({
                      tokenDatas: stakedSelected,
                    })
                  }
                }}
                disabled={!rewards.data?.claimableRewards.gt(new BN(0))}
                style={{
                  background:
                    stakePoolMetadata?.colors?.secondary ||
                    defaultSecondaryColor,
                  color:
                    stakePoolMetadata?.colors?.fontColorSecondary ||
                    stakePoolMetadata?.colors?.fontColor,
                }}
                className="my-auto flex rounded-md px-4 py-2 hover:scale-[1.03]"
              >
                <span className="mr-1 inline-block">
                  {handleClaimRewards.isLoading && (
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
                <span className="my-auto">
                  Claim Rewards ({stakedSelected.length})
                </span>
              </button>
            )}
        </div>
      </div>
    </div>
  )
}
