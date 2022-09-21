import { DisplayAddress } from '@cardinal/namespaces-components'
import type { ReceiptType } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { useWallet } from '@solana/wallet-adapter-react'
import { LoadingSpinner } from 'common/LoadingSpinner'
import { QuickActions } from 'common/QuickActions'
import type { StakeEntryTokenData } from 'hooks/useStakedTokenDatas'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'

import { StakedStats } from './StakedStats'

export const StakedToken = ({
  tk,
  selected,
  receiptType,
  loadingUnstake,
  loadingClaim,
  select,
}: {
  tk: StakeEntryTokenData
  receiptType: ReceiptType
  selected: boolean
  loadingUnstake: boolean
  loadingClaim: boolean
  select: (tokenData: StakeEntryTokenData) => void
}) => {
  const wallet = useWallet()
  const { connection } = useEnvironmentCtx()
  const { data: stakePoolMetadata } = useStakePoolMetadata()
  return (
    <div key={tk?.stakeEntry?.pubkey.toBase58()} className="mx-auto">
      <div className="relative w-44 md:w-auto 2xl:w-48">
        <label htmlFor={tk?.stakeEntry?.pubkey.toBase58()} className="relative">
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
                <div className="absolute top-0 left-0 z-10 flex h-full w-full justify-center rounded-lg bg-black bg-opacity-80 align-middle text-white">
                  <div className="mx-auto flex items-center justify-center">
                    <span className="mr-2">
                      <LoadingSpinner height="20px" />
                    </span>
                    {loadingUnstake
                      ? 'Unstaking token...'
                      : 'Claiming rewards...'}
                  </div>
                </div>
              </div>
            )}
            {tk.stakeEntry?.parsed.lastStaker.toString() !==
              wallet.publicKey?.toString() && (
              <div>
                <div className="absolute top-0 left-0 z-10 flex h-full w-full justify-center rounded-xl bg-black bg-opacity-80  align-middle text-white">
                  <div className="mx-auto flex flex-col items-center justify-center">
                    <div>Owned by</div>
                    <DisplayAddress
                      dark
                      connection={connection}
                      address={tk.stakeEntry?.parsed.lastStaker}
                    />
                  </div>
                </div>
              </div>
            )}
            <QuickActions
              receiptType={receiptType}
              stakedTokenData={tk}
              selectUnstakedToken={() => {}}
              selectStakedToken={select}
            />
            <img
              className="mx-auto mt-4 rounded-t-xl bg-white bg-opacity-5 object-contain md:h-40 md:w-40 2xl:h-48 2xl:w-48"
              src={tk.metadata?.data.image || tk.tokenListData?.logoURI}
              alt={tk.metadata?.data.name || tk.tokenListData?.name}
            />
            <div
              className={`flex-col rounded-b-xl p-2 md:w-40 2xl:w-48 ${
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
              <StakedStats tokenData={tk} />
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
          </div>
        </label>
      </div>
    </div>
  )
}
