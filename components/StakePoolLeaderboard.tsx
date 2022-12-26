import { DisplayAddress } from '@cardinal/namespaces-components'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import type { PublicKey } from '@solana/web3.js'
import { BN } from 'bn.js'
import { Tooltip } from 'common/Tooltip'
import { useStakePoolEntries } from 'hooks/useStakePoolEntries'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'
import { getLuminance } from 'polished'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useUTCNow } from 'providers/UTCNowProvider'
import { useEffect, useState } from 'react'

export const PAGE_SIZE = 10
export const DEFAULT_PAGE: [number, number] = [2, 0]

export const StakePoolLeaderboard = () => {
  const { connection } = useEnvironmentCtx()
  const { data: config } = useStakePoolMetadata()
  const stakePoolEntries = useStakePoolEntries()
  const { UTCNow } = useUTCNow()

  const analysisPerWallet = (stakePoolEntries.data ?? []).reduce(
    (acc, stakeEntry) => {
      const wallet = stakeEntry.parsed.lastStaker
      const currentEntry = {
        wallet,
        totalStakeAmount: stakeEntry.parsed.amount.toNumber(),
        totalStakeSeconds: stakeEntry.parsed.totalStakeSeconds
          .add(
            new BN(UTCNow).sub(
              stakeEntry.parsed.lastUpdatedAt ?? stakeEntry.parsed.lastStakedAt
            )
          )
          .toNumber(),
      }
      const existingEntry = acc[wallet.toString()]
      if (existingEntry) {
        acc[wallet.toString()] = {
          wallet,
          totalStakeAmount:
            existingEntry.totalStakeAmount + currentEntry.totalStakeAmount,
          totalStakeSeconds:
            existingEntry.totalStakeSeconds + currentEntry.totalStakeSeconds,
        }
      } else {
        acc[wallet.toString()] = currentEntry
      }
      return acc
    },
    {} as {
      [wallet: string]: {
        wallet: PublicKey
        totalStakeAmount: number
        totalStakeSeconds: number
      }
    }
  )

  const [pageNum, setPageNum] = useState<[number, number]>(DEFAULT_PAGE)

  useEffect(() => {
    setPageNum(DEFAULT_PAGE)
  }, [
    Object.values(analysisPerWallet)
      ?.map((r) => r?.wallet.toString())
      .join(','),
  ])

  useEffect(() => {
    const onScroll = (event: Event) => {
      const { scrollHeight, scrollTop, clientHeight } =
        // @ts-ignore
        event.target?.scrollingElement
      if (scrollHeight - scrollTop <= clientHeight * 1.2) {
        setPageNum(([n, prevScrollHeight]) => {
          return prevScrollHeight !== scrollHeight
            ? [n + 1, scrollHeight]
            : [n, prevScrollHeight]
        })
      }
    }
    document.addEventListener('scroll', onScroll)
    return () => document.removeEventListener('scroll', onScroll)
  }, [pageNum])

  return (
    <div className="w-full overflow-x-scroll overflow-y-scroll rounded-xl border border-border p-4">
      <div className="flex w-full min-w-fit flex-col">
        <div
          className="flex w-full gap-4 rounded-xl px-8 py-2"
          style={{
            background: config?.colors?.backgroundSecondary,
          }}
        >
          <div className="flex-[4]">Wallet</div>
          <div className="flex-1">Staked Tokens</div>
          <div className="flex flex-1 cursor-pointer items-center justify-end text-right">
            <Tooltip title="Total milliseconds staked">
              <div className="flex items-center gap-1">
                Stake Score{' '}
                <InformationCircleIcon className="inline-block h-5 w-5" />
              </div>
            </Tooltip>
          </div>
        </div>
        <div className="flex flex-col">
          {!stakePoolEntries.isFetched ? (
            <div className="mt-4 h-8 w-full animate-pulse rounded-lg bg-border"></div>
          ) : (
            Object.values(analysisPerWallet)
              .sort((a, b) => b.totalStakeSeconds - a.totalStakeSeconds)
              .slice(0, PAGE_SIZE * pageNum[0])
              .map(({ wallet, totalStakeAmount, totalStakeSeconds }) => (
                <div
                  key={`${wallet.toString()}`}
                  className="flex w-full cursor-pointer gap-4 border-b border-border px-8 py-4 md:flex-row"
                >
                  <div className="flex h-[50px] flex-[4] items-center">
                    <DisplayAddress
                      dark={
                        config?.colors?.primary
                          ? getLuminance(config?.colors?.primary) < 0.5
                          : true
                      }
                      style={{
                        color: config?.colors?.fontColor,
                      }}
                      connection={connection}
                      address={wallet}
                    />
                  </div>
                  <div className="flex h-[50px] flex-1 items-center">
                    {totalStakeAmount}
                  </div>
                  <div className="flex flex-1 items-center justify-end">
                    {(totalStakeSeconds / 1000).toFixed(3)}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  )
}
