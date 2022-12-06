import { DisplayAddress } from '@cardinal/namespaces-components'
import { useWallet } from '@solana/wallet-adapter-react'
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

import { StakedStats } from './StakedStats'

export const StakedToken = ({
  tk,
  selected,
  loadingUnstake,
  loadingClaim,
  select,
}: {
  tk: StakeEntryTokenData
  selected: boolean
  loadingUnstake: boolean
  loadingClaim: boolean
  select: (tokenData: StakeEntryTokenData) => void
}) => {
  const wallet = useWallet()
  const { connection } = useEnvironmentCtx()
  const { data: stakePoolMetadata } = useStakePoolMetadata()
  const mintMetadata = useMintMetadata(tk)
  return (
    <div
      key={tk?.stakeEntry?.pubkey.toBase58()}
      className="relative mx-auto min-w-full"
    >
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
        <div className="aspect-square w-full grow overflow-hidden rounded-t-xl">
          {mintMetadata.isFetched &&
          getImageFromTokenData(tk, mintMetadata.data) ? (
            <img
              loading="lazy"
              className={`w-full rounded-t-xl object-contain`}
              src={getImageFromTokenData(tk, mintMetadata?.data)}
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
          <div className="truncate font-semibold">
            {tk.tokenListData?.symbol}
          </div>
          <StakedStats tokenData={tk} />
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
