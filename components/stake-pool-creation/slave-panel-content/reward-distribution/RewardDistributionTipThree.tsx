import { CardinalLogoIcon } from 'assets/icons/CardinalLogoIcon'

import { HorizontalDivider } from '@/components/UI/HorizontalDivider'
import { BodyCopy } from '@/components/UI/typography/BodyCopy'
import { HeadingSecondary } from '@/components/UI/typography/HeadingSecondary'
import { LargeCopy } from '@/components/UI/typography/LargeCopy'

export const RewardDistributionTipThree = () => {
  return (
    <>
      <div className="mb-6">
        <CardinalLogoIcon />
      </div>
      <HeadingSecondary>Top up the rewards treasury</HeadingSecondary>
      <BodyCopy>Tips & Tricks</BodyCopy>
      <div className="w-24 py-12">
        <HorizontalDivider />
      </div>
      <div className="max-w-lg space-y-4 px-4 text-center">
        <LargeCopy>
          Specify how many tokens to transfer to your Stake Pool for future
          distribution. The value can also be equal to 0, however, tokens will
          later have to be transferred into the rewards pool directly via your
          wallet.
        </LargeCopy>
      </div>
    </>
  )
}
