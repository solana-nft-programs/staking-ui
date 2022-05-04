import {
  findAta,
  tryGetAccount,
  withFindOrInitAssociatedTokenAccount,
} from '@cardinal/common'
import { executeTransaction } from '@cardinal/staking'
import { getRewardDistributor } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/accounts'
import { findRewardDistributorId } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/pda'
import {
  withInitRewardDistributor,
  withUpdateRewardEntry,
} from '@cardinal/staking/dist/cjs/programs/rewardDistributor/transaction'
import * as splToken from '@solana/spl-token'
import {
  withAuthorizeStakeEntry,
  withUpdateStakePool,
} from '@cardinal/staking/dist/cjs/programs/stakePool/transaction'
import { Wallet } from '@metaplex/js'
import { BN } from '@project-serum/anchor'
import { useWallet } from '@solana/wallet-adapter-react'
import { Keypair, PublicKey, Transaction } from '@solana/web3.js'
import Select from 'react-select'
import { Footer } from 'common/Footer'
import { FormFieldTitleInput } from 'common/FormFieldInput'
import { Header } from 'common/Header'
import { notify } from 'common/Notification'
import { ShortPubKeyUrl } from 'common/Pubkeys'
import { useStakePoolData } from 'hooks/useStakePoolData'
import Head from 'next/head'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useState } from 'react'
import { TailSpin } from 'react-loader-spinner'
import { RewardDistributorKind } from '@cardinal/staking/dist/cjs/programs/rewardDistributor'
import { LoadingSpinner } from 'common/LoadingSpinner'
import {
  getMintDecimalAmountFromNaturalV2,
  parseMintNaturalAmountFromDecimal,
} from 'common/units'
import { customStyles } from '../index'

