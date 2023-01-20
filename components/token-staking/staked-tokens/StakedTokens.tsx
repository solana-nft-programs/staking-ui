import { Tooltip } from '@mui/material'
import { BN } from '@project-serum/anchor'
import { defaultSecondaryColor } from 'api/mapping'
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
import { useState } from 'react'

import { StakedTokenList } from '@/components/token-staking/staked-tokens/StakedTokenList'

export const StakedTokens = () => {
  const { data: stakePoolMetadata } = useStakePoolMetadata()

  const [stakedSelected, setStakedSelected] = useState<StakeEntryTokenData[]>(
    []
  )
  const stakedTokenDatas = useStakedTokenDatas()
  const rewardDistributorData = useRewardDistributorData()
  const rewards = useRewards()
  const handleUnstake = useHandleUnstake(() => setStakedSelected([]))
  const handleClaimRewards = useHandleClaimRewards()

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
        <StakedTokenList
          handleUnstake={handleUnstake}
          stakedSelected={stakedSelected}
          setStakedSelected={setStakedSelected}
        />
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
              className="my-auto flex items-center justify-center rounded-md px-4 py-2 hover:scale-[1.03]"
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
                setStakedSelected(
                  stakedSelected.length > 0 ? [] : stakedTokenDatas.data || []
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
                {' '}
                {stakedSelected.length > 0 ? 'Unselect All' : 'Select All'}
              </span>
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
                className="my-auto flex items-center justify-center rounded-md px-4 py-2 hover:scale-[1.03]"
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
