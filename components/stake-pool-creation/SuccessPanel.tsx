import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'

import { ButtonPrimary } from '@/components/UI/buttons/ButtonPrimary'
import FloatingBlurryBlob from '@/components/UI/FloatingBlurryBlob'
import { BodyCopy } from '@/components/UI/typography/BodyCopy'
import { HeadingPrimary } from '@/components/UI/typography/HeadingPrimary'
import { ButtonColors, FloatingBlurryBlobColors } from '@/types/colors'
import { ButtonWidths } from '@/types/index'
import { useRouter } from 'next/router'

const { TRANSPARENT } = ButtonColors

export const SuccessPanel = () => {
  const router = useRouter()

  return (
    <div className="flex h-full flex-col">
      <div className="relative flex h-full w-full flex-col items-center justify-center overflow-clip rounded-2xl bg-black">
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
        <div className="flex w-full flex-col pt-[100px] lg:pt-[300px] 2xl:pt-[450px]">
          <Image
            src="/images/stake-pool-creation/nfts-spread.png"
            alt="Spread of NFTs"
            layout="responsive"
            objectFit="contain"
            height={300}
            width={'100%'}
          />
        </div>
        <div className="absolute top-28 flex w-full items-center justify-center px-8 text-center">
          <ButtonPrimary
            color={TRANSPARENT}
            onClick={() => router.push('/')}
            className="mt-8 w-1/6 hover:text-orange-500"
            width={ButtonWidths.NARROW}
          >
            <ChevronLeftIcon className="mr-2 h-4 w-4" />
            <div>Back to staking</div>
          </ButtonPrimary>
          <div className="mt-8 flex w-4/6 flex-col items-center justify-center">
            <HeadingPrimary className="mb-2 self-center text-center">
              Congratulations!
            </HeadingPrimary>
            <BodyCopy className="text-gray-400">
              Your Stake Pool is now launched.
            </BodyCopy>
          </div>
          <div className="w-48 "></div>
        </div>
      </div>
    </div>
  )
}