function Home() {
  const wallet = useWallet()
  const { connection, environment } = useEnvironmentCtx()
  const stakePool = useStakePoolData()
  const [overlayText, setOverlayText] = useState('')
  const [mintsToAuthorize, setMintsToAuthorize] = useState<string>('')
  const [multiplierMints, setMultiplierMints] = useState<string>('')
  const [multiplier, setMultiplier] = useState<string>('100')
  const [collectionAddresses, setCollectionAddresses] = useState<string>('')
  const [creatorAddresses, setCreatorAddresses] = useState<string>('')
  const [authorizeNFT, setAuthorizeNFT] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingHandleAuthorizeMints, setLoadingHandleAuthorizeMints] =
    useState<boolean>(false)
  const [loadingHandleMultipliers, setLoadingHandleMultipliers] =
    useState<boolean>(false)
  const [resetOnStake, setResetOnStake] = useState<boolean>(false)
  const [rewardAmount, setRewardAmount] = useState<string>('')
  const [rewardDurationSeconds, setRewardDurationSeconds] = useState<string>('')
  const [rewardMintAddress, setRewardMintAddress] = useState<string>('')
  const [rewardDistributorKind, setRewardDistributorKind] =
    useState<RewardDistributorKind>()
  const [rewardMintSupply, setRewardMintSupply] = useState<string>('')
  const [processingMintAddress, setProcessingMintAddress] =
    useState<boolean>(false)
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(true)
  const [mintInfo, setMintInfo] = useState<splToken.MintInfo>()
  const [maxMintSupply, setMaxMintSupply] = useState<number>(0)

  const handleMutliplier = async () => {
    setLoadingHandleMultipliers(true)
    try {
      if (!wallet?.connected) {
        throw 'Wallet not connected'
      }
      if (!stakePool.data?.pubkey) {
        throw 'Stake pool pubkey not found'
      }
      const pubKeysToSetMultiplier =
        multiplierMints.length > 0
          ? multiplierMints
              .split(',')
              .map((address) => new PublicKey(address.trim()))
          : []

      if (pubKeysToSetMultiplier.length === 0) {
        notify({ message: `Error: No mints inserted` })
      }
      if (multiplier.length === 0) {
        notify({ message: `Error: No multiplier inserted` })
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
        const transaction = await withUpdateRewardEntry(
          new Transaction(),
          connection,
          wallet as Wallet,
          {
            stakePoolId: stakePool.data.pubkey,
            rewardDistributorId: rewardDistributorId,
            mintId: mint,
            multiplier: new BN(multiplier),
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
      notify({
        message: `Error setting mutliplier for mint: ${e}`,
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
      notify({ message: `Error authorizing mint: ${e}`, type: 'error' })
    } finally {
      setLoadingHandleAuthorizeMints(false)
    }
  }

  const handleUpdate = async () => {
    setLoading(true)
    try {
      if (!wallet?.connected) {
        throw 'Wallet not connected'
      }
      if (!stakePool.data?.pubkey) {
        throw 'Stake pool pubkey not found'
      }

      const collectionPublicKeys =
        collectionAddresses.length > 0
          ? collectionAddresses
              .split(',')
              .map((address) => new PublicKey(address.trim()))
          : []
      const creatorPublicKeys =
        creatorAddresses.length > 0
          ? creatorAddresses
              .split(',')
              .map((address) => new PublicKey(address.trim()))
          : []
      const rewardMintPublicKey = rewardMintAddress
        ? new PublicKey(rewardMintAddress.trim())
        : undefined
      const rewardAmountBN = rewardAmount
        ? new BN(
            parseMintNaturalAmountFromDecimal(
              rewardAmount,
              mintInfo?.decimals || 1
            )
          )
        : undefined
      const rewardDurationSecondsBN = rewardDurationSeconds
        ? new BN(parseInt(rewardDurationSeconds))
        : undefined
      const supply = rewardMintSupply
        ? new BN(
            parseMintNaturalAmountFromDecimal(
              rewardMintSupply,
              mintInfo?.decimals || 1
            )
          )
        : undefined

      const stakePoolParams = {
        stakePoolId: stakePool.data?.pubkey,
        requiresCollections:
          collectionPublicKeys.length > 0 ? collectionPublicKeys : [],
        requiresCreators: creatorPublicKeys.length > 0 ? creatorPublicKeys : [],
        requiresAuthorization: authorizeNFT,
        overlayText: overlayText.length > 0 ? overlayText : undefined,
      }

      const [transaction] = await withUpdateStakePool(
        new Transaction(),
        connection,
        wallet as Wallet,
        stakePoolParams
      )

      const [rewardDistributorId] = await findRewardDistributorId(
        stakePool.data.pubkey
      )
      const rewardDistributor = await tryGetAccount(() =>
        getRewardDistributor(connection, rewardDistributorId)
      )
      if (!rewardDistributor) {
        if (rewardDistributorKind) {
          const rewardDistributorKindParams = {
            stakePoolId: stakePool.data.pubkey,
            rewardMintId: rewardMintPublicKey!,
            rewardAmount: rewardAmountBN,
            rewardDurationSeconds: rewardDurationSecondsBN,
            kind: rewardDistributorKind,
            supply: supply,
          }

          await withInitRewardDistributor(
            transaction,
            connection,
            wallet as Wallet,
            rewardDistributorKindParams
          )
        }
      }

      await executeTransaction(connection, wallet as Wallet, transaction, {
        silent: false,
        signers: [],
      })
      notify({
        message:
          'Successfully updated stake pool with ID: ' +
          stakePool.data.pubkey.toString(),
        type: 'success',
      })
    } catch (e) {
      notify({ message: `Error updating stake pool: ${e}`, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

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

  return (
    <div>
      <Head>
        <title>Cardinal Staking UI</title>
        <meta name="description" content="Generated by Cardinal Staking UI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <div className="container mx-auto w-full bg-[#1a1b20]">
        <div className="my-2 grid h-full grid-cols-2 gap-4 rounded-md bg-white bg-opacity-5 p-10 text-gray-200">
          <div>
            <p className="text-lg font-bold">Update Staking Pool</p>
            <p className="mt-1 mb-2 text-sm">
              All parameters for staking pool are optional. If a field is left
              <b> empty</b>, it will be set to its default value
            </p>
            <form className="w-full max-w-lg">
              <div className="flex flex-wrap">
                <div className="mb-6 mt-4 w-full px-3 md:mb-0">
                  <FormFieldTitleInput
                    title={'Overlay Text'}
                    description={'Text to display over the receipt'}
                  />
                  <input
                    className="mb-3 block w-full appearance-none rounded border border-gray-500 bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800 focus:outline-none"
                    type="text"
                    placeholder={'STAKED'}
                    value={overlayText}
                    onChange={(e) => {
                      setOverlayText(e.target.value)
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-wrap">
                <div className="mb-6 mt-4 w-full px-3 md:mb-0">
                  <FormFieldTitleInput
                    title={'Collection Addresses []'}
                    description={
                      'Allow any NFTs with these collection addresses (separated by commas)'
                    }
                  />
                  <input
                    className="mb-3 block w-full appearance-none rounded border border-gray-500 bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800 focus:outline-none"
                    type="text"
                    placeholder={'Cmwy..., A3fD...'}
                    value={collectionAddresses}
                    onChange={(e) => {
                      setCollectionAddresses(e.target.value)
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-wrap">
                <div className="mb-6 mt-4 w-full px-3 md:mb-0">
                  <FormFieldTitleInput
                    title={'Creator Addresses []'}
                    description={
                      'Allow any NFTs with these creator addresses (separated by commas)'
                    }
                  />
                  <input
                    className="mb-3 block w-full appearance-none rounded border border-gray-500 bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800 focus:outline-none"
                    type="text"
                    placeholder={'Cmwy..., A3fD...'}
                    value={creatorAddresses}
                    onChange={(e) => {
                      setCreatorAddresses(e.target.value)
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-wrap">
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
                    checked={authorizeNFT}
                    onChange={(e) => {
                      setAuthorizeNFT(e.target.checked)
                    }}
                  />{' '}
                  <span
                    className="my-auto cursor-pointer text-sm"
                    onClick={() => setAuthorizeNFT(!authorizeNFT)}
                  >
                    Require Authorization
                  </span>
                </div>
                <div className="flex flex-wrap">
                  <div className="mb-6 mt-4 w-full px-3 md:mb-0">
                    <label
                      className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-200"
                      htmlFor="require-authorization"
                    >
                      Reset on stake
                    </label>
                    <p className="mb-2 text-sm italic text-gray-300">
                      If selected, tokens will lose their total staked seconds
                      (will be reset to zero) when they get re-staked
                    </p>
                    <input
                      className="mb-3 cursor-pointer"
                      id="require-authorization"
                      type="checkbox"
                      checked={resetOnStake}
                      onChange={(e) => {
                        setResetOnStake(e.target.checked)
                      }}
                    />{' '}
                    <span
                      className="my-auto cursor-pointer text-sm"
                      onClick={() => setResetOnStake(!resetOnStake)}
                    >
                      Reset on unstake
                    </span>
                  </div>
                </div>
                <div>
                  <div className="mt-5 flex flex-wrap rounded-md bg-white bg-opacity-5 pb-2">
                    <div className="mb-6 mt-4 w-full px-3 md:mb-0">
                      <FormFieldTitleInput
                        title={'Add Reward Distribution To Your Pool'}
                        description={
                          'Mint tokens from the mint address or transfer tokens to the stake pool.'
                        }
                      />
                      <Select
                        styles={customStyles}
                        className="mb-3"
                        isSearchable={false}
                        onChange={(option) => {
                          setRewardDistributorKind(
                            {
                              '1': RewardDistributorKind.Mint,
                              '2': RewardDistributorKind.Treasury,
                            }[option?.value ?? '']
                          )
                          setRewardMintSupply('')
                        }}
                        defaultValue={{ label: 'None', value: '0' }}
                        options={[
                          { value: '0', label: 'None' },
                          { value: '1', label: 'Mint' },
                          { value: '2', label: 'Transfer' },
                        ]}
                      />
                    </div>
                    {rewardDistributorKind && (
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
                            className="mb-3 block w-full appearance-none rounded border border-gray-500 bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800 focus:outline-none"
                            type="text"
                            placeholder={
                              'Enter Mint Address First: So1111..11112'
                            }
                            value={rewardMintAddress}
                            onChange={(e) => {
                              setRewardMintAddress(e.target.value)
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
                                className="mb-3 block w-full appearance-none rounded border border-gray-500 bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800 focus:outline-none"
                                type="text"
                                placeholder={'10'}
                                value={rewardAmount}
                                disabled={submitDisabled}
                                onChange={(e) => {
                                  const amount = Number(e.target.value)
                                  if (!amount && e.target.value.length != 0) {
                                    notify({
                                      message: `Invalid reward amount`,
                                      type: 'error',
                                    })
                                  }
                                  setRewardAmount(e.target.value)
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
                                className="mb-3 block w-full appearance-none rounded border border-gray-500 bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800 focus:outline-none"
                                type="text"
                                placeholder={'60'}
                                value={rewardDurationSeconds}
                                disabled={submitDisabled}
                                onChange={(e) => {
                                  const seconds = Number(e.target.value)
                                  if (!seconds && e.target.value.length != 0) {
                                    notify({
                                      message: `Invalid reward duration seconds`,
                                      type: 'error',
                                    })
                                  }
                                  setRewardDurationSeconds(e.target.value)
                                }}
                              />
                            </div>

                            <div className="mb-6 mt-4 w-full px-3 md:mb-0">
                              <FormFieldTitleInput
                                title={
                                  rewardDistributorKind ===
                                  RewardDistributorKind.Mint
                                    ? 'Reward Max Supply'
                                    : 'Reward Transfer Amount'
                                }
                                description={
                                  rewardDistributorKind ===
                                  RewardDistributorKind.Treasury
                                    ? 'Max number of tokens to mint (max: mint supply).'
                                    : 'How many tokens to transfer to the stake pool for future distribution (max: your asscociated token account balance).'
                                }
                              />
                              <div className="mb-3 flex appearance-none justify-between rounded border border-gray-500 bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800">
                                <input
                                  className="mr-5 w-full bg-transparent focus:outline-none"
                                  disabled={submitDisabled}
                                  type="text"
                                  placeholder={'1000000'}
                                  value={rewardMintSupply}
                                  onChange={(e) => {
                                    const supply = Number(e.target.value)
                                    if (!supply && e.target.value.length != 0) {
                                      notify({
                                        message: `Invalid reward mint supply`,
                                        type: 'error',
                                      })
                                    }
                                    setRewardMintSupply(e.target.value)
                                  }}
                                />
                                <div
                                  className="cursor-pointer"
                                  onClick={() => {
                                    if (
                                      rewardDistributorKind ===
                                      RewardDistributorKind.Mint
                                    ) {
                                      setRewardMintSupply(
                                        mintInfo.supply
                                          .toString()
                                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                      )
                                    } else {
                                      setRewardMintSupply(
                                        String(maxMintSupply).replace(
                                          /\B(?=(\d{3})+(?!\d))/g,
                                          ','
                                        )
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
              </div>

              <button
                type="button"
                className={'mt-4 inline-block rounded-md bg-blue-700 px-4 py-2'}
                onClick={() => handleUpdate()}
              >
                <div className="flex">
                  {loading && (
                    <div className="mr-2">
                      <TailSpin color="#fff" height={20} width={20} />
                    </div>
                  )}
                  Update Pool
                </div>
              </button>
            </form>
          </div>
          <div>
            <p className="text-lg font-bold">Current Staking Pool</p>
            <p className="mt-1 mb-5 text-sm">
              The parameters currently in place for the stake pool
            </p>
            {stakePool.loaded ? (
              <>
                <span className="flex w-full flex-wrap px-3 md:mb-0">
                  <label className="inline-block text-sm font-bold uppercase tracking-wide text-gray-200">
                    Overlay Text:
                  </label>
                  <label className="inline-block pl-2">
                    {stakePool.data?.parsed.overlayText || '[None]'}
                  </label>
                </span>
                <span className="mt-3 flex w-full flex-wrap px-3 md:mb-0">
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
                <span className="mt-3 flex w-full flex-wrap px-3 md:mb-0">
                  <label className="inline-block text-sm font-bold uppercase tracking-wide text-gray-200">
                    Creator Addresses:
                  </label>
                  <label className="inline-block pl-2">
                    {stakePool.data?.parsed.requiresCreators &&
                    stakePool.data?.parsed.requiresCreators.length !== 0
                      ? stakePool.data?.parsed.requiresCreators.map(
                          (creator) => (
                            <ShortPubKeyUrl
                              pubkey={creator}
                              cluster={environment.label}
                              className="pr-2 text-sm text-white"
                            />
                          )
                        )
                      : '[None]'}
                  </label>
                </span>
                <span className="mt-3 flex w-full flex-wrap px-3 md:mb-0">
                  <label className="inline-block text-sm font-bold uppercase tracking-wide text-gray-200">
                    Requires Authorization:{' '}
                    {stakePool.data?.parsed.requiresAuthorization.toString() ||
                      '[None]'}
                  </label>
                </span>
              </>
            ) : (
              <div className="relative flex h-8 w-full items-center justify-center">
                <span className="text-gray-500"></span>
                <div className="absolute w-full animate-pulse items-center justify-center rounded-lg bg-white bg-opacity-10 p-5"></div>
              </div>
            )}
            <div className="mt-10">
              <label
                className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-200"
                htmlFor="require-authorization"
              >
                Set multiplier for given mints
              </label>
              <p className="mb-2 text-sm italic text-gray-300">
                Set the stake multiplier for given mints (separated by commas).
                <br />
                For a 1x multiplier, enter value 100, for a 2x multiplier enter
                value 200 ...
              </p>
              <span className="flex flex-row">
                <input
                  className="mb-3 w-1/6 appearance-none flex-col rounded border border-gray-500 bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800 focus:outline-none"
                  type="text"
                  placeholder={'100'}
                  value={multiplier}
                  onChange={(e) => {
                    const value = Number(e.target.value)
                    if (!value && e.target.value.length != 0) {
                      notify({
                        message: `Invalid multiplier value`,
                        type: 'error',
                      })
                    }
                    setMultiplier(e.target.value)
                  }}
                />
                <input
                  className="mb-3 ml-5 w-5/6 appearance-none flex-col rounded border border-gray-500 bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800 focus:outline-none"
                  type="text"
                  placeholder={'Cmwy..., A3fD..., 7Y1v...'}
                  value={multiplierMints}
                  onChange={(e) => {
                    setMultiplierMints(e.target.value)
                  }}
                />
              </span>
            </div>
            {stakePool.data?.parsed.requiresAuthorization && (
              <div className="mt-5">
                <label
                  className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-200"
                  htmlFor="require-authorization"
                >
                  Authorize access to specific mint
                </label>
                <p className="mb-2 text-sm italic text-gray-300">
                  Allow any specific mints access to the stake pool (separated
                  by commas)
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
              </div>
            )}
            <button
              type="button"
              className={'mt-4 inline-block rounded-md bg-blue-700 px-4 py-2'}
              onClick={() => handleMutliplier()}
            >
              <div className="flex">
                {loadingHandleMultipliers && (
                  <div className="mr-2">
                    <TailSpin color="#fff" height={15} width={15} />
                  </div>
                )}
                Set Multipliers
              </div>
            </button>
            {stakePool.data?.parsed.requiresAuthorization && (
              <button
                type="button"
                className={
                  'ml-5 mt-4 inline-block rounded-md bg-blue-700 px-4 py-2'
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
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Home
