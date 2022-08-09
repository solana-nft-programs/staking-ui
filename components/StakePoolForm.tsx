import {
  AccountData,
  withFindOrInitAssociatedTokenAccount,
} from '@cardinal/common'
import {
  RewardDistributorData,
  RewardDistributorKind,
} from '@cardinal/staking/dist/cjs/programs/rewardDistributor'
import { Wallet } from '@metaplex/js'
import { BN } from '@project-serum/anchor'
import { useWallet } from '@solana/wallet-adapter-react'
import { Keypair, PublicKey, Transaction } from '@solana/web3.js'
import { LoadingSpinner } from 'common/LoadingSpinner'
import { notify } from 'common/Notification'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { TailSpin } from 'react-loader-spinner'
import * as splToken from '@solana/spl-token'
import { useMemo, useState } from 'react'
import Select from 'react-select'
import { FormFieldTitleInput } from 'common/FormFieldInput'
import * as Yup from 'yup'
import { tryPublicKey } from 'common/utils'
import { useFormik } from 'formik'
import { StakePoolData } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { FormInput } from 'common/FormInput'
import { executeTransaction, handleError } from '@cardinal/staking'
import { tryFormatInput, tryParseInput } from 'common/units'

const publicKeyValidationTest = (value: string | undefined): boolean => {
  return tryPublicKey(value) ? true : false
}

export const bnValidationTest = (value: string | undefined): boolean => {
  if (value === undefined) return false
  try {
    new BN(value)
    return true
  } catch (e) {
    const num = Number(value)
    if (0 < num && num < 1) return true
    return false
  }
}

const creationFormSchema = Yup.object({
  overlayText: Yup.string(),
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
  rewardDistributorKind: Yup.number().optional().min(0).max(2),
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
  rewardMintSupply: Yup.string()
    .optional()
    .test('is-valid-bn', 'Invalid reward mint supply', bnValidationTest),
  multiplierDecimals: Yup.string().optional(),
  defaultMultiplier: Yup.string()
    .optional()
    .test('is-valid-bn', 'Invalid default multiplier', bnValidationTest),
})

export type CreationForm = Yup.InferType<typeof creationFormSchema>

