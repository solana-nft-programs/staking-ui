import { InformationCircleIcon } from '@heroicons/react/24/outline'
import type { Dispatch, SetStateAction } from 'react'

import { SlavePanelScreens } from '@/components/stake-pool-creation/SlavePanel'
import { ButtonDecrement } from '@/components/UI/buttons/ButtonDecrement'
import { ButtonIncrement } from '@/components/UI/buttons/ButtonIncrement'
import { TextInput } from '@/components/UI/inputs/TextInput'
import { LabelText } from '@/components/UI/typography/LabelText'

export type MultiplierInputProps = {
  multiplier: string
  setMultiplier: (value: string) => void
  address: string
  setAddress: (value: string) => void
  setActiveSlavePanelScreen: Dispatch<SetStateAction<SlavePanelScreens>>
}

export const MultiplierInput = ({
  multiplier,
  setMultiplier,
  address,
  setAddress,
  setActiveSlavePanelScreen,
}: MultiplierInputProps) => {
  const { REWARD_SUPPLY_3 } = SlavePanelScreens
  return (
    <div className="pb-6">
      <div className="mb-2 flex w-full items-center">
        <LabelText isOptional>Multiplier for given mints</LabelText>
        <InformationCircleIcon
          className="ml-1 h-6 w-6 cursor-pointer text-gray-400"
          onClick={() => setActiveSlavePanelScreen(REWARD_SUPPLY_3)}
        />
      </div>
      <div className="flex">
        <ButtonDecrement onClick={() => {}} />
        <TextInput
          className="mx-3 w-12 text-center"
          value={multiplier}
          onChange={(e) => setMultiplier(e.target.value)}
        />
        <ButtonIncrement onClick={() => {}} />
        <TextInput
          className="ml-8 "
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
    </div>
  )
}
