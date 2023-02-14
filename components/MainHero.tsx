import { PlusIcon } from '@heroicons/react/24/solid'
import { HeaderSlim } from 'common/HeaderSlim'
import { withCluster } from 'common/utils'
import { useAllStakePools } from 'hooks/useAllStakePools'
import { useStat } from 'hooks/useStat'
import { useRouter } from 'next/router'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'

import { ButtonPrimary } from '@/components/UI/buttons/ButtonPrimary'
import { BodyCopy } from '@/components/UI/typography/BodyCopy'
import { HeadingPrimary } from '@/components/UI/typography/HeadingPrimary'

import { ButtonWidths } from '../types'

export const MainHero = () => {
  const { environment } = useEnvironmentCtx()
  const allStakePools = useAllStakePools()
  const totalStakedTokens = useStat('total-active-staked-tokens')
  const router = useRouter()
  return (
    <div className="relative z-0 text-sm">
      <div className="blur-4xl absolute left-8 top-52 -z-10 h-[120px] w-[400px] -rotate-[60deg] bg-glow blur-[100px]" />
      <div className="blur-4xl absolute -right-20 top-72 -z-10 h-[100px] w-[550px] -rotate-[60deg] bg-glow blur-[120px]" />
      <HeaderSlim />
      <div className="flex flex-wrap justify-between gap-10 px-8 py-24 md:px-16">
        <div className="flex flex-col gap-2">
          <HeadingPrimary className="mb-2">
            NFT Staking on Solana
          </HeadingPrimary>
          <div className="text-lg text-medium-3">
            Lock your NFTs or tokens to earn rewards from various reward
            mechanisms including
            <br />
            tokens, merchandise, redeemable rewards, referral tokens and more.
          </div>
        </div>
        <div className="flex flex-col items-center gap-5 ">
          <div className="flex w-full flex-wrap items-center justify-between gap-2 lg:gap-6">
            <BodyCopy className="">
              Does your NFT collection or tokens need staking?
            </BodyCopy>
            <ButtonPrimary
              width={ButtonWidths.NARROW}
              onClick={() => {
                router.push(withCluster('/admin/create', environment.label))
              }}
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Create new pool
            </ButtonPrimary>
          </div>
          <div className="flex w-fit flex-wrap gap-3 rounded-xl border-[2px] border-border p-4">
            <div className="flex items-center gap-2">
              <div className="text-medium-3">Total Staked Tokens</div>
              <div className="text-light-0">
                {totalStakedTokens.data?.parsed ? (
                  Number(totalStakedTokens.data?.parsed.value).toLocaleString(
                    'en-US'
                  )
                ) : (
                  <div className="mt-[1px] h-5 w-12 animate-pulse rounded-md bg-border" />
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-medium-3">Total Staked NFTs</div>
              <div className="text-light-0">
                {allStakePools.data ? (
                  (
                    allStakePools.data.stakePoolsWithMetadata.reduce(
                      (acc, a) => acc + a.stakePoolData.parsed.totalStaked,
                      0
                    ) +
                    allStakePools.data.stakePoolsWithoutMetadata.reduce(
                      (acc, a) => acc + a.stakePoolData.parsed.totalStaked,
                      0
                    )
                  ).toLocaleString('en-US')
                ) : (
                  <div className="mt-[1px] h-5 w-12 animate-pulse rounded-md bg-border" />
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-medium-3">Total Stake Pools</div>
              <div className="text-light-0">
                {allStakePools.data ? (
                  (
                    allStakePools.data.stakePoolsWithMetadata.length +
                    allStakePools.data.stakePoolsWithoutMetadata.length
                  ).toLocaleString('en-US')
                ) : (
                  <div className="mt-[1px] h-5 w-12 animate-pulse rounded-md bg-border" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
