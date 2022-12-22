import { FlagIcon } from 'assets/icons/FlagIcon'
import { GasPumpIcon } from 'assets/icons/GasPumpIcon'
import { SettingsIcon } from 'assets/icons/SettingsIcon'

import { HorizontalDivider } from '@/components/UI/HorizontalDivider'
import { BodyCopy } from '@/components/UI/typography/BodyCopy'

export const Intro = () => {
  return (
    <div className="pb-10">
      <BodyCopy>
        Adding utility like staking brings rewards for both the users and the
        NFT collection itself.
      </BodyCopy>
      <div className="py-8">
        <HorizontalDivider />
      </div>
      <BodyCopy className="mb-4">
        You will be guided through the whole process:
      </BodyCopy>
      <div className="flex flex-wrap space-y-2 pb-8">
        <div className="flex w-full rounded-xl bg-gray-800 p-6">
          <div className="mr-4">
            <FlagIcon />
          </div>
          Complete 3 simple steps
        </div>
        <div className="flex w-full rounded-xl bg-gray-800 p-6">
          <div className="mr-4">
            <GasPumpIcon />
          </div>
          You will only be charged with blockchain gas fees
        </div>
        <div className="flex w-full rounded-xl bg-gray-800 p-6">
          <div className="mr-4">
            <SettingsIcon />
          </div>
          Manage your Stake Pool after creation
        </div>
      </div>
    </div>
  )
}
