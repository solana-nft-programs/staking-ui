import { CardinalLogoIcon } from 'assets/icons/CardinalLogoIcon'

import { HorizontalDivider } from '@/components/UI/HorizontalDivider'
import { BodyCopy } from '@/components/UI/typography/BodyCopy'
import { HeadingSecondary } from '@/components/UI/typography/HeadingSecondary'
import { LargeCopy } from '@/components/UI/typography/LargeCopy'

export const RewardDistributionTipOne = () => {
  return (
    <>
      <div className="mb-6">
        <CardinalLogoIcon />
      </div>
      <HeadingSecondary>Rewards emission</HeadingSecondary>
      <BodyCopy>Tips & Tricks</BodyCopy>
      <div className="w-24 py-12">
        <HorizontalDivider />
      </div>
      <div className="max-w-md px-4 text-center">
        <LargeCopy>
          Select between minting tokens from a mint address or transferring
          tokens directly to the stake pool from your wallet.
        </LargeCopy>
      </div>
    </>
  )
}
