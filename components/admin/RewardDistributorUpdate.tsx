import { tryFormatInput, tryParseInput, tryPublicKey } from '@cardinal/common'
import { AsyncButton } from 'common/Button'
import { FormFieldTitleInput } from 'common/FormFieldInput'
import { LoadingSpinner } from 'common/LoadingSpinner'
import { notify } from 'common/Notification'
import { useFormik } from 'formik'
import { useHandleRewardDistributorCreate } from 'handlers/useHandleRewardDistributorCreate'
import { useHandleRewardDistributorRemove } from 'handlers/useHandleRewardDistributorRemove'
import { useHandleRewardDistributorUpdate } from 'handlers/useHandleRewardDistributorUpdate'
import { useMintInfo } from 'hooks/useMintInfo'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { useStakePoolData } from 'hooks/useStakePoolData'
import { useWalletId } from 'hooks/useWalletId'
import { useEffect } from 'react'
import * as Yup from 'yup'

import {
  bnValidationTest,
  publicKeyValidationTest,
} from '../stake-pool-creation/Schema'
import { TextInput } from '../UI/inputs/TextInput'

const rewardDistributorSchema = Yup.object({
  rewardMintAddress: Yup.string().test(
    'is-public-key',
    'Invalid reward mint address',
    publicKeyValidationTest
  ),
  rewardAmount: Yup.string()
    .optional()
    .test('is-valid-bn', 'Invalid reward amount', bnValidationTest),
  rewardDurationSeconds: Yup.string()
    .optional()
    .test('is-valid-bn', 'Invalid reward durations seconds', bnValidationTest),
  maxRewardSecondsReceived: Yup.string()
    .optional()
    .test('is-valid-bn', 'Invalid repward durations seconds', bnValidationTest),
  multiplierDecimals: Yup.string().optional(),
  defaultMultiplier: Yup.string()
    .optional()
    .test('is-valid-bn', 'Invalid default multiplier', bnValidationTest),
})

const defaultValues = (
  rewardDistributorData: ReturnType<typeof useRewardDistributorData>['data']
): RewardDistributorForm => {
  return {
    rewardMintAddress: rewardDistributorData?.parsed?.rewardMint
      ? rewardDistributorData?.parsed.rewardMint.toString()
      : undefined,
    rewardAmount: rewardDistributorData?.parsed?.rewardAmount
      ? rewardDistributorData?.parsed.rewardAmount.toString()
      : undefined,
    rewardDurationSeconds: rewardDistributorData?.parsed?.rewardDurationSeconds
      ? rewardDistributorData?.parsed.rewardDurationSeconds.toString()
      : undefined,
    maxRewardSecondsReceived: rewardDistributorData?.parsed
      ?.maxRewardSecondsReceived
      ? rewardDistributorData?.parsed.maxRewardSecondsReceived.toString()
      : undefined,
    multiplierDecimals: rewardDistributorData?.parsed?.multiplierDecimals
      ? rewardDistributorData?.parsed.multiplierDecimals.toString()
      : undefined,
    defaultMultiplier: rewardDistributorData?.parsed?.defaultMultiplier
      ? rewardDistributorData?.parsed.defaultMultiplier.toString()
      : undefined,
  }
}

export type RewardDistributorForm = Yup.InferType<
  typeof rewardDistributorSchema
>

