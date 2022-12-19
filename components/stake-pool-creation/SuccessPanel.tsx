import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import type { PublicKey } from '@solana/web3.js'
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
  return (
    <div className="flex h-screen flex-col pt-5 pb-10">
      <div className="relative flex h-full w-full flex-col overflow-clip rounded-2xl bg-black">
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
        <div className="mt-8 flex w-full items-center justify-center px-8">
          <ButtonPrimary
            color={TRANSPARENT}
            onClick={() => router.push('/')}
            className="w-1/6 hover:text-orange-500"
            width={ButtonWidths.NARROW}
          >
            <ChevronLeftIcon className="mr-2 h-4 w-4" />
            <div>Back to staking</div>
          </ButtonPrimary>
          <div className="flex w-4/6 flex-col items-center justify-center">
            <HeadingPrimary className="mb-2 self-center text-center">
              Congratulations!
            </HeadingPrimary>
            <BodyCopy className="text-gray-400">
              Your stake pool is now launched.
            </BodyCopy>
          </div>
          <div className="w-1/6"></div>
        </div>
        <ButtonPrimary
          width={ButtonWidths.NARROW}
          className="mx-auto mt-6"
          onClick={() =>
            router.push(
              `/${stakePoolId?.toString()}?cluster=${environment.label}`
            )
          }
        >
          View
        </ButtonPrimary>
        <div className="flex w-full flex-col">
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
