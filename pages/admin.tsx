import {
  findAta,
  tryGetAccount,
  withFindOrInitAssociatedTokenAccount,
} from '@cardinal/common'
import { createStakePool, executeTransaction } from '@cardinal/staking'
import { RewardDistributorKind } from '@cardinal/staking/dist/cjs/programs/rewardDistributor'
import { getRewardDistributor } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/accounts'
import { findRewardDistributorId } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/pda'
import { withInitRewardDistributor } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/transaction'
import { StakePoolData } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { getStakePool } from '@cardinal/staking/dist/cjs/programs/stakePool/accounts'
import { AccountData } from '@cardinal/token-manager'
import { withWrapSol } from '@cardinal/token-manager/dist/cjs/wrappedSol'
import { Wallet } from '@metaplex/js'
import { BN } from '@project-serum/anchor'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
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

function Admin() {
  const { connection } = useEnvironmentCtx()
  const wallet = useWallet()

  const [overlayText, setOverlayText] = useState('')
  const [collectionAddresses, setCollectionAddresses] = useState<string>('')
  const [creatorAddresses, setCreatorAddresses] = useState<string>('')
  const [authorizeNFT, setAuthorizeNFT] = useState<boolean>(false)
  const [rewardAmount, setRewardAmount] = useState<string>('')
  const [rewardDurationSeconds, setRewardDurationSeconds] = useState<string>('')
  const [rewardMintAddress, setRewardMintAddress] = useState<string>('')
  const [rewardDistributorKind, setRewardDistributorKind] =
    useState<RewardDistributorKind>()
  const [rewardMintSupply, setRewardMintSupply] = useState<string>('')
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(true)
  const [processingMintAddress, setProcessingMintAddress] =
    useState<boolean>(false)
  const [mintInfo, setMintInfo] = useState<splToken.MintInfo>()
  const [maxMintSupply, setMaxMintSupply] = useState<number>(0)

  const [loading, setLoading] = useState<boolean>(false)
  const [stakePool, setStakePool] = useState<AccountData<StakePoolData>>()

  const FormFieldTitleInput = (props: {
    title: string
    description: string
  }) => (
    <>
      <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-200">
        {props.title}
      </label>
      <p className="mb-2 text-sm italic text-gray-300">{props.description}</p>
    </>
  )

  const handleMintAddress = async (address: String) => {
    setSubmitDisabled(true)
    setProcessingMintAddress(true)
    if (!wallet?.connected) {
      notify({
        message: `Wallet not connected`,
        type: 'error',
      })
      return
    }
    try {
      const mint = new PublicKey(address)
      const checkMint = new splToken.Token(
        connection,
        mint,
        splToken.TOKEN_PROGRAM_ID,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        null
      )
      let mintInfo = await checkMint.getMintInfo()
      const mintAta = await findAta(mint, wallet.publicKey!, true)
      let data = await checkMint.getAccountInfo(mintAta)
      if (!data) {
        notify({
          message: 'User has no associated token address for given mint',
          type: 'error',
        })
        return
      }
      setMintInfo(mintInfo)
      const decimalAmount = getMintDecimalAmountFromNaturalV2(
        mintInfo.decimals,
        new BN(data.amount)
      )
      setMaxMintSupply(Number(decimalAmount.toFixed(3)))
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
        (!rewardAmount && rewardDurationSeconds) ||
        (rewardAmount && !rewardDurationSeconds)
      ) {
        throw 'Both reward amount and reward duration must be specified'
      }
      if ((rewardAmount || rewardMintAddress) && !rewardDistributorKind) {
        throw 'Reward distribution must be specified (cannot be none)'
      }
      if (
        (rewardAmount || rewardMintAddress || rewardDistributorKind) &&
        (!rewardAmount || !rewardMintAddress)
      ) {
        throw 'Please fill out all the fields for reward distribution paramters'
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
        requiresCollections:
          collectionPublicKeys.length > 0 ? collectionPublicKeys : undefined,
        requiresCreators:
          creatorPublicKeys.length > 0 ? creatorPublicKeys : undefined,
        requiresAuthorization: authorizeNFT,
        overlayText: overlayText.length > 0 ? overlayText : undefined,
      }

      const [transaction, stakePoolPK] = await createStakePool(
        connection,
        wallet as Wallet,
        stakePoolParams
      )

      if (rewardDistributorKind) {
        const rewardDistributorKindParams = {
          stakePoolId: stakePoolPK,
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

  const customStyles = {
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

  return (
    <div>
      <Head>
        <title>Cardinal Staking UI</title>
        <meta name="description" content="Generated by Cardinal Staking UI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <div className="container mx-auto max-h-[90vh] w-full bg-[#1a1b20]">
          <Header />
          <div className="my-2 grid h-full grid-cols-1 gap-4">
            <div className="rounded-md bg-white bg-opacity-5 p-10 text-gray-200">
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
                      value={overlayText}
                      onChange={(e) => {
                        setOverlayText(e.target.value)
                      }}
                    />
                  </div>
                </div>
                <div className="-mx-3 flex flex-wrap">
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
                <div className="-mx-3 flex flex-wrap">
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
                                    console.log(
                                      supply,
                                      !supply,
                                      e.target.value.length != 0
                                    )
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
                <button
                  disabled={rewardDistributorKind && submitDisabled}
                  type="button"
                  className={
                    submitDisabled && rewardDistributorKind
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin
