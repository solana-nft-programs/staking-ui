import { css } from '@emotion/react'
import { Card } from 'common/Card'
import { shortPubKey } from 'common/utils'
import type { StakePool } from 'hooks/useAllStakePools'
import { useRouter } from 'next/router'
import { transparentize } from 'polished'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'

export const CollectionsGrid = ({ configs }: { configs?: StakePool[] }) => {
  const router = useRouter()
  const { environment } = useEnvironmentCtx()
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
        configs.map((config) => (
          <Card
            key={config.stakePoolMetadata?.displayName}
            className="cursor-pointer transition-colors"
            css={css`
              &:hover {
                background: ${config.stakePoolMetadata?.colors?.primary &&
                transparentize(0.8, config.stakePoolMetadata?.colors?.primary)};
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
              <div className={`flex h-full w-full items-center justify-center`}>
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
              <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                {config.stakePoolMetadata?.displayName ??
                  shortPubKey(config.stakePoolData.pubkey)}
              </div>
            }
          />
        ))
      )}
    </div>
  )
}
