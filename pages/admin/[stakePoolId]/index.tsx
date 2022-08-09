import { findAta, tryGetAccount } from '@cardinal/common'
import { executeTransaction, handleError } from '@cardinal/staking'
import {
  getRewardDistributor,
  getRewardEntry,
} from '@cardinal/staking/dist/cjs/programs/rewardDistributor/accounts'
import {
  findRewardDistributorId,
  findRewardEntryId,
} from '@cardinal/staking/dist/cjs/programs/rewardDistributor/pda'
import {
  withCloseRewardDistributor,
  withInitRewardDistributor,
  withReclaimFunds,
  withUpdateRewardDistributor,
  withUpdateRewardEntry,
} from '@cardinal/staking/dist/cjs/programs/rewardDistributor/transaction'
import * as splToken from '@solana/spl-token'
import {
  withAuthorizeStakeEntry,
  withUpdateStakePool,
} from '@cardinal/staking/dist/cjs/programs/stakePool/transaction'
import { Wallet } from '@metaplex/js'
import { BN, web3 } from '@project-serum/anchor'
import { useWallet } from '@solana/wallet-adapter-react'
import { Keypair, PublicKey, Transaction } from '@solana/web3.js'
import { Footer } from 'common/Footer'
import { Header } from 'common/Header'
import { notify } from 'common/Notification'
import { ShortPubKeyUrl } from 'common/Pubkeys'
import { useStakePoolData } from 'hooks/useStakePoolData'
import Head from 'next/head'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useMemo, useState } from 'react'
import { TailSpin } from 'react-loader-spinner'
import {
  bnValidationTest,
  CreationForm,
  StakePoolForm,
} from 'components/StakePoolForm'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { pubKeyUrl, shortPubKey, tryPublicKey } from 'common/utils'
import { findStakeEntryIdFromMint } from '@cardinal/staking/dist/cjs/programs/stakePool/utils'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import {
  getMintDecimalAmountFromNatural,
  tryFormatInput,
  tryParseInput,
} from 'common/units'
import { useRewardMintInfo } from 'hooks/useRewardMintInfo'
import { Tooltip } from '@mui/material'
import { RewardDistributorKind } from '@cardinal/staking/dist/cjs/programs/rewardDistributor'

const publicKeyValidationTest = (value: string | undefined): boolean => {
  return tryPublicKey(value) ? true : false
}

const creationFormSchema = Yup.object({
  multipliers: Yup.array().of(
    Yup.string().test(
      'is-public-key',
      'Invalid collection address',
      publicKeyValidationTest
    )
  ),
  multiplierMints: Yup.array().of(
    Yup.string().test(
      'is-public-key',
      'Invalid collection address',
      publicKeyValidationTest
    )
  ),
  reclaimAmount: Yup.string()
    .optional()
    .test('is-valid-bn', 'Invalid reclaim funds amount', bnValidationTest),
})
export type MultipliersForm = Yup.InferType<typeof creationFormSchema>

