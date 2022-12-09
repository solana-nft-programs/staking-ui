import { CardinalLogoIcon } from 'assets/icons/CardinalLogoIcon'

import { HorizontalDivider } from '@/components/UI/HorizontalDivider'
import { BodyCopy } from '@/components/UI/typography/BodyCopy'
import { HeadingSecondary } from '@/components/UI/typography/HeadingSecondary'
import { LargeCopy } from '@/components/UI/typography/LargeCopy'

export const TimeBasedParametersTipThree = () => {
  return (
    <>
      <div className="mb-6">
        <CardinalLogoIcon />
      </div>
      <HeadingSecondary>Maximum rewards duration</HeadingSecondary>
      <BodyCopy>Tips & Tricks</BodyCopy>
      <div className="w-24 py-12">
        <HorizontalDivider />
      </div>
      <div className="max-w-lg space-y-4 px-4 text-center">
        <LargeCopy>
          Specify for how long a staked token can receive rewards in your pool.
        </LargeCopy>
      </div>
    </>
  )
}