export function StakePoolForm({
  type = 'create',
  stakePoolData,
  rewardDistributorData,
  handleSubmit,
}: {
  type?: 'update' | 'create'
  stakePoolData?: AccountData<StakePoolData>
  rewardDistributorData?: AccountData<RewardDistributorData>
  handleSubmit: (
    values: CreationForm,
    rewardMintInfo?: splToken.MintInfo
  ) => void
}) {
  const { connection } = useEnvironmentCtx()
  const wallet = useWallet()
  const initialValues: CreationForm = {
    overlayText: stakePoolData?.parsed.overlayText ?? 'STAKED',
    requireCollections: (stakePoolData?.parsed.requiresCollections ?? []).map(
      (pk) => pk.toString()
    ),
    requireCreators: (stakePoolData?.parsed.requiresCreators ?? []).map((pk) =>
      pk.toString()
    ),
    requiresAuthorization: stakePoolData?.parsed.requiresAuthorization ?? false,
    resetOnStake: stakePoolData?.parsed.resetOnStake ?? false,
    cooldownPeriodSeconds: stakePoolData?.parsed.cooldownSeconds ?? 0,
    minStakeSeconds: stakePoolData?.parsed.minStakeSeconds ?? 0,
    endDate: stakePoolData?.parsed.endDate
      ? new Date(stakePoolData?.parsed.endDate.toNumber() * 1000)
          .toISOString()
          .split('T')[0]
      : undefined,
    rewardDistributorKind: rewardDistributorData?.parsed.kind,
    rewardMintAddress: rewardDistributorData?.parsed.rewardMint
      ? rewardDistributorData?.parsed.rewardMint.toString()
      : undefined,
    rewardAmount: rewardDistributorData?.parsed.rewardAmount
      ? rewardDistributorData?.parsed.rewardAmount.toString()
      : undefined,
    rewardDurationSeconds: rewardDistributorData?.parsed.rewardDurationSeconds
      ? rewardDistributorData?.parsed.rewardDurationSeconds.toString()
      : undefined,
    rewardMintSupply: rewardDistributorData?.parsed.maxSupply
      ? rewardDistributorData?.parsed.maxSupply.toString()
      : undefined,
    multiplierDecimals: rewardDistributorData?.parsed.multiplierDecimals
      ? rewardDistributorData?.parsed.multiplierDecimals.toString()
      : undefined,
    defaultMultiplier: rewardDistributorData?.parsed.defaultMultiplier
      ? rewardDistributorData?.parsed.defaultMultiplier.toString()
      : undefined,
  }
  const formState = useFormik({
    initialValues,
    onSubmit: (values) => {},
    validationSchema: creationFormSchema,
  })
  const { values, errors, setFieldValue, handleChange } = formState

  const [submitDisabled, setSubmitDisabled] = useState<boolean>(true)
  const [processingMintAddress, setProcessingMintAddress] =
    useState<boolean>(false)
  const [mintInfo, setMintInfo] = useState<splToken.MintInfo>()
  const [userRewardAmount, setUserRewardAmount] = useState<string>()
  const [loading, setLoading] = useState<boolean>(false)

  useMemo(async () => {
    if (values.rewardMintAddress) {
      if (!wallet?.connected) {
        notify({
          message: `Wallet not connected`,
          type: 'error',
        })
      }
      setSubmitDisabled(true)
      setProcessingMintAddress(true)
      try {
        const mint = new PublicKey(values.rewardMintAddress)
        const checkMint = new splToken.Token(
          connection,
          mint,
          splToken.TOKEN_PROGRAM_ID,
          Keypair.generate() // unused
        )
        let mintInfo = await checkMint.getMintInfo()
        setMintInfo(mintInfo)
        if (
          type === 'update' &&
          values.rewardMintAddress?.toString() ===
            rewardDistributorData?.parsed.rewardMint.toString()
        ) {
          return
        }

        let userAta: splToken.AccountInfo | undefined = undefined
        try {
          const transaction = new Transaction()
          const mintAta = await withFindOrInitAssociatedTokenAccount(
            transaction,
            connection,
            mint,
            wallet.publicKey!,
            wallet.publicKey!,
            true
          )
          if (transaction.instructions.length > 0) {
            await executeTransaction(
              connection,
              wallet as Wallet,
              transaction,
              {}
            )
          }
          userAta = await checkMint.getAccountInfo(mintAta)
        } catch (e) {
          notify({
            message: handleError(
              e,
              `Failed to get user's associated token address for given mint: ${e}`
            ),
            type: 'error',
          })
        }
        if (userAta) {
          setUserRewardAmount(userAta.amount.toString())
        }
        setSubmitDisabled(false)
        setProcessingMintAddress(false)
        notify({ message: `Valid reward mint address`, type: 'success' })
      } catch (e) {
        setMintInfo(undefined)
        setSubmitDisabled(true)
        if (values.rewardMintAddress.length > 0) {
          console.log(e)
          notify({
            message: `Invalid reward mint address: ${e}`,
            type: 'error',
          })
        }
      } finally {
        setProcessingMintAddress(false)
      }
    }
  }, [values.rewardMintAddress?.toString()])

  return (
    <form className="w-full max-w-lg">
      <div className="-mx-3 flex flex-wrap">
        <div className="mb-6 mt-4 w-full px-3 md:mb-0">
          <FormFieldTitleInput
            title={'Overlay Text'}
            description={'Text to display over the receipt'}
          />
          <input
            className="mb-3 block w-full appearance-none rounded border border-gray-500 bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800 focus:outline-none"
            type="text"
            placeholder={'STAKED'}
            name="overlayText"
            value={values.overlayText}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="-mx-3 flex flex-wrap">
        <div className="mb-6 mt-4 w-full px-3 md:mb-0">
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
            } mb-3 flex appearance-none justify-between rounded border bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800`}
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
                  className={`${
                    errors.requireCollections?.at(i)
                      ? 'border-red-500'
                      : 'border-gray-500'
                  } mb-3 flex appearance-none justify-between rounded border bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800`}
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
      <div className="-mx-3 flex flex-wrap">
        <div className="mb-6 mt-4 w-full px-3 md:mb-0">
          <FormFieldTitleInput
            title={'Creator Addresses []'}
            description={'Allow any NFTs with these creator addresses'}
          />

          <div
            className={`${
              values.requireCreators[0] !== '' && errors.requireCreators?.at(0)
                ? 'border-red-500'
                : 'border-gray-500'
            } mb-3 flex appearance-none justify-between rounded border bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800`}
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
                  className={`${
                    errors.requireCreators?.at(i)
                      ? 'border-red-500'
                      : 'border-gray-500'
                  } mb-3 flex appearance-none justify-between rounded border bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800`}
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
      <div className="-mx-3 flex flex-wrap">
        <div className="mb-6 mt-4 w-full px-3 md:mb-0">
          <label
            className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-200"
            htmlFor="require-authorization"
          >
            Authorize NFTs
          </label>
          <p className="mb-2 text-sm italic text-gray-300">
            If selected, NFTs / specific mints can be arbitrarily authorized to
            enter the pool
          </p>
          <input
            className="mb-3 cursor-pointer"
            id="require-authorization"
            type="checkbox"
            name="requiresAuthorization"
            checked={values.requiresAuthorization}
            onChange={handleChange}
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
            Require Authorization
          </span>
        </div>
      </div>
      <div className="-mx-3 flex flex-wrap">
        <div className="mb-6 mt-4 w-full px-3 md:mb-0">
          <FormFieldTitleInput
            title={'Cooldown Period Seconds'}
            description={
              'Number of seconds to "cool down" (unstaked, but still in the pool) once user unstakes a mint'
            }
          />
          <input
            className="mb-3 block w-full appearance-none rounded border border-gray-500 bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800 focus:outline-none"
            type="text"
            placeholder={'0'}
            name="cooldownPeriodSeconds"
            value={values.cooldownPeriodSeconds}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="-mx-3 flex flex-wrap">
        <div className="mb-6 mt-4 w-full px-3 md:mb-0">
          <FormFieldTitleInput
            title={'Minimum Stake Seconds'}
            description={
              'Number of seconds a mint has to stay in the pool once staked before being able to be unstaked'
            }
          />
          <input
            className="mb-3 block w-full appearance-none rounded border border-gray-500 bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800 focus:outline-none"
            type="text"
            placeholder={'0'}
            name="minStakeSeconds"
            value={values.minStakeSeconds}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="-mx-3 flex flex-wrap">
        <div className="mb-6 mt-4 w-full px-3 md:mb-0">
          <FormFieldTitleInput
            title={'Pool End Date'}
            description={
              'End date for pool when staking is disabled but claiming rewards and unstaking is still enabled'
            }
          />
          <input
            className="mb-3 block w-full appearance-none rounded border border-gray-500 bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800 focus:outline-none"
            type="date"
            placeholder={'None'}
            name="endDate"
            value={values.endDate}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="-mx-3 flex flex-wrap">
        <div className="mb-6 mt-4 w-full px-3 md:mb-0">
          <label
            className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-200"
            htmlFor="require-authorization"
          >
            Reset on stake
          </label>
          <p className="mb-2 text-sm italic text-gray-300">
            If selected, everytime a user stakes the stake timer will reset
            rather than accumulate.
          </p>
          <input
            className="mb-3 cursor-pointer"
            id="reset-on-unstake"
            type="checkbox"
            name="resetOnStake"
            checked={values.resetOnStake}
            onChange={handleChange}
          />{' '}
          <span
            className="my-auto cursor-pointer text-sm"
            onClick={() => setFieldValue('resetOnStake', !values.resetOnStake)}
          >
            Reset on stake
          </span>
        </div>
      </div>
      <div>
        <div className="-mx-3 mt-5 flex flex-wrap rounded-md bg-white bg-opacity-5 pb-2">
          <div className="mb-6 mt-4 w-full px-3 md:mb-0">
            <FormFieldTitleInput
              title={'Reward Distribution'}
              description={
                'Mint tokens from the mint address or transfer tokens to the stake pool.'
              }
            />
            <Select
              styles={customStyles}
              className={`mb-3`}
              isSearchable={false}
              onChange={(option) =>
                setFieldValue(
                  'rewardDistributorKind',
                  option?.value ? parseInt(option?.value) : undefined
                )
              }
              value={{
                value: values.rewardDistributorKind?.toString() ?? '0',
                label: values.rewardDistributorKind
                  ? RewardDistributorKind[values.rewardDistributorKind] ===
                    'Mint'
                    ? 'Mint'
                    : 'Transfer'
                  : 'None',
              }}
              options={
                type === 'update' && rewardDistributorData
                  ? [
                      { value: '0', label: 'None' },
                      {
                        value:
                          RewardDistributorKind[
                            rewardDistributorData?.parsed.kind
                          ] === 'Mint'
                            ? '1'
                            : '2',
                        label:
                          RewardDistributorKind[
                            rewardDistributorData?.parsed.kind
                          ] === 'Mint'
                            ? 'Mint'
                            : 'Transfer',
                      },
                    ]
                  : [
                      { value: '0', label: 'None' },
                      { value: '1', label: 'Mint' },
                      { value: '2', label: 'Transfer' },
                    ]
              }
            />
          </div>
          {values.rewardDistributorKind ||
          (type !== 'update' &&
            values.rewardDistributorKind !==
              rewardDistributorData?.parsed.kind &&
            values.rewardDistributorKind !== 0) ? (
            <>
              <div className="relative mb-6 mt-4 w-full px-3 md:mb-0">
                {processingMintAddress ? (
                  <div className="absolute right-10">
                    <LoadingSpinner height="25px" />
                  </div>
                ) : (
                  ''
                )}
                <FormFieldTitleInput
                  title={'Reward Mint Address'}
                  description={'The mint address of the reward token'}
                />

                <FormInput
                  disabled={
                    type === 'update' && rewardDistributorData !== undefined
                  }
                  error={
                    values.rewardMintAddress !== '' &&
                    Boolean(errors.rewardMintAddress)
                  }
                  className={`mb-3 block w-full appearance-none rounded border border-gray-500 bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800 focus:outline-none`}
                  type="text"
                  placeholder={'Enter Mint Address First: So1111..11112'}
                  value={values.rewardMintAddress}
                  onChange={(e) => {
                    setFieldValue('rewardMintAddress', e.target.value)
                  }}
                />
              </div>
              {mintInfo && (
                <>
                  <div className="mb-6 mt-4 w-1/2 px-3 md:mb-0">
                    <FormFieldTitleInput
                      title={'Reward Amount'}
                      description={`Amount of tokens to be distributed per duration staked. Accumulates per natural amount of staked tokens.`}
                    />
                    <FormInput
                      error={Boolean(errors.rewardAmount)}
                      className={`${
                        errors.rewardAmount
                          ? 'border-red-500'
                          : 'border-gray-500'
                      } mb-3 block w-full appearance-none rounded border border-gray-500 bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800 focus:outline-none`}
                      type="text"
                      placeholder={'10'}
                      value={tryFormatInput(
                        values.rewardAmount,
                        mintInfo.decimals,
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
                            mintInfo.decimals,
                            values.rewardAmount ?? ''
                          )
                        )
                      }}
                    />
                  </div>
                  <div className="mb-6 mt-4 w-1/2 px-3 md:mb-0">
                    <FormFieldTitleInput
                      title={'Reward Duration Seconds'}
                      description={
                        'Duration in seconds to stake a single natural amount of token to receive the reward amount.'
                      }
                    />
                    <FormInput
                      className={`${
                        errors.rewardDurationSeconds
                          ? 'border-red-500'
                          : 'border-gray-500'
                      } mb-3 block w-full appearance-none rounded border border-gray-500 bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800 focus:outline-none`}
                      type="text"
                      placeholder={'60'}
                      value={values.rewardDurationSeconds}
                      onChange={(e) => {
                        const seconds = Number(e.target.value)
                        if (!seconds && e.target.value.length !== 0) {
                          notify({
                            message: `Invalid reward duration seconds`,
                            type: 'error',
                          })
                        }
                        setFieldValue(
                          'rewardDurationSeconds',
                          e.target.value.toString()
                        )
                      }}
                    />
                  </div>

                  <div className="mb-6 mt-4 w-full px-3 md:mb-0">
                    <FormFieldTitleInput
                      title={
                        values.rewardDistributorKind ===
                        RewardDistributorKind.Mint
                          ? 'Reward Max Supply'
                          : 'Reward Transfer Amount'
                      }
                      description={
                        values.rewardDistributorKind ===
                        RewardDistributorKind.Mint
                          ? 'Max number of tokens to mint (max: mint supply).'
                          : 'How many tokens to transfer to the stake pool for future distribution (max: your asscociated token account balance). This can also be 0 and tokens can be transferred in directly via a wallet ui.'
                      }
                    />
                    <div
                      className={`${
                        errors.rewardMintSupply
                          ? 'border-red-500'
                          : 'border-gray-500'
                      } ${
                        submitDisabled ||
                        (type === 'update' &&
                          rewardDistributorData !== undefined)
                          ? 'opacity-30'
                          : ''
                      } mb-3 flex appearance-none justify-between rounded border border-gray-500 bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800`}
                    >
                      <input
                        className={`mr-5 w-full bg-transparent focus:outline-none`}
                        disabled={
                          submitDisabled ||
                          (type === 'update' &&
                            rewardDistributorData !== undefined)
                        }
                        type="text"
                        placeholder={'1000000'}
                        value={tryFormatInput(
                          values.rewardMintSupply,
                          mintInfo.decimals,
                          values.rewardMintSupply ?? ''
                        )}
                        onChange={(e) => {
                          const value = Number(e.target.value)
                          if (Number.isNaN(value)) {
                            notify({
                              message: `Invalid reward mint supply`,
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
                      <div
                        className="cursor-pointer"
                        onClick={() => {
                          if (
                            values.rewardDistributorKind ===
                            RewardDistributorKind.Mint
                          ) {
                            setFieldValue(
                              'rewardMintSupply',
                              mintInfo.supply.toString()
                            )
                          } else {
                            setFieldValue('rewardMintSupply', userRewardAmount)
                          }
                        }}
                      >
                        Max
                      </div>
                    </div>
                  </div>
                  <div className="mb-6 mt-4 w-1/2 px-3 md:mb-0">
                    <FormFieldTitleInput
                      title={'Multiplier Decimals'}
                      description={
                        'Decimals of the reward distributor to achieve decimal multipliers.'
                      }
                    />
                    <FormInput
                      className={`mb-3 block w-full appearance-none rounded border border-gray-500 bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800 focus:outline-none`}
                      type="text"
                      placeholder={'0'}
                      value={values.multiplierDecimals}
                      onChange={(e) => {
                        const supply = Number(
                          e.target.value.replaceAll(',', '')
                        )
                        if (!supply && e.target.value.length != 0) {
                          notify({
                            message: `Invalid multiplier decimals`,
                            type: 'error',
                          })
                        }
                        setFieldValue(
                          'multiplierDecimals',
                          e.target.value.toString()
                        )
                      }}
                    />
                  </div>
                  <div className="mb-6 mt-4 w-1/2 px-3 md:mb-0">
                    <FormFieldTitleInput
                      title={'Default Multiplier'}
                      description={
                        'Default multiplier to be used to achieve decimal multipliers.'
                      }
                    />{' '}
                    <FormInput
                      className={`mb-3 block w-full appearance-none rounded border border-gray-500 bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800 focus:outline-none`}
                      type="text"
                      placeholder={'1'}
                      value={values.defaultMultiplier}
                      onChange={(e) => {
                        const supply = Number(
                          e.target.value.replaceAll(',', '')
                        )
                        if (!supply && e.target.value.length != 0) {
                          notify({
                            message: `Invalid default multiplier`,
                            type: 'error',
                          })
                        }
                        setFieldValue(
                          'defaultMultiplier',
                          e.target.value.toString()
                        )
                      }}
                    />
                  </div>
                </>
              )}
            </>
          ) : (
            ''
          )}
        </div>
      </div>
      <button
        disabled={Boolean(
          values.rewardDistributorKind && submitDisabled && type !== 'update'
        )}
        type="button"
        onClick={async () => {
          try {
            setLoading(true)
            await handleSubmit(values, mintInfo)
          } finally {
            setLoading(false)
          }
        }}
      >
        <div
          className={`mt-4 inline-block rounded-md bg-blue-700 px-4 py-2 ${
            submitDisabled && values.rewardDistributorKind && type !== 'update'
              ? 'opacity-50'
              : ''
          }`}
        >
          {loading && (
            <div className="mr-2 inline-block">
              <TailSpin color="#fff" height={15} width={15} />
            </div>
          )}
          {type.charAt(0).toUpperCase() + type.slice(1)} Pool
        </div>
      </button>
    </form>
  )
}

export const customStyles = {
  control: (base: {}) => ({
    ...base,
    background: 'rgb(55, 65, 81)',
    borderColor: 'rgb(107, 114, 128)',
  }),
  Input: (base: {}) => ({
    ...base,
    color: 'white',
  }),
  menu: (base: {}) => ({
    ...base,
    background: 'rgb(55, 65, 81)',
    '&:hover': {
      background: 'rgb(55, 65, 81)',
    },
    '&:focus': {
      background: 'rgb(75, 85, 99) !important',
    },
    borderRadius: 0,
    marginTop: 0,
  }),
  option: (base: {}) => ({
    ...base,
    background: 'rgb(55, 65, 81)',
    '&:hover': {
      background: 'rgb(75, 85, 99)',
    },
    '&:focus': {
      background: 'rgb(75, 85, 99) !important',
    },
  }),
  singleValue: (provided: {}) => ({
    ...provided,
    color: 'white',
  }),
}
