import type { PublicKey } from '@solana/web3.js'
import { AsyncButton } from 'common/Button'
import { FormFieldTitleInput } from 'common/FormFieldInput'
import { LoadingSpinner } from 'common/LoadingSpinner'
import { SelectorBoolean } from 'common/SelectorBoolean'
import { useFormik } from 'formik'
import { useHandleStakePoolCreate } from 'handlers/useHandleStakePoolCreate'
import { useHandleStakePoolUpdate } from 'handlers/useHandleStakePoolUpdate'
import { useStakePoolData } from 'hooks/useStakePoolData'
import { useStakePoolId } from 'hooks/useStakePoolId'
import { useWalletId } from 'hooks/useWalletId'
import { useEffect } from 'react'
import * as Yup from 'yup'

import { publicKeyValidationTest } from '../stake-pool-creation/Schema'
import { TextInput } from '../UI/inputs/TextInput'
import { TextInputIcon } from '../UI/inputs/TextInputIcon'
import { UnixSecondsInput } from '../UI/inputs/UnixSecondsInput'

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
  endDateSeconds: Yup.number().optional().min(0),
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
    endDateSeconds: stakePoolData?.parsed?.endDate?.toNumber() ?? 0,
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
  const handleStakePoolCreate = useHandleStakePoolCreate()
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
          <TextInputIcon
            placeholder={'CmAy...A3fD'}
            onChange={(e) =>
              setFieldValue('requireCollections[0]', e.target.value)
            }
            error={
              values.requireCollections.at(0) !== '' &&
              !!errors.requireCollections?.at(0)
            }
            value={values.requireCollections[0]}
            icon="Add"
            onIconClick={() =>
              setFieldValue(`requireCollections`, [
                '',
                ...values.requireCollections,
              ])
            }
          />
          {values.requireCollections.map(
            (v, i) =>
              i > 0 && (
                <TextInputIcon
                  key={i}
                  className="mt-3"
                  placeholder={'CmAy...A3fD'}
                  onChange={(e) =>
                    setFieldValue(`requireCollections[${i}]`, e.target.value)
                  }
                  error={
                    values.requireCollections?.at(i) !== '' &&
                    !!errors.requireCollections?.at(i)
                  }
                  value={v}
                  icon="Remove"
                  onIconClick={() =>
                    setFieldValue(
                      `requireCollections`,
                      values.requireCollections.filter((_, ix) => ix !== i)
                    )
                  }
                />
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
          <TextInputIcon
            type="text"
            placeholder={'CmAy...A3fD'}
            name="requireCreators"
            error={
              values.requireCreators[0] !== '' &&
              !!errors.requireCreators?.at(0)
            }
            value={values.requireCreators[0]}
            onChange={(e) =>
              setFieldValue('requireCreators[0]', e.target.value)
            }
            icon="Add"
            onIconClick={() =>
              setFieldValue(`requireCreators`, ['', ...values.requireCreators])
            }
          />
          {values.requireCreators.map(
            (v, i) =>
              i > 0 && (
                <TextInputIcon
                  key={i}
                  className="mt-3"
                  placeholder={'CmAy...A3fD'}
                  error={
                    values.requireCreators.at(i) !== '' &&
                    !!errors.requireCreators?.at(i)
                  }
                  value={v}
                  onChange={(e) =>
                    setFieldValue(`requireCreators[${i}]`, e.target.value)
                  }
                  icon="Remove"
                  onIconClick={() =>
                    setFieldValue(
                      `requireCreators`,
                      values.requireCreators.filter((_, ix) => ix !== i)
                    )
                  }
                />
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
          <SelectorBoolean
            handleChange={(v) => setFieldValue('requiresAuthorization', v)}
          />
        </div>
      </div>
      <div className="my-6 h-[1px] w-full bg-dark-3" />
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
          <UnixSecondsInput
            type="datetime-local"
            placeholder={'None'}
            handleChange={(v) => setFieldValue('endDateSeconds', v)}
            value={values?.endDateSeconds}
          />
        </div>
      </div>
      <div className="flex flex-wrap">
        <div className="w-full">
          <FormFieldTitleInput
            title={'Reset on stake'}
            description={
              'If selected, everytime a user stakes the stake timer will reset rather than accumulate.'
            }
          />
          <SelectorBoolean
            handleChange={(v) => setFieldValue('resetOnStake', v)}
          />
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
