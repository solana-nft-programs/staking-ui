import { tryGetAccount } from '@cardinal/common'
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
import { PublicKey, Transaction } from '@solana/web3.js'
import { Footer } from 'common/Footer'
import { Header } from 'common/Header'
import { notify } from 'common/Notification'
import { ShortPubKeyUrl } from 'common/Pubkeys'
import { useStakePoolData } from 'hooks/useStakePoolData'
import Head from 'next/head'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useState } from 'react'
import { TailSpin } from 'react-loader-spinner'
import { parseMintNaturalAmountFromDecimal } from 'common/units'
import { CreationForm, StakePoolForm } from 'components/StakePoolForm'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { tryPublicKey } from 'common/utils'

function AdminStakePool() {
  const wallet = useWallet()
  const { connection, environment } = useEnvironmentCtx()
  const stakePool = useStakePoolData()
  const rewardDistributor = useRewardDistributorData()
  const [mintsToAuthorize, setMintsToAuthorize] = useState<string>('')
  const [multiplierMints, setMultiplierMints] = useState<string>('')
  const [multiplier, setMultiplier] = useState<string>('100')
  const [loadingHandleAuthorizeMints, setLoadingHandleAuthorizeMints] =
    useState<boolean>(false)
  const [loadingHandleMultipliers, setLoadingHandleMultipliers] =
    useState<boolean>(false)

  console.log(stakePool)

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
            rewardDistributorId: rewardDistributor.pubkey,
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

  const handleUpdate = async (
    values: CreationForm,
    rewardMintInfo?: splToken.MintInfo
  ) => {
    try {
      if (!wallet?.connected) {
        throw 'Wallet not connected'
      }
      if (!stakePool.data?.pubkey) {
        throw 'Stake pool pubkey not found'
      }

      const collectionPublicKeys = values.requireCollections
        .map((c) => tryPublicKey(c))
        .filter((c) => c) as PublicKey[]
      const creatorPublicKeys = values.requireCreators
        .map((c) => tryPublicKey(c))
        .filter((c) => c) as PublicKey[]

      const stakePoolParams = {
        stakePoolId: stakePool.data.pubkey,
        requiresCollections: collectionPublicKeys,
        requiresCreators: creatorPublicKeys,
        requiresAuthorization: values.requiresAuthorization,
        overlayText: values.overlayText,
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
      if (!rewardDistributor && values.rewardDistributorKind) {
        const rewardDistributorKindParams = {
          stakePoolId: stakePool.data.pubkey,
          rewardMintId: new PublicKey(values.rewardMintAddress!.trim())!,
          rewardAmount: values.rewardAmount
            ? new BN(
                parseMintNaturalAmountFromDecimal(
                  values.rewardAmount,
                  rewardMintInfo?.decimals || 1
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
                  rewardMintInfo?.decimals || 1
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
      notify({
        message:
          'Successfully updated stake pool with ID: ' +
          stakePool.data.pubkey.toString(),
        type: 'success',
      })

      await setTimeout(() => stakePool.refresh(true), 1000)
    } catch (e) {
      notify({ message: `Error updating stake pool: ${e}`, type: 'error' })
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
        <div className="my-2 h-full min-h-[55vh] rounded-md bg-white bg-opacity-5 p-10 text-gray-200">
          {!stakePool.loaded || !rewardDistributor.loaded ? (
            <div className="h-[40vh] w-full animate-pulse rounded-md bg-white bg-opacity-10"></div>
          ) : stakePool.data ? (
            <div className="grid h-full grid-cols-2 gap-4 ">
              <div>
                <p className="text-lg font-bold">Update Staking Pool</p>
                <p className="mt-1 mb-2 text-sm">
                  All parameters for staking pool are optional. If a field is
                  left
                  <b> empty</b>, it will remain unchanged
                </p>
                <StakePoolForm
                  type="update"
                  handleSubmit={handleUpdate}
                  stakePoolData={stakePool.data}
                  rewardDistributorData={rewardDistributor.data}
                />
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
                    Set the stake multiplier for given mints (separated by
                    commas).
                    <br />
                    For a 1x multiplier, enter value 100, for a 2x multiplier
                    enter value 200 ...
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
                      Allow any specific mints access to the stake pool
                      (separated by commas)
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
                  className={
                    'mt-4 inline-block rounded-md bg-blue-700 px-4 py-2'
                  }
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
