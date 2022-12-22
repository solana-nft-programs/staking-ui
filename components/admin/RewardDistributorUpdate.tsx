import { tryPublicKey } from '@cardinal/common'
import { AsyncButton } from 'common/Button'
import { FormFieldTitleInput } from 'common/FormFieldInput'
import { LoadingSpinner } from 'common/LoadingSpinner'
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
  optionalBnValidationTest,
  publicKeyValidationTest,
} from '../stake-pool-creation/Schema'
import { BNInput } from '../UI/inputs/BNInput'
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
    .test(
      'is-valid-bn',
      'Invalid repward durations seconds',
      optionalBnValidationTest
    ),
  multiplierDecimals: Yup.string()
    .optional()
    .test(
      'is-valid-bn',
      'Invalid default multiplier',
      optionalBnValidationTest
    ),
  defaultMultiplier: Yup.string()
    .optional()
    .test(
      'is-valid-bn',
      'Invalid default multiplier',
      optionalBnValidationTest
    ),
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
        <BNInput
          disabled={!mintInfo.data}
          hasError={!!errors.rewardAmount}
          placeholder={'0'}
          value={values.rewardAmount}
          decimals={mintInfo.data?.decimals}
          handleChange={(v) => setFieldValue('rewardAmount', v)}
        />
      </div>
      <div className="">
        <FormFieldTitleInput
          title={'Reward Duration Seconds'}
          description={
            'Duration in seconds to stake a single natural amount of token to receive the reward amount.'
          }
        />
        <BNInput
          disabled={!mintInfo.data}
          hasError={!!errors.rewardDurationSeconds}
          placeholder={'1'}
          value={values.rewardDurationSeconds}
          decimals={0}
          handleChange={(v) => setFieldValue('rewardDurationSeconds', v)}
        />
      </div>
      <div className="">
        <FormFieldTitleInput
          title={'Maximum reward seconds'}
          description={
            'The maximum seconds a reward entry can receive rewards for'
          }
        />
        <BNInput
          disabled={!mintInfo.data}
          hasError={!!errors.maxRewardSecondsReceived}
          placeholder={'None'}
          value={values.maxRewardSecondsReceived}
          decimals={0}
          handleChange={(v) => setFieldValue('maxRewardSecondsReceived', v)}
        />
      </div>
      <div className="">
        <FormFieldTitleInput
          title={'Multiplier Decimals'}
          description={
            'Decimals of the reward distributor to achieve decimal multipliers.'
          }
        />
        <BNInput
          disabled={!mintInfo.data}
          hasError={!!errors.multiplierDecimals}
          placeholder={'0'}
          value={values.multiplierDecimals}
          decimals={0}
          handleChange={(v) => setFieldValue('multiplierDecimals', v)}
        />
      </div>
      <div className="">
        <FormFieldTitleInput
          title={'Default Multiplier'}
          description={
            'Default multiplier to be used to achieve decimal multipliers.'
          }
        />
        <BNInput
          disabled={!mintInfo.data}
          hasError={!!errors.defaultMultiplier}
          placeholder={'1'}
          value={values.defaultMultiplier}
          decimals={0}
          handleChange={(v) => setFieldValue('defaultMultiplier', v)}
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
