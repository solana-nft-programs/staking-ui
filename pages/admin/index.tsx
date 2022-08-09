import {
  createStakePool,
  executeTransaction,
  handleError,
} from '@cardinal/staking'
import { withInitRewardDistributor } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/transaction'
import { Wallet } from '@metaplex/js'
import { BN } from '@project-serum/anchor'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { Header } from 'common/Header'
import { notify } from 'common/Notification'
import Head from 'next/head'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import * as splToken from '@solana/spl-token'
import { useState } from 'react'
import { Placeholder } from 'pages'
import { pubKeyUrl, shortPubKey } from 'common/utils'
import { FaQuestion } from 'react-icons/fa'
import { useStakePoolsByAuthority } from 'hooks/useStakePoolsByAuthority'
import { useStakePoolsMetadatas } from 'hooks/useStakePoolsMetadata'
import { Footer } from 'common/Footer'
import { tryPublicKey } from 'common/utils'
import { CreationForm, StakePoolForm } from 'components/StakePoolForm'
import { StakePool } from 'hooks/useAllStakePools'

function Admin() {
  const { connection, environment } = useEnvironmentCtx()
  const wallet = useWallet()
  const [stakePoolId, setStakePoolId] = useState<PublicKey>()

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

  const handleCreation = async (
    values: CreationForm,
    rewardMintInfo?: splToken.MintInfo
  ) => {
    setStakePoolId(undefined)
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
        !values.rewardAmount &&
        !values.rewardMintAddress &&
        values.rewardDistributorKind
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

      // format date
      let dateInNum: number | undefined = new Date(
        values.endDate?.toString() || ''
      ).getTime()
      if (dateInNum < Date.now()) {
        dateInNum = undefined
      }
      const stakePoolParams = {
        requiresCollections:
          collectionPublicKeys.length > 0 ? collectionPublicKeys : undefined,
        requiresCreators:
          creatorPublicKeys.length > 0 ? creatorPublicKeys : undefined,
        requiresAuthorization: values.requiresAuthorization,
        resetOnStake: values.resetOnStake,
        overlayText: values.overlayText || undefined,
        cooldownSeconds: values.cooldownPeriodSeconds || 0,
        endDate: dateInNum ? new BN(dateInNum / 1000) : undefined,
      }
      const [transaction, stakePoolPK] = await createStakePool(
        connection,
        wallet as Wallet,
        stakePoolParams
      )

      if (values.rewardDistributorKind) {
        if (Number(values.rewardDurationSeconds) < 1) {
          throw 'RewardDurationSeconds needs to greater or equal to 1'
        }
        const rewardDistributorKindParams = {
          stakePoolId: stakePoolPK,
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
          multiplerDecimals: values.multiplierDecimals
            ? parseInt(values.multiplierDecimals)
            : undefined,
          defaultMultiplier: values.defaultMultiplier
            ? new BN(values.defaultMultiplier)
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
      setStakePoolId(stakePoolPK)

      notify({
        message:
          'Successfully created stake pool with ID: ' + stakePoolPK.toString(),
        type: 'success',
      })
      // const stakePoolData = await getStakePool(connection, stakePoolPK)
    } catch (e) {
      console.log(e)
      notify({
        message: handleError(e, `Error creating stake pool: ${e}`),
        type: 'error',
      })
    }
  }

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
        <div className="mx-10 my-2 grid h-full grid-cols-2 gap-4 rounded-md bg-white bg-opacity-5 p-10 text-gray-200">
          <div>
            <p className="text-lg font-bold">Create Staking Pool</p>
            <p className="mt-1 mb-2 text-sm">
              All parameters for staking pool are optional
            </p>
            {stakePoolId && (
              <div className="rounded-lg bg-green-600 bg-opacity-20 p-4">
                <p className="font-bold">Successfully created Stake Pool.</p>
                <p>
                  Make sure you <b>SAVE THE POOL ID</b>
                  {/* and identifier */}
                </p>
                <p className="mt-2">
                  <b>Pool ID:</b> {stakePoolId.toString()} <br />{' '}
                  {/* <b>Identifier:</b> {stakePool.parsed.identifier.toString()} */}
                </p>
              </div>
            )}
            <StakePoolForm handleSubmit={handleCreation} />
          </div>
          <div>
            <div className="mb-5 text-lg font-bold">Your pools</div>
            <div className="grid grid-cols-3 gap-5">
              {!stakePools.isFetched && !stakePoolsMetadata.isFetched ? (
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
                            environment.label !== 'mainnet-beta'
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
                  {!wallet.connected
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
