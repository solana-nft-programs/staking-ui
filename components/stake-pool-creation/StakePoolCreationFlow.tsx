import { CardinalLogoIcon } from 'assets/icons/CardinalLogoIcon'
import { FlagIcon } from 'assets/icons/FlagIcon'
import { GasPumpIcon } from 'assets/icons/GasPumpIcon'
import { SettingsIcon } from 'assets/icons/SettingsIcon'
import { HeadingPrimary } from 'components/UI/typography/HeadingPrimary'

import { ButtonPrimary } from '@/components/UI/buttons/ButtonPrimary'
import { HorizontalDivider } from '@/components/UI/HorizontalDivider'
import { BodyCopy } from '@/components/UI/typography/BodyCopy'
import { HeadingSecondary } from '@/components/UI/typography/HeadingSecondary'
import { LargeCopy } from '@/components/UI/typography/LargeCopy'
import { InformationCircleIcon } from '@heroicons/react/24/solid'
import FloatingBlurryBlob from '@/components/UI/FloatingBlurryBlob'
import { FloatingBlurryBlobColors } from '@/types/colors'

export const StakePoolCreationFlow = () => {
  return (
    <div className="relative mb-8 flex w-full py-8 px-10">
      <div className="w-1/3 space-y-6">
        <HeadingPrimary>Create your Staking Pool</HeadingPrimary>
        <BodyCopy>Thank you for your interest!</BodyCopy>
        <BodyCopy>
          Adding utility like staking brings rewards for both the users and the
          NFT collection itself.
        </BodyCopy>
        <div className="py-8">
          <HorizontalDivider />
        </div>
        <BodyCopy>You will be guided through the whole process:</BodyCopy>
        <div className="flex flex-wrap space-y-2 pb-8">
          <div className="flex w-full rounded-xl bg-gray-600 p-6">
            <div className="mr-4">
              <FlagIcon />
            </div>
            Complete 6 simple steps
          </div>
          <div className="flex w-full rounded-xl bg-gray-600 p-6">
            <div className="mr-4">
              <GasPumpIcon />
            </div>
            You will only be charged with blockchain gas fees
          </div>
          <div className="flex w-full rounded-xl bg-gray-600 p-6">
            <div className="mr-4">
              <SettingsIcon />
            </div>
            Manage your Stake Pool after creation
          </div>
        </div>
        <ButtonPrimary onClick={() => {}}>Start</ButtonPrimary>
      </div>

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
    </div>
  )
}
