import { InformationCircleIcon } from '@heroicons/react/24/solid'
import { CardinalLogoIcon } from 'assets/icons/CardinalLogoIcon'

import { HorizontalDivider } from '@/components/UI/HorizontalDivider'
import { BodyCopy } from '@/components/UI/typography/BodyCopy'
import { HeadingSecondary } from '@/components/UI/typography/HeadingSecondary'
import { LargeCopy } from '@/components/UI/typography/LargeCopy'

export const Intro = () => {
  return (
    <>
      <div className="mb-6">
        <CardinalLogoIcon />
      </div>
      <HeadingSecondary>Cardinal Team</HeadingSecondary>
      <BodyCopy>Tips & Tricks</BodyCopy>
      <div className="w-24 py-12">
        <HorizontalDivider />
      </div>
      <div className="max-w-md px-4 text-center">
        <LargeCopy>
          To display useful tips here simply click on the icon next to a{' '}
          <InformationCircleIcon className="inline-block h-7 w-7 text-gray-500" />{' '}
          in a particular setting during the Stake Pool creation flow.
        </LargeCopy>
      </div>
    </>
  )
}
