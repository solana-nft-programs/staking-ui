import { DisplayAddress } from '@cardinal/namespaces-components'
import { useWallet } from '@solana/wallet-adapter-react'
import { defaultSecondaryColor } from 'api/mapping'
import { LoadingSpinner } from 'common/LoadingSpinner'
import { QuickActions } from 'common/QuickActions'
import {
  getImageFromTokenData,
  getNameFromTokenData,
} from 'common/tokenDataUtils'
import { useMintMetadata } from 'hooks/useMintMetadata'
import type { StakeEntryTokenData } from 'hooks/useStakedTokenDatas'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import type { UseMutationResult } from 'react-query'

import { TokenStatBoostBadge } from '@/components/token-staking/token-stats/UI/TokenStatBoostBadge'
import { TokenStatNextRewardBadge } from '@/components/token-staking/token-stats/UI/TokenStatNextRewardBadge'

import { StakedStats } from './StakedStats'

export const StakedToken = ({
  tk,
  selected,
  loadingUnstake,
  loadingClaim,
  select,
  handleUnstake,
}: {
  tk: StakeEntryTokenData
  selected: boolean
  loadingUnstake: boolean
  loadingClaim: boolean
  select: (tokenData: StakeEntryTokenData) => void
  handleUnstake: UseMutationResult<
    string[],
    unknown,
    { tokenDatas: StakeEntryTokenData[] },
    unknown
  >
}) => {
  const wallet = useWallet()
  const { connection } = useEnvironmentCtx()
  const { data: stakePoolMetadata } = useStakePoolMetadata()
  const mintMetadata = useMintMetadata(tk)

  return (
    <div key={tk?.stakeEntry?.pubkey.toBase58()}>
      <div
        className="relative flex cursor-pointer flex-col rounded-xl"
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
            <div className="absolute top-0 left-0 z-10 flex h-full w-full justify-center rounded-lg bg-black bg-opacity-80 align-middle text-white">
              <div className="mx-auto flex items-center justify-center">
                <span className="mr-2">
                  <LoadingSpinner height="20px" />
                </span>
                {loadingUnstake ? 'Unstaking token...' : 'Claiming rewards...'}
              </div>
            </div>
          </div>
        )}
        {tk.stakeEntry?.parsed?.lastStaker.toString() !==
          wallet.publicKey?.toString() && (
          <div>
            <div className="absolute top-0 left-0 z-10 flex h-full w-full justify-center rounded-xl bg-black bg-opacity-80  align-middle text-white">
              <div className="mx-auto flex flex-col items-center justify-center">
                <div>Owned by</div>
                <DisplayAddress
                  dark
                  connection={connection}
                  address={tk.stakeEntry?.parsed?.lastStaker}
                />
              </div>
            </div>
          </div>
        )}
        <QuickActions
          stakedTokenData={tk}
          selectUnstakedToken={() => {}}
          selectStakedToken={select}
        />
        <div className="relative aspect-square w-full grow overflow-hidden rounded-t-xl">
          {mintMetadata.isFetched &&
          getImageFromTokenData(tk, mintMetadata.data) ? (
            <>
              <img
                loading="lazy"
                className={`absolute w-full rounded-t-xl object-contain`}
                src={getImageFromTokenData(tk, mintMetadata?.data)}
                alt={getNameFromTokenData(tk, mintMetadata?.data)}
              />
              <div className="absolute top-[90%] left-0 right-0 -bottom-2 bg-gradient-to-b from-transparent via-gray-700 to-gray-700" />
            </>
          ) : (
            <div
              className={`w-full grow animate-pulse rounded-t-xl bg-white bg-opacity-5 `}
            />
          )}
          <TokenStatBoostBadge tokenData={tk} />
          <TokenStatNextRewardBadge tokenData={tk} />
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
          <div className="truncate px-2 text-xl font-bold">
            {getNameFromTokenData(tk, mintMetadata?.data)}
          </div>
          <div className="truncate font-semibold">
            {tk.tokenListData?.symbol}
          </div>
          <StakedStats tokenData={tk} />
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
              onClick={() => handleUnstake.mutate({ tokenDatas: [tk] })}
            >
              Unstake
            </button>
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
    </div>
  )
}
