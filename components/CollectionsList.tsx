import { shortPubKey } from '@cardinal/common'
import { css } from '@emotion/react'
import { ButtonSmall } from 'common/ButtonSmall'
import type { StakePool } from 'hooks/useAllStakePools'
import { useRouter } from 'next/router'
import { transparentize } from 'polished'

export const CollectionsList = ({ configs }: { configs?: StakePool[] }) => {
  const router = useRouter()
  return (
    <div className="w-full overflow-x-scroll overflow-y-scroll rounded-xl border border-border p-4">
      <div className="flex w-full min-w-fit flex-col">
        <div className="flex w-full gap-4 rounded-xl bg-dark-4 px-8 py-2">
          <div className="flex-1">Image</div>
          <div className="flex-[2]">Collection</div>
          <div className="flex-[2] justify-end text-right"></div>
        </div>
        <div className="flex flex-col">
          {!configs ? (
            <></>
          ) : (
            [...configs].map((config) => (
              <div
                key={`${config.stakePoolData.pubkey.toString()}`}
                className="flex w-full cursor-pointer gap-4 border-b border-border px-8 py-4 md:flex-row"
                css={css`
                  &:hover {
                    background: ${config.stakePoolMetadata?.colors?.primary &&
                    transparentize(
                      0.9,
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
                <div className="min-w-fit flex-1">
                  <div className="flex items-center gap-5 md:flex-row">
                    {config.stakePoolMetadata?.imageUrl ? (
                      <img
                        className={`h-full max-h-[50px] max-w-[150px] rounded-xl ${
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
                <div className="flex flex-[2] items-center">
                  {config.stakePoolMetadata?.displayName ??
                    shortPubKey(config.stakePoolData.pubkey.toString())}
                </div>
                <div className="flex flex-[2] justify-end">
                  <ButtonSmall>View</ButtonSmall>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
