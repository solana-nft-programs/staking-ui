import { findAta, withFindOrInitAssociatedTokenAccount } from '@cardinal/common'
import { createStakePool, executeTransaction } from '@cardinal/staking'
import { RewardDistributorKind } from '@cardinal/staking/dist/cjs/programs/rewardDistributor'
import { withInitRewardDistributor } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/transaction'
import { StakePoolData } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { getStakePool } from '@cardinal/staking/dist/cjs/programs/stakePool/accounts'
import { AccountData } from '@cardinal/token-manager'
import { Wallet } from '@metaplex/js'
import { BN } from '@project-serum/anchor'
import { useWallet } from '@solana/wallet-adapter-react'
import { Keypair, PublicKey, Transaction } from '@solana/web3.js'
import { Header } from 'common/Header'
import { LoadingSpinner } from 'common/LoadingSpinner'
import { notify } from 'common/Notification'
import Head from 'next/head'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { TailSpin } from 'react-loader-spinner'
import * as splToken from '@solana/spl-token'
import { useState } from 'react'
import Select from 'react-select'
import {
  getMintDecimalAmountFromNaturalV2,
  parseMintNaturalAmountFromDecimal,
} from 'common/units'
import { Placeholder, StakePool } from 'pages'
import { pubKeyUrl, shortPubKey } from 'common/utils'
import { FaQuestion } from 'react-icons/fa'
import { useStakePoolsByAuthority } from 'hooks/useStakePoolsByAuthority'
import { useStakePoolsMetadatas } from 'hooks/useStakePoolsMetadata'
import { FormFieldTitleInput } from 'common/FormFieldInput'
import { Footer } from 'common/Footer'
import * as Yup from 'yup'
import { tryPublicKey } from 'common/utils'
import { useFormik } from 'formik'

const publicKeyValidationTest = (value: string | undefined): boolean => {
  return tryPublicKey(value) ? true : false
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
  rewardDistributorKind: Yup.number().optional().min(0).max(2),
  rewardMintAddress: Yup.string().test(
    'is-public-key',
    'Invalid reward mint address',
    publicKeyValidationTest
  ),
  rewardAmount: Yup.number(),
  rewardDurationSeconds: Yup.number(),
  rewardMintSupply: Yup.number(),
})

type CreationForm = Yup.InferType<typeof creationFormSchema>

