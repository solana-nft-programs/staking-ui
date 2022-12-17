import type { PublicKey } from '@solana/web3.js'
import { AsyncButton } from 'common/Button'
import { FormFieldTitleInput } from 'common/FormFieldInput'
import { LoadingSpinner } from 'common/LoadingSpinner'
import { useFormik } from 'formik'
import { useHandleStakePoolCreate2 } from 'handlers/useHandleStakePoolCreate2'
import { useHandleStakePoolUpdate } from 'handlers/useHandleStakePoolUpdate'
import { useStakePoolData } from 'hooks/useStakePoolData'
import { useStakePoolId } from 'hooks/useStakePoolId'
import { useWalletId } from 'hooks/useWalletId'
import { useEffect } from 'react'
import * as Yup from 'yup'

import {
  bnValidationTest,
  publicKeyValidationTest,
} from '../stake-pool-creation/Schema'
import { TextInput } from '../UI/inputs/TextInput'

const stakePoolUpdateSchema = Yup.object({
  requireCollections: Yup.array()
    .of(
      Yup.string().test(
        'is-public-key',
        'Invalid collection address',
        publicKeyValidationTest
      )
    )
    .required(),
  requireCreators: Yup.array()
    .of(
      Yup.string().test(
        'is-public-key',
        'Invalid creator address',
        publicKeyValidationTest
      )
    )
    .required(),
  requiresAuthorization: Yup.boolean(),
  resetOnStake: Yup.boolean(),
  cooldownPeriodSeconds: Yup.number().optional().min(0),
  minStakeSeconds: Yup.number().optional().min(0),
  endDate: Yup.string()
    .optional()
    .test('is-valid-bn', 'Invalid endDate', bnValidationTest),
})

const defaultValues = (
  stakePoolData: ReturnType<typeof useStakePoolData>['data']
): StakePoolUpdateForm => {
  return {
    requireCollections: (stakePoolData?.parsed?.allowedCollections ?? []).map(
      (pk) => pk.toString()
    ),
    requireCreators: (stakePoolData?.parsed?.allowedCreators ?? []).map((pk) =>
      pk.toString()
    ),
    requiresAuthorization:
      stakePoolData?.parsed?.requiresAuthorization ?? false,
    resetOnStake: stakePoolData?.parsed?.resetOnUnstake ?? false,
    cooldownPeriodSeconds: stakePoolData?.parsed?.cooldownSeconds ?? 0,
    minStakeSeconds: stakePoolData?.parsed?.minStakeSeconds ?? 0,
    endDate: stakePoolData?.parsed?.endDate
      ? new Date(stakePoolData?.parsed.endDate.toNumber() * 1000)
          .toISOString()
          .split('T')[0]
      : undefined,
  }
}

export type StakePoolUpdateForm = Yup.InferType<typeof stakePoolUpdateSchema>

