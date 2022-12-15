import { InformationCircleIcon } from '@heroicons/react/24/outline'
import type * as splToken from '@solana/spl-token'
import { notify } from 'common/Notification'
import { tryFormatInput, tryParseInput } from 'common/units'
import type { FormikHandlers, FormikState, FormikValues } from 'formik'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import type { Dispatch, ReactNode, SetStateAction } from 'react'

import type { FlowType } from '@/components/stake-pool-creation/master-panel/step-content/StepContent'
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
  mintInfo?: splToken.MintInfo
  type: FlowType
}

export const RewardDistribution = ({
  setActiveSlavePanelScreen,
  formState,
  mintInfo,
  type,
}: RewardDistributionProps) => {
  const {
    REWARD_DISTRIBUTION_1,
    REWARD_DISTRIBUTION_2,
    REWARD_DISTRIBUTION_3,
    REWARD_SUPPLY_1,
  } = SlavePanelScreens

  const { setFieldValue, values, errors } = formState
  const rewardDistributor = useRewardDistributorData()

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
          disabled={type === 'update' && rewardDistributor.data !== undefined}
          hasError={
            values.rewardMintAddress !== '' && Boolean(errors.rewardMintAddress)
          }
          value={values.rewardMintAddress}
          onChange={(e) => {
            setFieldValue('rewardMintAddress', e.target.value)
          }}
        />
      </div>
      {mintInfo && (
        <>
          <div className="mb-2 flex w-full items-center">
            <LabelText>Reward transfer amount</LabelText>
            <InformationCircleIcon
              className="ml-1 h-6 w-6 cursor-pointer text-gray-400"
              onClick={() => setActiveSlavePanelScreen(REWARD_DISTRIBUTION_3)}
            />
          </div>
          <div className="relative mb-1">
            <TextInput
              disabled={
                type === 'update' && rewardDistributor?.data !== undefined
              }
              hasError={!!errors?.rewardAmount}
              value={tryFormatInput(
                values.rewardAmount,
                mintInfo.decimals,
                values.rewardAmount ?? ''
              )}
              onChange={(e) => {
                if (Number.isNaN(Number(e.target.value))) {
                  notify({
                    message: `Invalid reward amount`,
                    type: 'error',
                  })
                  return
                }
                setFieldValue(
                  'rewardAmount',
                  tryParseInput(
                    e.target.value,
                    mintInfo.decimals,
                    values.rewardAmount ?? ''
                  )
                )
              }}
            />
          </div>
          {!!errors?.rewardAmount && (
            <div className="text-red-500">
              {errors?.rewardAmount as ReactNode}
            </div>
          )}
        </>
      )}
    </>
  )
}
