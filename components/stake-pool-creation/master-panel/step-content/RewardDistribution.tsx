import { InformationCircleIcon } from '@heroicons/react/24/outline'
import type { FormikHandlers, FormikState, FormikValues } from 'formik'
import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'

import { SlavePanelScreens } from '@/components/stake-pool-creation/SlavePanel'
import { RadioGroup } from '@/components/UI/inputs/RadioGroup'
import { TextInput } from '@/components/UI/inputs/TextInput'
import { LabelText } from '@/components/UI/typography/LabelText'

export enum RewardDistributionKind {
  MINT = '1',
  TRANSFER = '2',
}

const options = Object.keys(RewardDistributionKind).map((value) => ({
  label: value,
  value: RewardDistributionKind[value as keyof typeof RewardDistributionKind],
}))

export type RewardDistributionProps = {
  setActiveSlavePanelScreen: Dispatch<SetStateAction<SlavePanelScreens>>
  formState: FormikHandlers & FormikState<FormikValues> & FormikValues
}

export const RewardDistribution = ({
  setActiveSlavePanelScreen,
  formState,
}: RewardDistributionProps) => {
  const {
    REWARD_DISTRIBUTION_1,
    REWARD_DISTRIBUTION_2,
    REWARD_DISTRIBUTION_3,
  } = SlavePanelScreens

  const [mintAddress, setMintAddress] = useState('')
  const [transferAmount, setTransferAmount] = useState('')

  const { setFieldValue, values } = formState

  return (
    <>
      <div className="pb-6">
        <div className="mb-2 flex w-full items-center">
          <LabelText>How will the rewards be distributed to stakers?</LabelText>
          <InformationCircleIcon
            className="ml-1 h-6 w-6 cursor-pointer text-gray-400"
            onClick={() => setActiveSlavePanelScreen(REWARD_DISTRIBUTION_1)}
          />
        </div>
        <RadioGroup
          options={options}
          selected={
            options.find(
              ({ value }) => value === values.rewardDistributorKind?.toString()
            ) || options[0]
          }
          onChange={(option) =>
            setFieldValue(
              'rewardDistributorKind',
              option?.value ? parseInt(option?.value) : undefined
            )
          }
        />
      </div>
      <div className="pb-6">
        <div className="mb-2 flex w-full items-center">
          <LabelText>Rewards mint address</LabelText>
          <InformationCircleIcon
            className="ml-1 h-6 w-6 cursor-pointer text-gray-400"
            onClick={() => setActiveSlavePanelScreen(REWARD_DISTRIBUTION_2)}
          />
        </div>
        <TextInput
          value={mintAddress}
          onChange={(e) => setMintAddress(e.target.value)}
        />
      </div>
      <div className="mb-2 flex w-full items-center">
        <LabelText>Reward transfer amount</LabelText>
        <InformationCircleIcon
          className="ml-1 h-6 w-6 cursor-pointer text-gray-400"
          onClick={() => setActiveSlavePanelScreen(REWARD_DISTRIBUTION_3)}
        />
      </div>
      <div className="relative">
        <TextInput
          value={transferAmount}
          onChange={(e) => setTransferAmount(e.target.value)}
        />
        <button className="absolute top-0 right-0 bottom-0 rounded-lg bg-gray-900 p-2 px-4 text-gray-400">
          Max
        </button>
      </div>
    </>
  )
}
