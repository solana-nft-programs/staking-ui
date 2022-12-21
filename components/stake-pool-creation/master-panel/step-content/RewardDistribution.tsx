import type { FormikHandlers, FormikState, FormikValues } from 'formik'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import type { Dispatch, SetStateAction } from 'react'
import type { Mint } from 'spl-token-v3'

import type { FlowType } from '@/components/stake-pool-creation/master-panel/step-content/StepContent'
import { SlavePanelScreens } from '@/components/stake-pool-creation/SlavePanel'
import { InfoTipButtons } from '@/components/UI/buttons/InfoTipButtons'
import { BNInput } from '@/components/UI/inputs/BNInput'
import { DurationInput } from '@/components/UI/inputs/DurationInput'
import { TextInput } from '@/components/UI/inputs/TextInput'
import { BodyCopy } from '@/components/UI/typography/BodyCopy'
import { LabelText } from '@/components/UI/typography/LabelText'
import { BodyTextSizes } from '@/types/index'

export type RewardDistributionProps = {
  setActiveSlavePanelScreen: Dispatch<SetStateAction<SlavePanelScreens>>
  formState: FormikHandlers & FormikState<FormikValues> & FormikValues
  mintInfo?: Mint
  type: FlowType
  activeSlavePanelScreen: SlavePanelScreens
}

export const RewardDistribution = ({
  setActiveSlavePanelScreen,
  formState,
  mintInfo,
  type,
  activeSlavePanelScreen,
}: RewardDistributionProps) => {
  const {
    REWARD_SUPPLY_1,
    REWARD_SUPPLY_2,
    REWARD_SUPPLY_3,
    REWARD_DISTRIBUTION_2,
    TIME_BASED_PARAMETERS_3,
  } = SlavePanelScreens

  const { setFieldValue, values, errors } = formState
  const rewardDistributor = useRewardDistributorData()

  return (
    <div className="flex flex-col gap-6 pb-16">
      <div>
        <div className="mb-2 flex w-full items-center">
          <LabelText isOptional>Rewards mint address</LabelText>
          <InfoTipButtons
            setActiveScreen={setActiveSlavePanelScreen}
            screen={REWARD_DISTRIBUTION_2}
            activeScreen={activeSlavePanelScreen}
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
        <BodyCopy className="mt-2 italic" textSize={BodyTextSizes.SMALL}>
          Enter a valid SPL token mint address to enable below form fields
        </BodyCopy>
      </div>
      <>
        <div>
          <div className="mb-2 flex w-full items-center">
            <LabelText isOptional>Reward amount per staked token</LabelText>
            <InfoTipButtons
              setActiveScreen={setActiveSlavePanelScreen}
              screen={REWARD_SUPPLY_1}
              activeScreen={activeSlavePanelScreen}
            />
          </div>
          <BNInput
            placeholder="0.000"
            hasError={!!errors.rewardAmount}
            disabled={!mintInfo}
            decimals={mintInfo?.decimals}
            value={values.rewardAmount}
            handleChange={(v) => {
              setFieldValue('rewardAmount', v)
            }}
          />
        </div>
        <div>
          <div className="mb-2 flex w-full items-center">
            <LabelText isOptional>Reward duration seconds</LabelText>
            <InfoTipButtons
              setActiveScreen={setActiveSlavePanelScreen}
              screen={REWARD_SUPPLY_2}
              activeScreen={activeSlavePanelScreen}
            />
          </div>
          <TextInput
            disabled={!mintInfo}
            placeholder="0"
            value={values.rewardDurationSeconds}
            onChange={(e) => {
              setFieldValue('rewardDurationSeconds', e.target.value)
            }}
          />
        </div>
        <div className="flex gap-6">
          <div className="w-1/2">
            <div className="mb-2 flex w-full items-center">
              <LabelText isOptional>Multiplier Decimals</LabelText>
              <InfoTipButtons
                setActiveScreen={setActiveSlavePanelScreen}
                screen={REWARD_SUPPLY_3}
                activeScreen={activeSlavePanelScreen}
              />
            </div>
            <TextInput
              disabled={!mintInfo}
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
              <InfoTipButtons
                setActiveScreen={setActiveSlavePanelScreen}
                screen={REWARD_SUPPLY_3}
                activeScreen={activeSlavePanelScreen}
              />
            </div>
            <TextInput
              disabled={!mintInfo}
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
            <InfoTipButtons
              setActiveScreen={setActiveSlavePanelScreen}
              screen={TIME_BASED_PARAMETERS_3}
              activeScreen={activeSlavePanelScreen}
            />
          </div>
          <DurationInput
            selectorPosition="from-bottom"
            disabled={!mintInfo}
            defaultAmount={values.maxRewardSecondsReceived ?? null}
            defaultOption={'seconds'}
            handleChange={(v) => setFieldValue('maxRewardSecondsReceived', v)}
          />
        </div>
      </>
    </div>
  )
}