export function StakePoolUpdate({
  onSuccess,
}: {
  onSuccess?: (p: PublicKey | undefined) => void
}) {
  const walletId = useWalletId()
  const stakePooldId = useStakePoolId()
  const stakePool = useStakePoolData()
  const handleStakePoolUpdate = useHandleStakePoolUpdate()
  const handleStakePoolCreate = useHandleStakePoolCreate2()
  const initialValues = defaultValues(stakePool.data)
  const formState = useFormik({
    initialValues,
    onSubmit: () => {},
    validationSchema: stakePoolUpdateSchema,
  })
  const { values, errors, setValues, setFieldValue } = formState

  useEffect(() => {
    setValues(defaultValues(stakePool.data))
  }, [JSON.stringify(stakePool)])

  if (stakePooldId && !stakePool.isFetched) return <LoadingSpinner />
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-wrap">
        <div className="w-full">
          <FormFieldTitleInput
            title={'Collection Addresses []'}
            description={'Allow any NFTs with these collection addresses'}
          />
          <div
            className={`${
              values.requireCollections[0] !== '' &&
              errors.requireCollections?.at(0)
                ? 'border-red-500'
                : 'border-gray-500'
            } flex appearance-none items-center justify-between rounded border bg-gray-700 py-3 px-4 text-gray-200 placeholder-gray-500 focus:bg-gray-800`}
          >
            <input
              className={`mr-5 w-full bg-transparent focus:outline-none`}
              type="text"
              placeholder={'CmAy...A3fD'}
              name="requireCollections"
              value={values.requireCollections[0]}
              onChange={(e) =>
                setFieldValue('requireCollections[0]', e.target.value)
              }
            />
            <div
              className="cursor-pointer text-xs text-gray-400"
              onClick={() =>
                setFieldValue(`requireCollections`, [
                  '',
                  ...values.requireCollections,
                ])
              }
            >
              Add
            </div>
          </div>
          {values.requireCollections.map(
            (v, i) =>
              i > 0 && (
                <div
                  key={i}
                  className={`${
                    errors.requireCollections?.at(i)
                      ? 'border-red-500'
                      : 'border-gray-500'
                  } mt-3 flex appearance-none items-center justify-between rounded border bg-gray-700 py-3 px-4 text-gray-200 placeholder-gray-500 focus:bg-gray-800`}
                >
                  <input
                    className={`mr-5 w-full bg-transparent focus:outline-none`}
                    type="text"
                    placeholder={'CmAy...A3fD'}
                    name="requireCollections"
                    value={v}
                    onChange={(e) =>
                      setFieldValue(`requireCollections[${i}]`, e.target.value)
                    }
                  />
                  <div
                    className="cursor-pointer text-xs text-gray-400"
                    onClick={() =>
                      setFieldValue(
                        `requireCollections`,
                        values.requireCollections.filter((_, ix) => ix !== i)
                      )
                    }
                  >
                    Remove
                  </div>
                </div>
              )
          )}
        </div>
      </div>
      <div className="flex flex-wrap">
        <div className="w-full">
          <FormFieldTitleInput
            title={'Creator Addresses []'}
            description={'Allow any NFTs with these creator addresses'}
          />
          <div
            className={`${
              values.requireCreators[0] !== '' && errors.requireCreators?.at(0)
                ? 'border-red-500'
                : 'border-gray-500'
            } flex appearance-none items-center justify-between rounded border bg-gray-700 py-3 px-4 text-gray-200 placeholder-gray-500 focus:bg-gray-800`}
          >
            <input
              className={`mr-5 w-full bg-transparent focus:outline-none`}
              type="text"
              placeholder={'CmAy...A3fD'}
              name="requireCreators"
              value={values.requireCreators[0]}
              onChange={(e) =>
                setFieldValue('requireCreators[0]', e.target.value)
              }
            />
            <div
              className="cursor-pointer text-xs text-gray-400"
              onClick={() =>
                setFieldValue(`requireCreators`, [
                  '',
                  ...values.requireCreators,
                ])
              }
            >
              Add
            </div>
          </div>
          {values.requireCreators.map(
            (v, i) =>
              i > 0 && (
                <div
                  key={i}
                  className={`${
                    errors.requireCreators?.at(i)
                      ? 'border-red-500'
                      : 'border-gray-500'
                  } mt-3 flex appearance-none items-center justify-between rounded border bg-gray-700 py-3 px-4 text-gray-200 placeholder-gray-500 focus:bg-gray-800`}
                >
                  <input
                    className={`mr-5 w-full bg-transparent focus:outline-none`}
                    type="text"
                    placeholder={'CmAy...A3fD'}
                    name="requireCreators"
                    value={v}
                    onChange={(e) =>
                      setFieldValue(`requireCreators[${i}]`, e.target.value)
                    }
                  />
                  <div
                    className="cursor-pointer text-xs text-gray-400"
                    onClick={() =>
                      setFieldValue(
                        `requireCreators`,
                        values.requireCreators.filter((_, ix) => ix !== i)
                      )
                    }
                  >
                    Remove
                  </div>
                </div>
              )
          )}
        </div>
      </div>
      <div className="flex flex-wrap">
        <div className="w-full">
          <FormFieldTitleInput
            title={'NFT Mint List'}
            description={
              'If selected, NFTs / specific mints can be arbitrarily authorized to enter the pool'
            }
          />
          <input
            className="cursor-pointer"
            id="require-authorization"
            type="checkbox"
            name="requiresAuthorization"
            checked={values.requiresAuthorization}
            readOnly
          />{' '}
          <span
            className="my-auto cursor-pointer text-sm"
            onClick={() =>
              setFieldValue(
                'requiresAuthorization',
                !values.requiresAuthorization
              )
            }
          >
            Authorize specific mints
          </span>
        </div>
      </div>
      <div className="flex flex-wrap">
        <div className="w-full">
          <FormFieldTitleInput
            title={'Cooldown Period Seconds'}
            description={
              'Number of seconds to "cool down" (unstaked, but still in the pool) once user unstakes a mint'
            }
          />
          <TextInput
            placeholder={'0'}
            value={values.cooldownPeriodSeconds}
            onChange={(e) => {
              setFieldValue('cooldownPeriodSeconds', e.target.value)
            }}
          />
        </div>
      </div>
      <div className="flex flex-wrap">
        <div className="w-full">
          <FormFieldTitleInput
            title={'Minimum Stake Seconds'}
            description={
              'Number of seconds a mint has to stay in the pool once staked before being able to be unstaked'
            }
          />
          <TextInput
            placeholder={'0'}
            value={values.minStakeSeconds}
            onChange={(e) => {
              setFieldValue('minStakeSeconds', e.target.value)
            }}
          />
        </div>
      </div>
      <div className="flex flex-wrap">
        <div className="w-full">
          <FormFieldTitleInput
            title={'Pool End Date'}
            description={
              'End date for pool when staking is disabled but claiming rewards and unstaking is still enabled'
            }
          />
          <TextInput
            type="date"
            placeholder={'None'}
            value={values.endDate}
            onChange={(e) => {
              setFieldValue('endDate', e.target.value)
            }}
          />
        </div>
      </div>
      <div className="flex flex-wrap">
        <div className="">
          <FormFieldTitleInput
            title={'Reset on stake'}
            description={
              'If selected, everytime a user stakes the stake timer will reset rather than accumulate.'
            }
          />
          <input
            className="cursor-pointer"
            id="reset-on-unstake"
            type="checkbox"
            name="resetOnStake"
            checked={values.resetOnStake}
            readOnly
          />{' '}
          <span
            className="my-auto cursor-pointer text-sm"
            onClick={() => setFieldValue('resetOnStake', !values.resetOnStake)}
          >
            Reset on stake
          </span>
        </div>
      </div>
      <AsyncButton
        disabled={
          stakePool.data &&
          walletId?.toString() !== stakePool.data?.parsed.authority.toString()
        }
        onClick={async () => {
          stakePool.data
            ? handleStakePoolUpdate.mutate({ values })
            : handleStakePoolCreate.mutate(
                { values },
                { onSuccess: ([, pk]) => onSuccess && onSuccess(pk) }
              )
        }}
        loading={
          handleStakePoolUpdate.isLoading || handleStakePoolCreate.isLoading
        }
        inlineLoader
        className="mx-auto mt-4 flex w-full items-center justify-center text-center"
      >
        {stakePool.data ? 'Update' : 'Get Started'}
      </AsyncButton>
    </div>
  )
}