function Admin() {
  const { connection, environment } = useEnvironmentCtx()
  const wallet = useWallet()
  const initialValues: CreationForm = {
    overlayText: 'STAKED',
    requireCollections: [],
    requireCreators: [],
    requiresAuthorization: false,
    rewardDistributorKind: undefined,
    rewardMintAddress: undefined,
    rewardAmount: undefined,
    rewardDurationSeconds: undefined,
    rewardMintSupply: undefined,
  }
  const formState = useFormik({
    initialValues,
    onSubmit: (values) => {},
    validationSchema: creationFormSchema,
  })
  const { values, errors, setFieldValue, handleChange } = formState
  console.log(JSON.stringify(formState, null, 2))

  const [submitDisabled, setSubmitDisabled] = useState<boolean>(true)
  const [processingMintAddress, setProcessingMintAddress] =
    useState<boolean>(false)
  const [mintInfo, setMintInfo] = useState<splToken.MintInfo>()
  const [maxMintSupply, setMaxMintSupply] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [stakePool, setStakePool] = useState<AccountData<StakePoolData>>()

  const stakePools = useStakePoolsByAuthority()
  const stakePoolsMetadata = useStakePoolsMetadatas(
    stakePools.data?.map((s) => s.pubkey)
  )

  const [stakePoolsWithMetadata, stakePoolsWithoutMetadata] = (
    stakePools.data || []
  ).reduce(
    (acc, stakePoolData) => {
      const stakePoolMetadata = (stakePoolsMetadata.data || {})[
        stakePoolData.pubkey.toString()
      ]
      if (stakePoolMetadata) {
        return [[...acc[0], { stakePoolMetadata, stakePoolData }], acc[1]]
      }
      return [acc[0], [...acc[1], { stakePoolData }]]
    },
    [[] as StakePool[], [] as StakePool[]]
  )

  const handleMintAddress = async (address: String) => {
    if (!wallet?.connected) {
      notify({
        message: `Wallet not connected`,
        type: 'error',
      })
      return
    }
    setSubmitDisabled(true)
    setProcessingMintAddress(true)
    try {
      const mint = new PublicKey(address)
      const checkMint = new splToken.Token(
        connection,
        mint,
        splToken.TOKEN_PROGRAM_ID,
        Keypair.generate() // unused
      )
      let mintInfo = await checkMint.getMintInfo()

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
          message:
            "Failed to get user's associated token address for given mint",
          type: 'error',
        })
      }
      setMintInfo(mintInfo)
      if (userAta) {
        const decimalAmount = getMintDecimalAmountFromNaturalV2(
          mintInfo.decimals,
          new BN(userAta.amount)
        )
        setMaxMintSupply(Number(decimalAmount.toFixed(3)))
      }
      setSubmitDisabled(false)
      setProcessingMintAddress(false)
      notify({ message: `Valid reward mint address`, type: 'success' })
    } catch (e) {
      setMintInfo(undefined)
      setSubmitDisabled(true)
      if (address.length > 0) {
        console.log(e)
        notify({ message: `Invalid reward mint address: ${e}`, type: 'error' })
      }
    } finally {
      setProcessingMintAddress(false)
    }
  }

  const handleCreation = async () => {
    setStakePool(undefined)
    setLoading(true)
    try {
      if (!wallet?.connected) {
        throw 'Wallet not connected'
      }
      if (
        (!values.rewardAmount && values.rewardDurationSeconds) ||
        (values.rewardAmount && !values.rewardDurationSeconds)
      ) {
        throw 'Both reward amount and reward duration must be specified'
      }
      if (
        (values.rewardAmount || values.rewardMintAddress) &&
        !values.rewardDistributorKind
      ) {
        throw 'Reward distribution must be specified (cannot be none)'
      }
      if (
        (values.rewardAmount ||
          values.rewardMintAddress ||
          values.rewardDistributorKind) &&
        (!values.rewardAmount || !values.rewardMintAddress)
      ) {
        throw 'Please fill out all the fields for reward distribution paramters'
      }

      const collectionPublicKeys = values.requireCollections
        .map((c) => tryPublicKey(c))
        .filter((c) => c) as PublicKey[]
      const creatorPublicKeys = values.requireCreators
        .map((c) => tryPublicKey(c))
        .filter((c) => c) as PublicKey[]

      const stakePoolParams = {
        requiresCollections:
          collectionPublicKeys.length > 0 ? collectionPublicKeys : undefined,
        requiresCreators:
          creatorPublicKeys.length > 0 ? creatorPublicKeys : undefined,
        requiresAuthorization: values.requiresAuthorization,
        overlayText: values.overlayText || undefined,
      }
      const [transaction, stakePoolPK] = await createStakePool(
        connection,
        wallet as Wallet,
        stakePoolParams
      )

      if (values.rewardDistributorKind) {
        const rewardDistributorKindParams = {
          stakePoolId: stakePoolPK,
          rewardMintId: new PublicKey(values.rewardMintAddress!.trim())!,
          rewardAmount: values.rewardAmount
            ? new BN(
                parseMintNaturalAmountFromDecimal(
                  values.rewardAmount,
                  mintInfo?.decimals || 1
                )
              )
            : undefined,
          rewardDurationSeconds: values.rewardDurationSeconds
            ? new BN(values.rewardDurationSeconds)
            : undefined,
          kind: values.rewardDistributorKind,
          supply: values.rewardMintSupply
            ? new BN(
                parseMintNaturalAmountFromDecimal(
                  values.rewardMintSupply,
                  mintInfo?.decimals || 1
                )
              )
            : undefined,
        }

        await withInitRewardDistributor(
          transaction,
          connection,
          wallet as Wallet,
          rewardDistributorKindParams
        )
      }

      await executeTransaction(connection, wallet as Wallet, transaction, {
        silent: false,
        signers: [],
      })

      const stakePoolData = await getStakePool(connection, stakePoolPK)
      setStakePool(stakePoolData)
      notify({
        message:
          'Successfully created stake pool with ID: ' +
          stakePoolData.pubkey.toString(),
        type: 'success',
      })
    } catch (e) {
      notify({ message: `Error creating stake pool: ${e}`, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Head>
        <title>Cardinal Staking UI</title>
        <meta name="description" content="Generated by Cardinal Staking UI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <div className="container mx-auto w-full bg-[#1a1b20]">
        <div className="mx-10 my-2 grid h-full grid-cols-2 gap-4 rounded-md bg-white bg-opacity-5 p-10 text-gray-200">
          <div>
            <p className="text-lg font-bold">Create Staking Pool</p>
            <p className="mt-1 mb-2 text-sm">
              All parameters for staking pool are optional
            </p>
            {stakePool && (
              <div className="rounded-lg bg-green-600 bg-opacity-20 p-4">
                <p className="font-bold">Successfully created Stake Pool.</p>
                <p>
                  Make sure you <b>SAVE THE POOL ID</b> and identifier
                </p>
                <p className="mt-2">
                  <b>Pool ID:</b> {stakePool.pubkey.toString()} <br />{' '}
                  <b>Identifier:</b> {stakePool.parsed.identifier.toString()}
                </p>
              </div>
            )}
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
                    description={
                      'Allow any NFTs with these collection addresses'
                    }
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
                              setFieldValue(
                                `requireCollections[${i}]`,
                                e.target.value
                              )
                            }
                          />
                          <div
                            className="cursor-pointer text-xs text-gray-400"
                            onClick={() =>
                              setFieldValue(
                                `requireCollections`,
                                values.requireCollections.filter(
                                  (_, ix) => ix !== i
                                )
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
                      values.requireCreators[0] !== '' &&
                      errors.requireCreators?.at(0)
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
                              setFieldValue(
                                `requireCreators[${i}]`,
                                e.target.value
                              )
                            }
                          />
                          <div
                            className="cursor-pointer text-xs text-gray-400"
                            onClick={() =>
                              setFieldValue(
                                `requireCreators`,
                                values.requireCreators.filter(
                                  (_, ix) => ix !== i
                                )
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
                    If selected, NFTs / specific mints can be arbitrarily
                    authorized to enter the pool
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
                      className="mb-3"
                      isSearchable={false}
                      onChange={(option) =>
                        setFieldValue(
                          'rewardDistributorKind',
                          option?.value
                            ? parseInt(option?.value) || undefined
                            : undefined
                        )
                      }
                      defaultValue={{ label: 'None', value: '0' }}
                      options={[
                        { value: '0', label: 'None' },
                        { value: '1', label: 'Mint' },
                        { value: '2', label: 'Transfer' },
                      ]}
                    />
                  </div>
                  {values.rewardDistributorKind && (
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

                        <input
                          className={`${
                            values.rewardMintAddress !== '' &&
                            errors.rewardMintAddress
                              ? 'border-red-500'
                              : 'border-gray-500'
                          } mb-3 block w-full appearance-none rounded border border-gray-500 bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800 focus:outline-none`}
                          type="text"
                          placeholder={
                            'Enter Mint Address First: So1111..11112'
                          }
                          value={values.rewardMintAddress}
                          onChange={(e) => {
                            setFieldValue('rewardMintAddress', e.target.value)
                            handleMintAddress(e.target.value)
                          }}
                        />
                      </div>
                      {mintInfo && (
                        <>
                          <div className="mb-6 mt-4 w-1/2 px-3 md:mb-0">
                            <FormFieldTitleInput
                              title={'Reward Amount'}
                              description={
                                'Amount of token to be paid to the staked NFT'
                              }
                            />
                            <input
                              className={`${
                                errors.rewardAmount
                                  ? 'border-red-500'
                                  : 'border-gray-500'
                              } mb-3 block w-full appearance-none rounded border border-gray-500 bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800 focus:outline-none`}
                              type="text"
                              placeholder={'10'}
                              value={values.rewardAmount}
                              disabled={submitDisabled}
                              onChange={(e) => {
                                const amount = Number(e.target.value)
                                if (!amount && e.target.value.length != 0) {
                                  notify({
                                    message: `Invalid reward amount`,
                                    type: 'error',
                                  })
                                }
                                setFieldValue('rewardAmount', e.target.value)
                              }}
                            />
                          </div>
                          <div className="mb-6 mt-4 w-1/2 px-3 md:mb-0">
                            <FormFieldTitleInput
                              title={'Reward Duration Seconds'}
                              description={
                                'Staked duration needed to receive reward amount'
                              }
                            />
                            <input
                              className={`${
                                errors.rewardDurationSeconds
                                  ? 'border-red-500'
                                  : 'border-gray-500'
                              } mb-3 block w-full appearance-none rounded border border-gray-500 bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800 focus:outline-none`}
                              type="text"
                              placeholder={'60'}
                              value={values.rewardDurationSeconds}
                              disabled={submitDisabled}
                              onChange={(e) => {
                                const seconds = Number(e.target.value)
                                if (!seconds && e.target.value.length != 0) {
                                  notify({
                                    message: `Invalid reward duration seconds`,
                                    type: 'error',
                                  })
                                }
                                setFieldValue(
                                  'rewardDurationSeconds',
                                  e.target.value
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
                                RewardDistributorKind.Treasury
                                  ? 'Max number of tokens to mint (max: mint supply).'
                                  : 'How many tokens to transfer to the stake pool for future distribution (max: your asscociated token account balance).'
                              }
                            />
                            <div
                              className={`${
                                errors.rewardMintSupply
                                  ? 'border-red-500'
                                  : 'border-gray-500'
                              } mb-3 flex appearance-none justify-between rounded border border-gray-500 bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800`}
                            >
                              <input
                                className={`mr-5 w-full bg-transparent focus:outline-none`}
                                disabled={submitDisabled}
                                type="text"
                                placeholder={'1000000'}
                                value={
                                  values.rewardMintSupply
                                    ? values.rewardMintSupply
                                        .toString()
                                        .replaceAll(',', '')
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                    : undefined
                                }
                                onChange={(e) => {
                                  const supply = Number(
                                    e.target.value.replaceAll(',', '')
                                  )
                                  if (!supply && e.target.value.length != 0) {
                                    notify({
                                      message: `Invalid reward mint supply`,
                                      type: 'error',
                                    })
                                  }
                                  setFieldValue('rewardMintSupply', supply)
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
                                      mintInfo.supply.toNumber()
                                    )
                                  } else {
                                    setFieldValue(
                                      'rewardMintSupply',
                                      maxMintSupply
                                    )
                                  }
                                }}
                              >
                                Max
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
              <button
                disabled={Boolean(
                  values.rewardDistributorKind && submitDisabled
                )}
                type="button"
                className={
                  submitDisabled && values.rewardDistributorKind
                    ? 'mt-4 inline-block rounded-md bg-blue-700 px-4 py-2 opacity-50'
                    : 'mt-4 inline-block rounded-md bg-blue-700 px-4 py-2'
                }
                onClick={() => handleCreation()}
              >
                <div className="flex">
                  {loading && (
                    <div className="mr-2">
                      <TailSpin color="#fff" height={20} width={20} />
                    </div>
                  )}
                  Create Pool
                </div>
              </button>
            </form>
          </div>
          <div>
            <div className="mb-5 text-lg font-bold">Your pools</div>
            <div className="grid grid-cols-3 gap-5">
              {!stakePools.loaded && !stakePoolsMetadata.loaded ? (
                <>
                  <Placeholder />
                  <Placeholder />
                </>
              ) : stakePoolsWithMetadata.length > 0 ||
                stakePoolsWithoutMetadata.length > 0 ? (
                stakePoolsWithMetadata
                  .concat(stakePoolsWithoutMetadata)
                  .map((stakePool) => (
                    <div
                      className="h-[300px] cursor-pointer rounded-lg bg-white bg-opacity-5 p-10 transition-all duration-100 hover:scale-[1.01]"
                      onClick={() => {
                        window.open(
                          `/admin/${
                            stakePool.stakePoolMetadata?.name ||
                            stakePool.stakePoolData.pubkey.toString()
                          }${
                            environment.label !== 'mainnet'
                              ? `?cluster=${environment.label}`
                              : ''
                          }`,
                          '_blank',
                          'noopener,noreferrer'
                        )
                      }}
                    >
                      {stakePool.stakePoolMetadata?.displayName ? (
                        <div className="text-center font-bold">
                          {stakePool.stakePoolMetadata?.displayName}
                        </div>
                      ) : (
                        <div className="text-center font-bold text-white">
                          <a
                            className="text-white"
                            target="_blank"
                            rel="noreferrer"
                            href={pubKeyUrl(
                              stakePool.stakePoolData.pubkey,
                              environment.label
                            )}
                          >
                            {shortPubKey(stakePool.stakePoolData.pubkey)}
                          </a>
                        </div>
                      )}
                      <div className="text-gray text-center">
                        <a
                          className="text-xs text-gray-500"
                          target="_blank"
                          rel="noreferrer"
                          href={pubKeyUrl(
                            stakePool.stakePoolData.pubkey,
                            environment.label
                          )}
                        >
                          {shortPubKey(stakePool.stakePoolData.pubkey)}
                        </a>
                      </div>
                      {stakePool.stakePoolMetadata?.imageUrl ? (
                        <img
                          className="mx-auto mt-5 h-[150px] w-[150px] rounded-md"
                          src={stakePool.stakePoolMetadata.imageUrl}
                          alt={stakePool.stakePoolMetadata.name}
                        />
                      ) : (
                        <div className="flex justify-center align-middle">
                          <div className="mt-5 flex h-[150px] w-[150px] items-center justify-center rounded-full bg-white bg-opacity-5 text-5xl text-white text-opacity-40">
                            {/* {shortPubKey(stakePool.stakePoolData.pubkey)} */}
                            <FaQuestion />
                          </div>
                        </div>
                      )}
                    </div>
                  ))
              ) : (
                <div>
                  {wallet
                    ? 'Connect your wallet to fetch pools.'
                    : 'No pools found...'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Admin

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
