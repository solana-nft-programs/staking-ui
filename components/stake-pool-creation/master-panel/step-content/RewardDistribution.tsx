import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { BN } from 'bn.js'
import { notify } from 'common/Notification'
import {
  formatMintNaturalAmountAsDecimal,
  tryFormatInput,
  tryParseInput,
} from 'common/units'
import type { FormikHandlers, FormikState, FormikValues } from 'formik'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import type { Dispatch, SetStateAction } from 'react'
import type { Mint } from 'spl-token-v3'

import type { FlowType } from '@/components/stake-pool-creation/master-panel/step-content/StepContent'
import { SlavePanelScreens } from '@/components/stake-pool-creation/SlavePanel'
import { DurationInput } from '@/components/UI/inputs/DurationInput'
import { NumberInput } from '@/components/UI/inputs/NumberInput'
import { TextInput } from '@/components/UI/inputs/TextInput'
import { LabelText } from '@/components/UI/typography/LabelText'

export type RewardDistributionProps = {
  setActiveSlavePanelScreen: Dispatch<SetStateAction<SlavePanelScreens>>
  formState: FormikHandlers & FormikState<FormikValues> & FormikValues
  mintInfo?: Mint
  type: FlowType
}

export const RewardDistribution = ({
  setActiveSlavePanelScreen,
  formState,
  mintInfo,
  type,
}: RewardDistributionProps) => {
  const {
    REWARD_SUPPLY_1,
    REWARD_SUPPLY_2,
    REWARD_DISTRIBUTION_2,
    REWARD_DISTRIBUTION_3,
  } = SlavePanelScreens

  const { setFieldValue, values, errors } = formState
  const rewardDistributor = useRewardDistributorData()
  console.log(formState.values)
  return (
    <div className="flex flex-col gap-6 pb-16">
      <div>
        <div className="mb-2 flex w-full items-center">
          <LabelText isOptional>Rewards mint address</LabelText>
          <InformationCircleIcon
            className="ml-1 h-6 w-6 cursor-pointer text-gray-400"
            onClick={() => setActiveSlavePanelScreen(REWARD_DISTRIBUTION_2)}
          />
        </div>
        <TextInput
          disabled={type === 'update' && rewardDistributor.data !== undefined}
          hasError={
            values.rewardMintAddress !== '' && !!errors.rewardMintAddress
          }
          value={values.rewardMintAddress}
          onChange={(e) => {
            setFieldValue('rewardMintAddress', e.target.value)
          }}
        />
      </div>
      <>
        <div>
          <div className="mb-2 flex w-full items-center">
            <LabelText isOptional>Reward amount per staked token</LabelText>
            <InformationCircleIcon
              onClick={() => setActiveSlavePanelScreen(REWARD_SUPPLY_1)}
              className="ml-1 h-6 w-6 cursor-pointer text-gray-400"
            />
          </div>
          <NumberInput
            placeholder="0.000"
            disabled={!mintInfo}
            value={
              mintInfo
                ? formatMintNaturalAmountAsDecimal(
                    mintInfo,
                    new BN(values.rewardAmount.toString())
                  )
                : ''
            }
            onChange={(e) => {
              if (!mintInfo) return
              setFieldValue(
                'rewardAmount',
                tryParseInput(
                  e.target.value,
                  mintInfo.decimals,
                  formatMintNaturalAmountAsDecimal(
                    mintInfo,
                    new BN(values.rewardAmount.toString())
                  ) ?? ''
                )
              )
            }}
          />
        </div>
        <div>
          <div className="mb-2 flex w-full items-center">
            <LabelText isOptional>Reward duration seconds</LabelText>
            <InformationCircleIcon
              onClick={() => setActiveSlavePanelScreen(REWARD_SUPPLY_2)}
              className="ml-1 h-6 w-6 cursor-pointer text-gray-400"
            />
          </div>
          <NumberInput
            placeholder="0"
            value={values.rewardDurationSeconds}
            onChange={(e) => {
              setFieldValue('rewardDurationSeconds', e.target.value)
            }}
          />
        </div>
        <div>
          <div className="mb-2 flex w-full items-center">
            <LabelText isOptional>Reward transfer amount</LabelText>
            <InformationCircleIcon
              className="ml-1 h-6 w-6 cursor-pointer text-gray-400"
              onClick={() => setActiveSlavePanelScreen(REWARD_DISTRIBUTION_3)}
            />
          </div>
          <div className="relative">
            <TextInput
              disabled={
                !mintInfo ||
                (type === 'update' && rewardDistributor?.data !== undefined)
              }
              value={
                mintInfo
                  ? tryFormatInput(
                      values.rewardMintSupply,
                      mintInfo.decimals,
                      values.rewardMintSupply ?? ''
                    )
                  : ''
              }
              onChange={(e) => {
                if (!mintInfo) return
                if (Number.isNaN(Number(e.target.value))) {
                  notify({
                    message: `Invalid transfer amount`,
                    type: 'error',
                  })
                  return
                }
                setFieldValue(
                  'rewardMintSupply',
                  tryParseInput(
                    e.target.value,
                    mintInfo.decimals,
                    values.rewardMintSupply ?? ''
                  )
                )
              }}
            />
          </div>
        </div>
        <div className="flex gap-6">
          <div className="w-1/2">
            <div className="mb-2 flex w-full items-center">
              <LabelText isOptional>Multiplier Decimals</LabelText>
              <InformationCircleIcon
                onClick={() =>
                  setActiveSlavePanelScreen(SlavePanelScreens.REWARD_SUPPLY_3)
                }
                className="ml-1 h-6 w-6 cursor-pointer text-gray-400"
              />
            </div>
            <NumberInput
              className="w-full"
              placeholder="0"
              value={values.multiplierDecimals}
              onChange={(e) => {
                setFieldValue('multiplierDecimals', e.target.value)
              }}
            />
          </div>
          <div className="w-1/2">
            <div className="mb-2 flex w-full items-center">
              <LabelText isOptional>Default Multiplier</LabelText>
              <InformationCircleIcon
                onClick={() =>
                  setActiveSlavePanelScreen(SlavePanelScreens.REWARD_SUPPLY_3)
                }
                className="ml-1 h-6 w-6 cursor-pointer text-gray-400"
              />
            </div>
            <NumberInput
              className="w-full"
              placeholder="1"
              value={values.defaultMultiplier}
              onChange={(e) => {
                setFieldValue('defaultMultiplier', e.target.value)
              }}
            />
          </div>
        </div>
        <div>
          <div className="mb-2 flex w-full items-center">
            <LabelText isOptional>Maximum reward duration</LabelText>
            <InformationCircleIcon
              className="ml-1 h-6 w-6 cursor-pointer text-gray-400"
              onClick={() =>
                setActiveSlavePanelScreen(
                  SlavePanelScreens.TIME_BASED_PARAMETERS_3
                )
              }
            />
          </div>
          <DurationInput
            defaultAmount={values.maxRewardSecondsReceived ?? null}
            defaultOption={'seconds'}
            handleChange={(v) => setFieldValue('maxRewardSecondsReceived', v)}
          />
        </div>
      </>
    </div>
  )
}