export function RewardDistributorUpdate() {
  const walletId = useWalletId()
  const stakePool = useStakePoolData()
  const { data: rewardDistributorData, isFetched } = useRewardDistributorData()
  const handleRewardDistributorUpdate = useHandleRewardDistributorUpdate()
  const handleRewardDistributorCreate = useHandleRewardDistributorCreate()
  const handleRewardDistributorRemove = useHandleRewardDistributorRemove()

  const initialValues = defaultValues(rewardDistributorData)
  const formState = useFormik({
    initialValues,
    onSubmit: () => {},
    validationSchema: rewardDistributorSchema,
  })
  const { values, errors, setFieldValue, setValues } = formState
  useEffect(() => {
    setValues(defaultValues(rewardDistributorData))
  }, [JSON.stringify(rewardDistributorData)])

  const mintInfo = useMintInfo(
    tryPublicKey(values.rewardMintAddress) ?? undefined
  )
  if (!isFetched) return <LoadingSpinner />
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="relative w-full">
        {mintInfo.isLoading ? (
          <div className="absolute right-2 bottom-[22px]">
            <LoadingSpinner height="25px" />
          </div>
        ) : (
          ''
        )}
        <FormFieldTitleInput
          title={'Reward Mint Address'}
          description={'The mint address of the reward token'}
        />
        <TextInput
          disabled={rewardDistributorData !== undefined}
          hasError={
            !!values.rewardMintAddress &&
            values.rewardMintAddress !== '' &&
            !!errors.rewardMintAddress
          }
          placeholder={'Enter mint address first: So1111..11112'}
          value={values.rewardMintAddress}
          onChange={(e) => {
            setFieldValue('rewardMintAddress', e.target.value)
          }}
        />
      </div>
      <div className="">
        <FormFieldTitleInput
          title={'Reward Amount'}
          description={`Amount of tokens to be distributed per duration staked. Accumulates per natural amount of staked tokens.`}
        />
        <TextInput
          disabled={!mintInfo.data}
          hasError={!!errors.rewardAmount}
          placeholder={'0'}
          value={tryFormatInput(
            values.rewardAmount,
            mintInfo.data?.decimals,
            values.rewardAmount ?? ''
          )}
          onChange={(e) => {
            const value = Number(e.target.value)
            if (Number.isNaN(value)) {
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
                mintInfo.data?.decimals,
                values.rewardAmount ?? ''
              )
            )
          }}
        />
      </div>
      <div className="">
        <FormFieldTitleInput
          title={'Reward Duration Seconds'}
          description={
            'Duration in seconds to stake a single natural amount of token to receive the reward amount.'
          }
        />
        <TextInput
          disabled={!mintInfo.data}
          hasError={!!errors.rewardDurationSeconds}
          placeholder={'1'}
          value={values.rewardDurationSeconds}
          onChange={(e) => {
            const seconds = Number(e.target.value)
            if (!seconds && e.target.value.length !== 0) {
              notify({
                message: `Invalid reward duration seconds`,
                type: 'error',
              })
            }
            setFieldValue('rewardDurationSeconds', e.target.value.toString())
          }}
        />
      </div>
      <div className="">
        <FormFieldTitleInput
          title={'Maximum reward seconds'}
          description={
            'The maximum seconds a reward entry can receive rewards for'
          }
        />
        <TextInput
          disabled={!mintInfo.data}
          hasError={
            !!values.maxRewardSecondsReceived &&
            values.maxRewardSecondsReceived !== '' &&
            !!errors.maxRewardSecondsReceived
          }
          placeholder={'None'}
          value={values.maxRewardSecondsReceived}
          onChange={(e) => {
            setFieldValue('maxRewardSecondsReceived', e.target.value)
          }}
        />
      </div>
      <div className="">
        <FormFieldTitleInput
          title={'Multiplier Decimals'}
          description={
            'Decimals of the reward distributor to achieve decimal multipliers.'
          }
        />
        <TextInput
          disabled={!mintInfo.data}
          placeholder={'0'}
          value={values.multiplierDecimals}
          onChange={(e) => {
            const supply = Number(e.target.value.replaceAll(',', ''))
            if (!supply && e.target.value.length !== 0) {
              notify({
                message: `Invalid multiplier decimals`,
                type: 'error',
              })
            }
            setFieldValue('multiplierDecimals', e.target.value.toString())
          }}
        />
      </div>
      <div className="">
        <FormFieldTitleInput
          title={'Default Multiplier'}
          description={
            'Default multiplier to be used to achieve decimal multipliers.'
          }
        />
        <TextInput
          disabled={!mintInfo.data}
          type="text"
          placeholder={'1'}
          value={values.defaultMultiplier}
          onChange={(e) => {
            const supply = Number(e.target.value.replaceAll(',', ''))
            if (!supply && e.target.value.length !== 0) {
              notify({
                message: `Invalid default multiplier`,
                type: 'error',
              })
            }
            setFieldValue('defaultMultiplier', e.target.value.toString())
          }}
        />
      </div>
      <AsyncButton
        disabled={
          !mintInfo.data ||
          (rewardDistributorData
            ? walletId?.toString() !==
              rewardDistributorData?.parsed.authority.toString()
            : walletId?.toString() !==
              stakePool.data?.parsed.authority.toString())
        }
        onClick={async () => {
          rewardDistributorData
            ? handleRewardDistributorUpdate.mutate({ values })
            : handleRewardDistributorCreate.mutate({ values })
        }}
        loading={
          handleRewardDistributorUpdate.isLoading ||
          handleRewardDistributorCreate.isLoading
        }
        inlineLoader
        className="mx-auto mt-4 flex w-full items-center justify-center text-center"
      >
        {rewardDistributorData ? 'Update' : 'Add'}
      </AsyncButton>
      {rewardDistributorData && (
        <>
          <AsyncButton
            disabled={
              !rewardDistributorData ||
              walletId?.toString() !==
                rewardDistributorData?.parsed.authority.toString()
            }
            colorized={false}
            onClick={async () => {
              handleRewardDistributorRemove.mutate()
            }}
            loading={handleRewardDistributorRemove.isLoading}
            inlineLoader
            className="flex w-full items-center justify-center bg-red-500 text-center hover:bg-red-600"
          >
            Remove
          </AsyncButton>
        </>
      )}
    </div>
  )
}
