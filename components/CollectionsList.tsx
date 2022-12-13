import { shortPubKey } from '@cardinal/common'
import { css } from '@emotion/react'
import type { StakePool } from 'hooks/useAllStakePools'
import {
  compareStakePools,
  totalStaked,
  useStakePoolEntryCounts,
} from 'hooks/useStakePoolEntryCounts'
import { useRouter } from 'next/router'
import { transparentize } from 'polished'

import { PercentStaked } from './PercentStaked'

export const CollectionsList = ({ configs }: { configs?: StakePool[] }) => {
  const router = useRouter()
  const stakePoolEntryCounts = useStakePoolEntryCounts()
  return (
    <div className="w-full overflow-x-scroll overflow-y-scroll rounded-xl border border-border p-4">
      <div className="flex w-full min-w-fit flex-col">
        <div className="flex w-full gap-4 rounded-xl bg-dark-4 px-8 py-2">
          <div className="flex-1">Image</div>
          <div className="flex-[4]">Collection</div>
          <div className="flex-1 justify-end text-right">Total Staked</div>
          <div className="flex-1 justify-end text-right">Percent Staked</div>
          {/* <div className="flex-1 justify-end text-right"></div> */}
        </div>
        <div className="flex flex-col">
          {!configs ? (
            <></>
          ) : (
            [...configs]
              .sort((a, b) =>
                compareStakePools(a, b, stakePoolEntryCounts.data ?? {})
              )
              .map((config) => (
                <div
                  key={`${config.stakePoolData.pubkey.toString()}`}
                  className="flex w-full cursor-pointer gap-4 border-b border-border px-8 py-4 md:flex-row"
                  // eslint-disable-next-line react/no-unknown-property
                  css={css`
                    &:hover {
                      background: ${config.stakePoolMetadata?.colors?.primary &&
                      transparentize(
                        0.8,
                        config.stakePoolMetadata.colors?.primary
                      )};
                    }
                  `}
                  onClick={() => {
                    router.push(
                      `/${
                        config.stakePoolMetadata?.name ??
                        config.stakePoolData.pubkey.toString()
                      }${location.search}`
                    )
                  }}
                >
                  <div className="flex flex-1 items-center">
                    <div className="flex items-center gap-5 md:flex-row">
                      {config.stakePoolMetadata?.imageUrl ? (
                        <img
                          className={`my-auto h-full max-h-[50px] min-w-[50px] max-w-[150px] rounded-xl ${
                            config.stakePoolMetadata.contrastHomepageBkg &&
                            `bg-white bg-opacity-20 p-2`
                          } ${config.stakePoolMetadata?.logoPadding && 'p-3'}`}
                          src={config.stakePoolMetadata?.imageUrl}
                          alt={
                            config.stakePoolMetadata?.name ??
                            config.stakePoolData.pubkey.toString()
                          }
                        />
                      ) : (
                        <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full text-lg text-white text-opacity-40">
                          <img
                            className={`h-full max-h-[40px] max-w-[150px] rounded-xl`}
                            src={'/cardinal-crosshair.svg'}
                            alt={config.stakePoolData.pubkey.toString()}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex h-[50px] flex-[4] items-center">
                    {config.stakePoolMetadata?.displayName ??
                      shortPubKey(config.stakePoolData.pubkey.toString())}
                  </div>
                  <div className="flex flex-1 items-center justify-end">
                    {totalStaked(
                      config.stakePoolMetadata,
                      stakePoolEntryCounts.data ?? {}
                    ) || '-'}
                  </div>
                  <div className="flex flex-1 items-center justify-end">
                    <PercentStaked stakePool={config} />
                  </div>
                  {/* <div className="flex flex-1 justify-end">
                    <ButtonSmall>View</ButtonSmall>
                  </div> */}
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  )
}
