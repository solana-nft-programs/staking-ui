import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

import { MultiplierInputs } from '@/components/stake-pool-creation/master-panel/step-content/reward-supply/MultiplierInputs'
import { ButtonDecrement } from '@/components/UI/buttons/ButtonDecrement'
import { ButtonIncrement } from '@/components/UI/buttons/ButtonIncrement'
import { NumberInput } from '@/components/UI/inputs/NumberInput'
import { TextInput } from '@/components/UI/inputs/TextInput'
import { LabelText } from '@/components/UI/typography/LabelText'

export const RewardSupply = () => {
  const [rewardAmountPerStakedToken, setRewardAmountPerStakedToken] =
    useState('')
  const [generationRate, setGenerationRate] = useState('')
  return (
    <>
      <div className="pb-6">
        <div className="mb-2 flex w-full items-center">
          <LabelText>Rewards mint address</LabelText>
          <InformationCircleIcon className="ml-1 h-6 w-6 cursor-pointer text-gray-400" />
        </div>
        <NumberInput
          placeholder="0.000"
          value={rewardAmountPerStakedToken}
          onChange={(e) => setRewardAmountPerStakedToken(e.target.value)}
        />
      </div>
      <div className="pb-6">
        <div className="mb-2 flex w-full items-center">
          <LabelText>Reward generation rate</LabelText>
          <InformationCircleIcon className="ml-1 h-6 w-6 cursor-pointer text-gray-400" />
        </div>
        <div className="flex space-x-3">
          <ButtonDecrement onClick={() => {}} />
          <TextInput
            className="w-12"
            value={generationRate}
            onChange={(e) => setGenerationRate(e.target.value)}
          />
          <ButtonIncrement onClick={() => {}} />
        </div>
      </div>
      <MultiplierInputs />
    </>
  )
}
