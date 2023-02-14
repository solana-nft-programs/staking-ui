import { css } from '@emotion/react'
import { Card } from 'common/Card'
import { Stats } from 'common/Stats'
import { shortPubKey } from 'common/utils'
import type { StakePool } from 'hooks/useAllStakePools'
import {
  compareStakePools,
  percentStaked,
  totalStaked,
  useAllStakePools,
} from 'hooks/useAllStakePools'
import { isStakePoolV2 } from 'hooks/useStakePoolData'
import { useRouter } from 'next/router'
import { transparentize } from 'polished'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'

export function trySeq<T>(fn: () => T): T | null {
  try {
    return fn()
  } catch {
    return null
  }
}

export const CollectionsGrid = ({ configs }: { configs?: StakePool[] }) => {
  const router = useRouter()
  const { environment } = useEnvironmentCtx()

  const stakePools = useAllStakePools()
  return (
    <div className="grid grid-cols-1 flex-wrap gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {!configs ? (
        <>
          <Card skeleton header={<></>} />
          <Card skeleton header={<></>} />
          <Card skeleton header={<></>} />
          <Card skeleton header={<></>} />
          <Card skeleton header={<></>} />
          <Card skeleton header={<></>} />
        </>
      ) : (
        [...configs]
          .sort((a, b) => compareStakePools(a, b))
          .map((config) => (
            <Card
              key={
                config.stakePoolData.pubkey.toString() ||
                config.stakePoolMetadata?.name
              }
              className="cursor-pointer transition-colors"
              css={css`
                &:hover {
                  background: ${config.stakePoolMetadata?.colors?.primary &&
                  !!trySeq(() =>
                    transparentize(
                      0.8,
                      config.stakePoolMetadata?.colors?.primary ?? ''
                    )
                  ) &&
                  transparentize(
                    0.8,
                    config.stakePoolMetadata?.colors?.primary
                  )};
                }
              `}
              onClick={() =>
                router.push(
                  config.stakePoolMetadata?.redirect ??
                    `/${
                      config.stakePoolMetadata?.name ||
                      config.stakePoolData.pubkey.toString()
                    }${
                      environment.label !== 'mainnet-beta'
                        ? `?cluster=${environment.label}`
                        : ''
                    }`
                )
              }
              hero={
                <div
                  className={`flex h-full w-full items-center justify-center`}
                >
                  {config.stakePoolMetadata?.imageUrl ? (
                    <img
                      className={`max-h-full rounded-xl`}
                      src={config.stakePoolMetadata?.imageUrl}
                      alt={`${
                        config.stakePoolMetadata?.name ??
                        config.stakePoolData.pubkey.toString()
                      }`}
                    />
                  ) : (
                    <div className="flex h-full flex-grow items-center justify-center">
                      <div className="flex h-[150px] w-[150px] items-center justify-center rounded-full text-5xl">
                        <img
                          className={`max-h-28 rounded-xl fill-red-600`}
                          src={'/cardinal-crosshair.svg'}
                          alt={`${config.stakePoolData.pubkey.toString()}`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              }
              header={
                <div className="flex flex-col gap-2">
                  <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                    {config.stakePoolMetadata?.displayName ??
                      shortPubKey(config.stakePoolData.pubkey)}
                  </div>
                  {!stakePools.isFetched ? (
                    <Stats
                      stats={[
                        {
                          header: 'Total Staked',
                          value: (
                            <div className="mt-1 h-5 w-12 animate-pulse rounded-md bg-border" />
                          ),
                        },
                      ]}
                    />
                  ) : config.stakePoolData &&
                    config.stakePoolData &&
                    !!config.stakePoolMetadata?.maxStaked ? (
                    <Stats
                      stats={[
                        {
                          header: 'Total Staked',
                          value: totalStaked(config).toLocaleString(),
                        },
                        {
                          header: 'Percent Staked',
                          value: (percentStaked(config) ?? 0).toFixed(2),
                        },
                      ]}
                    />
                  ) : (
                    <Stats
                      stats={[
                        {
                          header: 'Total Staked',
                          value: totalStaked(config).toLocaleString(),
                        },
                      ]}
                    />
                  )}
                </div>
              }
              content={
                <>
                  {config.stakePoolData?.parsed && (
                    <div className="flex justify-end text-xs text-gray-400">
                      <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                        {isStakePoolV2(config.stakePoolData?.parsed)
                          ? 'V2'
                          : 'V1'}
                      </div>
                    </div>
                  )}
                </>
              }
            />
          ))
      )}
    </div>
  )
}
