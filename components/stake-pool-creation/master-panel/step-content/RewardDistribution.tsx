import { InformationCircleIcon } from '@heroicons/react/24/outline'

import { RadioGroup } from '@/components/UI/inputs/RadioGroup'
import { LabelText } from '@/components/UI/typography/LabelText'

export const RewardDistribution = () => {
  return (
    <>
      <div className="mb-2 flex w-full items-center">
        <LabelText>How will the rewards be distributed to stakers?</LabelText>
        <InformationCircleIcon className="ml-1 h-6 w-6 cursor-pointer text-gray-400" />
      </div>
      <RadioGroup />
    </>
  )
}
