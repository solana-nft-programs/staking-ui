import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import type { PublicKey } from '@solana/web3.js'
import { HeaderSlim } from 'common/HeaderSlim'
import { withCluster } from 'common/utils'
import { useStakePoolsByAuthority } from 'hooks/useStakePoolsByAuthority'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'

import FloatingBlurryBlob from '@/components/UI/FloatingBlurryBlob'
import { ButtonColors, FloatingBlurryBlobColors } from '@/types/colors'
import { ButtonWidths } from '@/types/index'

import { ButtonPrimary } from '../UI/buttons/ButtonPrimary'
import { BodyCopy } from '../UI/typography/BodyCopy'
import { HeadingPrimary } from '../UI/typography/HeadingPrimary'

const { TRANSPARENT } = ButtonColors

export const SuccessPanel = ({ stakePoolId }: { stakePoolId?: PublicKey }) => {
  const router = useRouter()
  const { environment } = useEnvironmentCtx()
  const stakePoolsByAuthority = useStakePoolsByAuthority()

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 flex h-screen flex-col">
      <div className="relative flex h-full w-full flex-col overflow-clip rounded-2xl bg-black">
        <HeaderSlim />
        <FloatingBlurryBlob
          color={FloatingBlurryBlobColors.ORANGE}
          left={300}
          top={100}
          height={300}
          width={130}
          rotation={20}
        />
        <FloatingBlurryBlob
          color={FloatingBlurryBlobColors.ORANGE}
          left={750}
          top={500}
          height={350}
          width={240}
          rotation={40}
        />
        <ButtonPrimary
          color={TRANSPARENT}
          onClick={() => router.push('/')}
          className="absolute top-28 left-16 pt-8 hover:text-orange-500"
          width={ButtonWidths.NARROW}
        >
          <ChevronLeftIcon className="mr-2 h-4 w-4" />
          <div>Back to staking</div>
        </ButtonPrimary>
        <div className="mt-8 w-full px-8">
          <HeadingPrimary className="mb-4 text-center">
            Congratulations!
          </HeadingPrimary>
          <BodyCopy className="text-center text-gray-400">
            Your stake pool is now launched.
          </BodyCopy>
        </div>
        <div className="flex justify-center">
          <div className="flex space-x-4">
            <ButtonPrimary
              width={ButtonWidths.NARROW}
              className="mx-auto mt-6"
              onClick={() =>
                router.push(
                  withCluster(stakePoolId?.toString() || '', environment.label)
                )
              }
            >
              View Pool
            </ButtonPrimary>
          </div>
        </div>
        <div className="pointer-events-none -mt-16 flex w-full flex-col">
          <Image
            src="/images/stake-pool-creation/nfts-spread.png"
            alt="Spread of NFTs"
            layout="responsive"
            objectFit="contain"
            height={60}
            width={'100%'}
          />
        </div>
      </div>
    </div>
  )
}
