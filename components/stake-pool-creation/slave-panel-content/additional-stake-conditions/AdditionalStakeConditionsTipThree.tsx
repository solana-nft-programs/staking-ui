import { CardinalLogoIcon } from 'assets/icons/CardinalLogoIcon'

import { HorizontalDivider } from '@/components/UI/HorizontalDivider'
import { BodyCopy } from '@/components/UI/typography/BodyCopy'
import { HeadingSecondary } from '@/components/UI/typography/HeadingSecondary'
import { LargeCopy } from '@/components/UI/typography/LargeCopy'

export const AdditionalStakeConditionsTipThree = () => {
  return (
    <>
      <div className="mb-6">
        <CardinalLogoIcon />
      </div>
      <HeadingSecondary>Reset cumulative stake duration</HeadingSecondary>
      <BodyCopy>Tips & Tricks</BodyCopy>
      <div className="w-24 py-12">
        <HorizontalDivider />
      </div>
      <div className="max-w-lg space-y-4 px-4 text-center">
        <LargeCopy>
          If active then every time a user stakes a token, then unstakes it and
          stakes again in your Stake Pool the stake timer will reset rather than
          accumulate.
        </LargeCopy>
      </div>
    </>
  )
}
