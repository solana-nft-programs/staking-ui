import { InformationCircleIcon } from '@heroicons/react/24/solid'
import { CardinalLogoIcon } from 'assets/icons/CardinalLogoIcon'

import FloatingBlurryBlob from '@/components/UI/FloatingBlurryBlob'
import { HorizontalDivider } from '@/components/UI/HorizontalDivider'
import { BodyCopy } from '@/components/UI/typography/BodyCopy'
import { HeadingSecondary } from '@/components/UI/typography/HeadingSecondary'
import { LargeCopy } from '@/components/UI/typography/LargeCopy'
import { FloatingBlurryBlobColors } from '@/types/colors'

export const SlavePanel = () => {
  return (
    <div className="ml-8 flex w-2/3 flex-col">
      <div className="relative flex h-full w-full flex-col items-center justify-center overflow-clip rounded-2xl bg-black">
        <div className="z-10 mb-6">
          <CardinalLogoIcon />
        </div>
        <HeadingSecondary className="z-10">Cardinal Team</HeadingSecondary>
        <BodyCopy className="z-10">Tips & Tricks</BodyCopy>
        <div className="z-10 w-24 py-12">
          <HorizontalDivider />
        </div>
        <div className="z-10 max-w-md px-4 text-center">
          <LargeCopy>
            To display useful tips here simply click on the icon next to a{' '}
            <InformationCircleIcon className="inline-block h-7 w-7 text-gray-500" />{' '}
            in a particular setting during the Stake Pool creation flow.
          </LargeCopy>
        </div>
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
      </div>
    </div>
  )
}