function AdminStakePool() {
  const wallet = useWallet()
  const { connection, environment } = useEnvironmentCtx()
  const stakePool = useStakePoolData()
  const rewardDistributor = useRewardDistributorData()
  const [mintsToAuthorize, setMintsToAuthorize] = useState<string>('')
  const [loadingLookupMultiplier, setLoadingLookupMultiplier] =
    useState<boolean>(false)
  const [loadingReclaim, setLoadingReclaim] = useState<boolean>(false)
  const [multiplierFound, setMultiplierFound] = useState<string>('')
  const [loadingHandleAuthorizeMints, setLoadingHandleAuthorizeMints] =
    useState<boolean>(false)
  const [loadingHandleMultipliers, setLoadingHandleMultipliers] =
    useState<boolean>(false)
  const rewardMintInfo = useRewardMintInfo()
  const [mintInfo, setMintInfo] = useState<splToken.MintInfo>()

  const initialValues: MultipliersForm = {
    multipliers: [''],
    multiplierMints: [''],
    reclaimAmount: '0',
  }
  const formState = useFormik({
    initialValues,
    onSubmit: (values) => {},
    validationSchema: creationFormSchema,
  })
  const { values, setFieldValue } = formState

  const handleMutliplier = async () => {
    setLoadingHandleMultipliers(true)
    if (!wallet?.connected) {
      throw 'Wallet not connected'
    }
    try {
      if (!stakePool.data?.pubkey) {
        throw 'Stake pool pubkey not found'
      }

      if (!values.multiplierMints) {
        throw 'Invalid multiplier mints'
      }
      if (!values.multipliers) {
        throw 'Invalid multipliers'
      }

      if (values.multipliers.length !== values.multiplierMints.length) {
        notify({
          message: `Error: Multiplier and mints aren't 1:1`,
          type: 'error',
        })
        return
      }

      if (values.multiplierMints.toString() === [''].toString())
        values.multiplierMints = []
      if (values.multipliers.toString() === [''].toString())
        values.multipliers = []
      let pubKeysToSetMultiplier = []
      for (let i = 0; i < values.multiplierMints.length; i++) {
        if (values.multiplierMints[i] !== '' && values.multipliers[i] !== '') {
          pubKeysToSetMultiplier.push(new PublicKey(values.multiplierMints[i]!))
        } else {
          notify({
            message: `Error: Invalid multiplier mint "${values.multiplierMints[
              i
            ]!}" or multiplier "${values.multipliers[i]!}"`,
          })
          return
        }
      }

      if (pubKeysToSetMultiplier.length === 0) {
        notify({ message: `Info: No mints inserted` })
      }
      if (values.multipliers.length === 0) {
        notify({ message: `Info: No multiplier inserted` })
      }

      const [rewardDistributorId] = await findRewardDistributorId(
        stakePool.data.pubkey
      )
      const rewardDistributor = await tryGetAccount(() =>
        getRewardDistributor(connection, rewardDistributorId)
      )
      if (!rewardDistributor) {
        throw 'Reward Distributor for pool not found'
      }

      for (let i = 0; i < pubKeysToSetMultiplier.length; i++) {
        let mint = pubKeysToSetMultiplier[i]!
        const [stakeEntryId] = await findStakeEntryIdFromMint(
          connection,
          wallet.publicKey!,
          stakePool.data.pubkey,
          mint
        )
        const transaction = await withUpdateRewardEntry(
          new Transaction(),
          connection,
          wallet as Wallet,
          {
            stakePoolId: stakePool.data.pubkey,
            rewardDistributorId: rewardDistributor.pubkey,
            stakeEntryId: stakeEntryId,
            multiplier: new BN(values.multipliers[i]!),
          }
        )
        await executeTransaction(connection, wallet as Wallet, transaction, {
          silent: false,
          signers: [],
        })
        notify({
          message: `Successfully set multiplier ${i + 1}/${
            pubKeysToSetMultiplier.length
          }`,
          type: 'success',
        })
      }
    } catch (e) {
      const parsedError = handleError(e, `Error setting multiplier: ${e}`)
      notify({
        message: parsedError || String(e),
        type: 'error',
      })
    } finally {
      setLoadingHandleMultipliers(false)
    }
  }

  const handleAuthorizeMints = async () => {
    setLoadingHandleAuthorizeMints(true)
    try {
      if (!wallet?.connected) {
        throw 'Wallet not connected'
      }
      if (!stakePool.data?.pubkey) {
        throw 'Stake pool pubkey not found'
      }
      const authorizePublicKeys =
        mintsToAuthorize.length > 0
          ? mintsToAuthorize
              .split(',')
              .map((address) => new PublicKey(address.trim()))
          : []

      if (authorizePublicKeys.length === 0) {
        notify({ message: `Error: No mints inserted` })
      }
      for (let i = 0; i < authorizePublicKeys.length; i++) {
        let mint = authorizePublicKeys[i]!
        const transaction = await withAuthorizeStakeEntry(
          new Transaction(),
          connection,
          wallet as Wallet,
          {
            stakePoolId: stakePool.data.pubkey,
            originalMintId: mint,
          }
        )
        await executeTransaction(connection, wallet as Wallet, transaction, {
          silent: false,
          signers: [],
        })
        notify({
          message: `Successfully authorized ${i + 1}/${
            authorizePublicKeys.length
          }`,
          type: 'success',
        })
      }
    } catch (e) {
      notify({
        message: handleError(e, `Error authorizing mint: ${e}`),
        type: 'error',
      })
    } finally {
      setLoadingHandleAuthorizeMints(false)
    }
  }

  const handleUpdate = async (values: CreationForm) => {
    if (!wallet?.connected) {
      notify({
        message: 'Wallet not connected',
        type: 'error',
      })
      return
    }
    if (
      wallet.publicKey?.toString() !==
      stakePool.data?.parsed.authority.toString()
    ) {
      notify({
        message: 'You are not the pool authority.',
        type: 'error',
      })
      return
    }
    try {
      if (!stakePool.data?.pubkey) {
        throw 'Stake pool pubkey not found'
      }
      const transaction = new Transaction()
      if (
        values.rewardDistributorKind !== rewardDistributor.data?.parsed.kind
      ) {
        if (values.rewardDistributorKind === 0) {
          const [rewardDistributorId] = await findRewardDistributorId(
            stakePool.data.pubkey
          )
          const rewardDistributorData = await tryGetAccount(() =>
            getRewardDistributor(connection, rewardDistributorId)
          )
          if (rewardDistributorData) {
            await withCloseRewardDistributor(
              transaction,
              connection,
              wallet as Wallet,
              {
                stakePoolId: stakePool.data.pubkey,
              }
            )
            notify({
              message: 'Removing reward distributor for pool',
              type: 'info',
            })
          }
        } else {
          const rewardDistributorKindParams = {
            stakePoolId: stakePool.data.pubkey,
            rewardMintId: new PublicKey(values.rewardMintAddress!.trim())!,
            rewardAmount: values.rewardAmount
              ? new BN(values.rewardAmount)
              : undefined,
            rewardDurationSeconds: values.rewardDurationSeconds
              ? new BN(values.rewardDurationSeconds)
              : undefined,
            kind: values.rewardDistributorKind,
            supply: values.rewardMintSupply
              ? new BN(values.rewardMintSupply)
              : undefined,
            defaultMultiplier: values.defaultMultiplier
              ? new BN(values.defaultMultiplier)
              : undefined,
            multiplierDecimals: values.multiplierDecimals
              ? Number(values.multiplierDecimals)
              : undefined,
          }
          await withInitRewardDistributor(
            transaction,
            connection,
            wallet as Wallet,
            rewardDistributorKindParams
          )
          notify({
            message: 'Initializing reward distributor for pool',
            type: 'info',
          })
        }
      } else if (rewardDistributor.data) {
        await withUpdateRewardDistributor(
          transaction,
          connection,
          wallet as Wallet,
          {
            stakePoolId: stakePool.data.pubkey,
            defaultMultiplier: values.defaultMultiplier
              ? new BN(values.defaultMultiplier)
              : undefined,
            multiplierDecimals: values.multiplierDecimals
              ? Number(values.multiplierDecimals)
              : undefined,
            rewardAmount: values.rewardAmount
              ? new BN(values.rewardAmount)
              : undefined,
            rewardDurationSeconds: values.rewardDurationSeconds
              ? new BN(values.rewardDurationSeconds)
              : undefined,
          }
        )
        notify({
          message: `Updating reward distributor`,
          type: 'info',
        })
      }

      const collectionPublicKeys = values.requireCollections
        .map((c) => tryPublicKey(c))
        .filter((c) => c) as PublicKey[]
      const creatorPublicKeys = values.requireCreators
        .map((c) => tryPublicKey(c))
        .filter((c) => c) as PublicKey[]

      // format date
      let dateInNum: number | undefined = new Date(
        values.endDate?.toString() || ''
      ).getTime()
      if (dateInNum < Date.now()) {
        dateInNum = undefined
      }

      const stakePoolParams = {
        stakePoolId: stakePool.data.pubkey,
        requiresCollections: collectionPublicKeys,
        requiresCreators: creatorPublicKeys,
        requiresAuthorization: values.requiresAuthorization,
        resetOnStake: values.resetOnStake,
        overlayText: values.overlayText,
        cooldownSeconds: values.cooldownPeriodSeconds,
        minStakeSeconds: values.minStakeSeconds,
        endDate: dateInNum ? new BN(dateInNum / 1000) : undefined,
      }

      await withUpdateStakePool(
        transaction,
        connection,
        wallet as Wallet,
        stakePoolParams
      )

      await executeTransaction(connection, wallet as Wallet, transaction, {})
      notify({
        message:
          'Successfully updated stake pool and reward distributor with ID: ' +
          stakePool.data.pubkey.toString(),
        type: 'success',
      })

      await setTimeout(() => {
        stakePool.refetch()
        rewardDistributor.refetch()
      }, 1000)
    } catch (e) {
      notify({
        message: handleError(e, `Error updating stake pool: ${e}`),
        type: 'error',
      })
    }
  }

  const handleLookupMultiplier = async (mintToLookup: string) => {
    setLoadingLookupMultiplier(true)
    try {
      if (!wallet?.connected) {
        throw 'Wallet not connected'
      }
      if (!stakePool.data) {
        throw 'Stake pool not found'
      }
      if (!rewardDistributor.data) {
        throw 'Reward Distributor not found'
      }
      const mintId = new PublicKey(mintToLookup)
      let stakeEntryId: PublicKey
      try {
        ;[stakeEntryId] = await findStakeEntryIdFromMint(
          connection,
          wallet.publicKey!,
          stakePool.data!.pubkey,
          mintId
        )
      } catch (e) {
        throw 'Invalid mint ID or no reward entry for mint'
      }
      const [rewardEntryId] = await findRewardEntryId(
        rewardDistributor.data.pubkey,
        stakeEntryId
      )
      const rewardEntryData = await getRewardEntry(connection, rewardEntryId)
      setMultiplierFound(
        (
          rewardEntryData.parsed.multiplier.toNumber() /
          10 ** rewardDistributor.data.parsed.multiplierDecimals
        ).toString()
      )
    } catch (e) {
      setMultiplierFound('')
      notify({
        message: `${e}`,
        type: 'error',
      })
    } finally {
      setLoadingLookupMultiplier(false)
    }
  }

  const handleReclaimFunds = async () => {
    setLoadingReclaim(true)
    try {
      if (!wallet?.connected) {
        throw 'Wallet not connected'
      }
      if (!stakePool.data) {
        throw 'Stake pool not found'
      }
      if (!rewardDistributor.data) {
        throw 'Reward Distributor not found'
      }
      const transaction = new Transaction()
      await withReclaimFunds(transaction, connection, wallet as Wallet, {
        stakePoolId: stakePool.data.pubkey,
        amount: new BN(values.reclaimAmount || 0),
      })
      const txId = await executeTransaction(
        connection,
        wallet as Wallet,
        transaction,
        {}
      )
      notify({
        message: `Successfully reclaimed funds from pool. Txid: ${txId}`,
        type: 'success',
      })
    } catch (e) {
      notify({
        message: handleError(e, `Error reclaiming funds: ${e}`),
        type: 'error',
      })
    } finally {
      setLoadingReclaim(false)
    }
  }

  useMemo(async () => {}, [values.reclaimAmount?.toString()])

  return (
    <div>
      <Head>
        <title>Cardinal Staking UI</title>
        <meta name="description" content="Generated by Cardinal Staking UI" />
        <link rel="icon" href="/favicon.ico" />
        <script
          defer
          data-domain="stake.cardinal.so"
          src="https://plausible.io/js/plausible.js"
        ></script>
      </Head>

      <Header />
      <div className="container mx-auto w-full bg-[#1a1b20]">
        <div className="my-2 h-full min-h-[55vh] rounded-md bg-white bg-opacity-5 p-10 text-gray-200">
          {!stakePool.isFetched || !rewardDistributor.isFetched ? (
            <div className="h-[40vh] w-full animate-pulse rounded-md bg-white bg-opacity-10"></div>
          ) : stakePool.data ? (
            <div className="grid h-full grid-cols-2 gap-4 ">
              <div>
                <p className="text-lg font-bold">Update Staking Pool</p>
                <p className="mt-1 mb-2 text-sm">
                  All parameters for staking pool are optional and pre-filled
                  with existing values for ease of use.
                </p>
                <StakePoolForm
                  type="update"
                  handleSubmit={handleUpdate}
                  stakePoolData={stakePool.data}
                  rewardDistributorData={rewardDistributor.data}
                />
                <div className="mt-2 italic">
                  NOTE: Changing <strong>rewardAmount</strong>/
                  <strong>rewardDurationSeconds</strong> will affect the
                  distribution for currently staked and not-yet claimed rewards
                  to this new rate.
                  <br></br>
                  Changing <strong>multiplierDecimals</strong> will apply these
                  decimals to all existing multipliers.<br></br>
                  Changing <strong>defaultMultiplier</strong> will only apply to
                  new reward entries being created.
                </div>
              </div>
              <div>
                <p className="text-lg font-bold">Current Staking Pool</p>
                <p className="mt-1 mb-5 text-sm">
                  The parameters currently in place for the stake pool
                </p>
                {stakePool.isFetched ? (
                  <>
                    <span className="flex w-full flex-wrap md:mb-0">
                      <label className="inline-block text-sm font-bold uppercase tracking-wide text-gray-200">
                        Overlay Text:
                      </label>
                      <label className="inline-block pl-2">
                        {stakePool.data?.parsed.overlayText || '[None]'}
                      </label>
                    </span>
                    <span className="mt-3 flex w-full flex-wrap md:mb-0">
                      <label className="inline-block text-sm font-bold uppercase tracking-wide text-gray-200">
                        Collection Addresses:
                      </label>
                      <label className="inline-block pl-2">
                        {stakePool.data?.parsed.requiresCollections &&
                        stakePool.data?.parsed.requiresCollections.length !== 0
                          ? stakePool.data?.parsed.requiresCollections.map(
                              (collection) => (
                                <ShortPubKeyUrl
                                  pubkey={collection}
                                  cluster={environment.label}
                                  className="pr-2 text-sm text-white"
                                />
                              )
                            )
                          : '[None]'}
                      </label>
                    </span>
                    <span className="mt-3 flex w-full flex-wrap md:mb-0">
                      <label className="inline-block text-sm font-bold uppercase tracking-wide text-gray-200">
                        Creator Addresses:
                      </label>
                      <label className="inline-block pl-2 text-white">
                        {stakePool.data?.parsed.requiresCreators &&
                        stakePool.data?.parsed.requiresCreators.length !== 0
                          ? stakePool.data?.parsed.requiresCreators.map(
                              (creator) => (
                                <ShortPubKeyUrl
                                  pubkey={creator}
                                  cluster={environment.label}
                                  className="pr-2 text-sm font-bold underline underline-offset-2"
                                />
                              )
                            )
                          : '[None]'}
                      </label>
                    </span>
                    <span className="mt-3 flex w-full flex-wrap md:mb-0">
                      <label className="inline-block text-sm font-bold uppercase tracking-wide text-gray-200">
                        Requires Authorization:{' '}
                        {stakePool.data?.parsed.requiresAuthorization.toString() ||
                          '[None]'}
                      </label>
                    </span>
                    <span className="mt-3 flex w-full flex-wrap md:mb-0">
                      <label className="inline-block text-sm font-bold uppercase tracking-wide text-gray-200">
                        Cooldown Period Seconds:{' '}
                        {stakePool.data?.parsed.cooldownSeconds || '[None]'}
                      </label>
                    </span>
                    <span className="mt-3 flex w-full flex-wrap md:mb-0">
                      <label className="inline-block text-sm font-bold uppercase tracking-wide text-gray-200">
                        Minimum Stake Seconds:{' '}
                        {stakePool.data?.parsed.minStakeSeconds || '[None]'}
                      </label>
                    </span>
                    <span className="mt-3 flex w-full flex-wrap md:mb-0">
                      <label className="inline-block text-sm font-bold uppercase tracking-wide text-gray-200">
                        End Date:{' '}
                        {stakePool.data?.parsed.endDate
                          ? new Date(
                              stakePool.data?.parsed.endDate?.toNumber() * 1000
                            ).toDateString()
                          : '[None]'}
                      </label>
                    </span>
                    {rewardDistributor.data && (
                      <>
                        <span className="mt-3 flex w-full flex-wrap md:mb-0">
                          <Tooltip
                            title={'Use to add more funds to reward ditributor'}
                            placement="right"
                          >
                            <label className="inline-block text-sm font-bold uppercase tracking-wide text-gray-200">
                              Reward Distributor:{' '}
                              <a
                                target={'_blank'}
                                className="underline underline-offset-2"
                                href={pubKeyUrl(
                                  rewardDistributor.data.pubkey,
                                  environment.label
                                )}
                              >
                                {shortPubKey(rewardDistributor.data.pubkey)}
                              </a>{' '}
                            </label>
                          </Tooltip>
                        </span>
                        <span className="mt-3 flex w-full flex-wrap md:mb-0">
                          <label className="inline-block text-sm font-bold uppercase tracking-wide text-gray-200">
                            Reward Duration Seconds:{' '}
                            {rewardDistributor.data.parsed.rewardDurationSeconds.toNumber() ||
                              '[None]'}
                          </label>
                        </span>
                        <span className="mt-3 flex w-full flex-wrap md:mb-0">
                          <label className="inline-block text-sm font-bold uppercase tracking-wide text-gray-200">
                            Reward Amount:{' '}
                            {rewardDistributor.data.parsed.rewardAmount &&
                            rewardMintInfo.data
                              ? getMintDecimalAmountFromNatural(
                                  rewardMintInfo.data?.mintInfo,
                                  rewardDistributor.data.parsed.rewardAmount
                                ).toNumber()
                              : '[None]'}
                          </label>
                        </span>
                        <span className="mt-3 flex w-full flex-wrap md:mb-0">
                          <label className="inline-block text-sm font-bold uppercase tracking-wide text-gray-200">
                            Default Multiplier:{' '}
                            {rewardDistributor.data.parsed.defaultMultiplier.toNumber() ||
                              '[None]'}
                          </label>
                        </span>
                        <span className="mt-3 flex w-full flex-wrap md:mb-0">
                          <label className="inline-block text-sm font-bold uppercase tracking-wide text-gray-200">
                            Multiplier Decimals:{' '}
                            {rewardDistributor.data.parsed.multiplierDecimals ||
                              '[None]'}
                          </label>
                        </span>
                      </>
                    )}
                  </>
                ) : (
                  <div className="relative flex h-8 w-full items-center justify-center">
                    <span className="text-gray-500"></span>
                    <div className="absolute w-full animate-pulse items-center justify-center rounded-lg bg-white bg-opacity-10 p-5"></div>
                  </div>
                )}
                {rewardDistributor.data && (
                  <div className="mt-10">
                    {rewardDistributor.data.parsed.kind ===
                      RewardDistributorKind.Treasury && (
                      <>
                        <label
                          className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-200"
                          htmlFor="require-authorization"
                        >
                          Reclaim Funds
                        </label>
                        <div className="mb-5 flex flex-row">
                          <div
                            className={`flex w-1/4 appearance-none justify-between rounded border border-gray-500 bg-gray-700 py-2 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800`}
                          >
                            <input
                              className={`mr-5 w-full bg-transparent focus:outline-none`}
                              type="text"
                              placeholder={'1000000'}
                              value={tryFormatInput(
                                values.reclaimAmount,
                                mintInfo?.decimals || 0,
                                '0'
                              )}
                              onChange={(e) => {
                                const value = Number(e.target.value)
                                if (Number.isNaN(value)) {
                                  notify({
                                    message: `Invalid reclaim amount`,
                                    type: 'error',
                                  })
                                  return
                                }
                                setFieldValue(
                                  'reclaimAmount',
                                  tryParseInput(
                                    e.target.value,
                                    mintInfo?.decimals || 0,
                                    values.reclaimAmount ?? ''
                                  )
                                )
                              }}
                            />
                            <div
                              className="cursor-pointer"
                              onClick={async () => {
                                setLoadingReclaim(true)
                                const mint = new PublicKey(
                                  rewardDistributor.data!.parsed.rewardMint
                                )
                                const checkMint = new splToken.Token(
                                  connection,
                                  mint,
                                  splToken.TOKEN_PROGRAM_ID,
                                  Keypair.generate() // unused
                                )
                                let mintInfo = await checkMint.getMintInfo()
                                setMintInfo(mintInfo)
                                const mintAta = await findAta(
                                  rewardDistributor.data!.parsed.rewardMint,
                                  rewardDistributor.data!.pubkey,
                                  true
                                )
                                const ata = await checkMint.getAccountInfo(
                                  mintAta
                                )
                                setFieldValue(
                                  'reclaimAmount',
                                  ata.amount.toString()
                                )
                                setLoadingReclaim(false)
                              }}
                            >
                              Max
                            </div>
                          </div>
                          <button
                            className="ml-5"
                            type="button"
                            onClick={() => handleReclaimFunds()}
                          >
                            <div
                              className={
                                'inline-block cursor-pointer rounded-md bg-blue-700 px-4 py-2'
                              }
                            >
                              {loadingReclaim && (
                                <div className="mr-2 inline-block">
                                  <TailSpin
                                    color="#fff"
                                    height={15}
                                    width={15}
                                  />
                                </div>
                              )}
                              Reclaim Funds
                            </div>
                          </button>
                        </div>
                      </>
                    )}
                    <div className="mb-5">
                      <label
                        className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-200"
                        htmlFor="require-authorization"
                      >
                        Look up reward multiplier for mint
                      </label>
                      <input
                        className="mb-3 w-3/5 appearance-none flex-col rounded border border-gray-500 bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800 focus:outline-none"
                        type="text"
                        placeholder={'Enter Mint ID'}
                        onChange={(e) => {
                          if (e.target.value.length !== 0) {
                            handleLookupMultiplier(e.target.value)
                          } else {
                            setMultiplierFound('')
                          }
                        }}
                      />
                      <span className="ml-10 inline-block">
                        {loadingLookupMultiplier && (
                          <TailSpin color="#fff" height={20} width={20} />
                        )}
                        {multiplierFound && (
                          <span className="text-md border px-4 py-2 font-semibold">
                            {multiplierFound}x
                          </span>
                        )}
                      </span>
                    </div>
                    <label
                      className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-200"
                      htmlFor="require-authorization"
                    >
                      Set multiplier for given mints
                    </label>
                    <p className="text-sm italic text-gray-300">
                      Set the stake multiplier for given mints.
                      <br />
                      For a 1x multiplier, enter value{' '}
                      {10 ** rewardDistributor.data.parsed.multiplierDecimals},
                      for a 2x multiplier enter value{' '}
                      {2 *
                        10 **
                          rewardDistributor.data.parsed.multiplierDecimals}{' '}
                      ...
                    </p>
                    <p className="text-sm italic text-gray-300">
                      For decimal multipliers, work with the reward
                      distributor's <b>multiplierDecimals</b>. If you set
                      multiplierDecimals = 1, then for 1.5x multiplier, enter
                      value 15 so that value/10**multiplierDecimals = 15/10^1 =
                      1.5
                    </p>
                    <p className="mt-2 text-sm italic text-gray-300">
                      <b>NOTE</b> that for 1.5x, you could set
                      multiplierDecimals = 2 and enter value 150, or
                      multiplierDecimals = 3 and enter value 1500 ...
                    </p>
                    <p className="mt-2 mb-5 text-sm italic text-gray-300">
                      <b>WARNING</b> Do not set more than a few at at time. If
                      needed take a look at the scripts in{' '}
                      <a
                        href="https://github.com/cardinal-labs/cardinal-staking/tree/main/tools"
                        className="text-blue-500"
                        target="_blank"
                      >
                        tools
                      </a>{' '}
                      to set many at a time.
                    </p>
                    <span className="flex flex-row gap-5">
                      <input
                        className="mb-3 w-1/6 appearance-none flex-col rounded border border-gray-500 bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800 focus:outline-none"
                        type="text"
                        placeholder={'0'}
                        onChange={(e) => {
                          setFieldValue('multipliers[0]', e.target.value)
                        }}
                      />
                      <div
                        className={`mb-3 flex w-full appearance-none justify-between rounded border border-gray-500 bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800`}
                      >
                        <input
                          className={`mr-5 w-full bg-transparent focus:outline-none`}
                          type="text"
                          autoComplete="off"
                          onChange={(e) => {
                            setFieldValue('multiplierMints[0]', e.target.value)
                          }}
                          placeholder={'CmAy...A3fD'}
                          name="requireCollections"
                        />
                        <div
                          className="cursor-pointer text-xs text-gray-400"
                          onClick={() => {
                            setFieldValue(`multiplierMints`, [
                              '',
                              ...values.multiplierMints!,
                            ])
                            setFieldValue(`multipliers`, [
                              '',
                              ...values.multipliers!,
                            ])
                          }}
                        >
                          Add
                        </div>
                      </div>
                    </span>
                    {values.multiplierMints!.map(
                      (v, i) =>
                        i > 0 && (
                          <span className="flex flex-row gap-5">
                            <input
                              className="mb-3 w-1/6 appearance-none flex-col rounded border border-gray-500 bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800 focus:outline-none"
                              type="text"
                              placeholder={'0'}
                              onChange={(e) => {
                                setFieldValue(
                                  `multipliers[${i}]`,
                                  e.target.value
                                )
                              }}
                            />
                            <div
                              className={`mb-3 flex w-full appearance-none justify-between rounded border border-gray-500 bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800`}
                            >
                              <input
                                className={`mr-5 w-full bg-transparent focus:outline-none`}
                                type="text"
                                autoComplete="off"
                                onChange={(e) => {
                                  setFieldValue(
                                    `multiplierMints[${i}]`,
                                    e.target.value
                                  )
                                }}
                                placeholder={'CmAy...A3fD'}
                                name="requireCollections"
                              />
                              <div
                                className="cursor-pointer text-xs text-gray-400"
                                onClick={() => {
                                  setFieldValue(
                                    `multiplierMints`,
                                    values.multiplierMints!.filter(
                                      (_, ix) => ix !== i
                                    )
                                  )
                                  setFieldValue(
                                    `multipliers`,
                                    values.multipliers!.filter(
                                      (_, ix) => ix !== i
                                    )
                                  )
                                }}
                              >
                                Remove
                              </div>
                            </div>
                          </span>
                        )
                    )}
                    <button type="button" onClick={() => handleMutliplier()}>
                      <div
                        className={
                          'mt-4 inline-block cursor-pointer rounded-md bg-blue-700 px-4 py-2'
                        }
                      >
                        {loadingHandleMultipliers && (
                          <div className="mr-2 inline-block">
                            <TailSpin color="#fff" height={15} width={15} />
                          </div>
                        )}
                        Set Multipliers
                      </div>
                    </button>
                  </div>
                )}
                {stakePool.data?.parsed.requiresAuthorization && (
                  <div className="mt-5">
                    <label
                      className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-200"
                      htmlFor="require-authorization"
                    >
                      Authorize access to specific mint
                    </label>
                    <p className="mb-2 text-sm italic text-gray-300">
                      Allow any specific mints access to the stake pool
                      (separated by commas)
                    </p>
                    <p className="mb-5 text-sm italic text-gray-300">
                      <b>WARNING</b> Do not set more than a few at at time. If
                      needed take a look at the scripts in{' '}
                      <a
                        href="https://github.com/cardinal-labs/cardinal-staking/tree/main/tools"
                        className="text-blue-500"
                        target="_blank"
                      >
                        tools
                      </a>{' '}
                      to set many at a time.
                    </p>
                    <input
                      className="mb-3 block w-full appearance-none rounded border border-gray-500 bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800 focus:outline-none"
                      type="text"
                      placeholder={'Cmwy..., A3fD..., 7Y1v...'}
                      value={mintsToAuthorize}
                      onChange={(e) => {
                        setMintsToAuthorize(e.target.value)
                      }}
                    />
                    <div
                      className={
                        'mt-4 inline-block cursor-pointer rounded-md bg-blue-700 px-4 py-2'
                      }
                      onClick={() => handleAuthorizeMints()}
                    >
                      <div className="flex">
                        {loadingHandleAuthorizeMints && (
                          <div className="mr-2">
                            <TailSpin color="#fff" height={15} width={15} />
                          </div>
                        )}
                        Authorize Mints
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="w-full text-center text-gray-500">
              No stake pool found
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AdminStakePool
