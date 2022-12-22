import { CardinalLogoIcon } from 'assets/icons/CardinalLogoIcon'

import { HorizontalDivider } from '@/components/UI/HorizontalDivider'
import { BodyCopy } from '@/components/UI/typography/BodyCopy'
import { HeadingSecondary } from '@/components/UI/typography/HeadingSecondary'

export type TipHeadingProps = { text: string }

export const TipHeading = ({ text }: TipHeadingProps) => {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-6">
        <CardinalLogoIcon />
      </div>
      <HeadingSecondary>{text}</HeadingSecondary>
      <BodyCopy>Tips & Tricks</BodyCopy>
      <div className="w-24 py-12">
        <HorizontalDivider />
      </div>
    </div>
  )
}
