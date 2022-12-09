import { InformationCircleIcon } from '@heroicons/react/24/outline'
import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'

import { SlavePanelScreens } from '@/components/stake-pool-creation/SlavePanel'
import { SelectInput } from '@/components/UI/inputs/SelectInput'
import { TextInput } from '@/components/UI/inputs/TextInput'
import { LabelText } from '@/components/UI/typography/LabelText'

const stakeMechanisms = [
  { value: 'receipt', label: 'Receipt' },
  { value: 'original', label: 'Original' },
]

const booleanOptions = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
]

const {
  ADDITIONAL_STAKE_CONDITIONS_1,
  ADDITIONAL_STAKE_CONDITIONS_2,
  ADDITIONAL_STAKE_CONDITIONS_3,
} = SlavePanelScreens

export type AdditionalStakeConditionsProps = {
  setActiveSlavePanelScreen: Dispatch<SetStateAction<SlavePanelScreens>>
}

export const AdditionalStakeConditions = ({
  setActiveSlavePanelScreen,
}: AdditionalStakeConditionsProps) => {
  const [overlayText, setOverlayText] = useState('')
  const [stakeMechanism, setStakeMechanism] = useState(
    stakeMechanisms[0]?.value
  )
  const [resetOnStake, setResetOnStake] = useState(booleanOptions[0]?.value)
  return (
    <>
      <div className="mb-2 flex w-full items-center">
        <LabelText>Stake mechanism</LabelText>
        <InformationCircleIcon
          className="ml-1 h-6 w-6 cursor-pointer text-gray-400"
          onClick={() =>
            setActiveSlavePanelScreen(ADDITIONAL_STAKE_CONDITIONS_1)
          }
        />
      </div>
      <SelectInput
        className="mb-6 w-full"
        value={stakeMechanism || ''}
        setValue={setStakeMechanism}
        options={stakeMechanisms}
      />
      <div className="mb-2 flex w-full items-center">
        <LabelText>Overlay text</LabelText>
        <InformationCircleIcon
          className="ml-1 h-6 w-6 cursor-pointer text-gray-400"
          onClick={() =>
            setActiveSlavePanelScreen(ADDITIONAL_STAKE_CONDITIONS_2)
          }
        />
      </div>
      <TextInput
        className="mb-6"
        value={overlayText}
        onChange={(e) => setOverlayText(e.target.value)}
      />
      <div className="mb-2 flex w-full items-center">
        <LabelText>Reset on stake</LabelText>
        <InformationCircleIcon
          className="ml-1 h-6 w-6 cursor-pointer text-gray-400"
          onClick={() =>
            setActiveSlavePanelScreen(ADDITIONAL_STAKE_CONDITIONS_3)
          }
        />
      </div>
      <SelectInput
        className="mb-6 w-full"
        value={resetOnStake || ''}
        setValue={setResetOnStake}
        options={booleanOptions}
      />
    </>
  )
}
