import type { AccountData } from '@cardinal/common'
import {
  pubKeyUrl,
  shortPubKey,
  withFindOrInitAssociatedTokenAccount,
} from '@cardinal/common'
import { executeTransaction } from '@cardinal/staking'
import type { RewardDistributorData } from '@cardinal/staking/dist/cjs/programs/rewardDistributor'
import type { StakePoolData } from '@cardinal/staking/dist/cjs/programs/stakePool'
import type * as splToken from '@solana/spl-token'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction } from '@solana/web3.js'
import { handleError } from 'common/errors'
import { notify } from 'common/Notification'
import { asWallet } from 'common/Wallets'
import { useFormik } from 'formik'
import { useHandleCreatePool } from 'handlers/useHandleCreatePoolNew'
import type { StakePool } from 'hooks/useAllStakePools'
import { useStakePoolsByAuthority } from 'hooks/useStakePoolsByAuthority'
import { useStakePoolsMetadatas } from 'hooks/useStakePoolsMetadata'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useMemo, useState } from 'react'
import type { Account, Mint } from 'spl-token-v3'
import { getAccount, getMint } from 'spl-token-v3'

import { MasterPanel } from '@/components/stake-pool-creation/master-panel/MasterPanel'
import type { CreationForm } from '@/components/stake-pool-creation/Schema'
import { creationFormSchema } from '@/components/stake-pool-creation/Schema'
import {
  SlavePanel,
  SlavePanelScreens,
} from '@/components/stake-pool-creation/SlavePanel'
import { SuccessPanel } from '@/components/stake-pool-creation/SuccessPanel'

const { INTRO } = SlavePanelScreens

export type StakePoolCreationFlowProps = {
  stakePoolData?: AccountData<StakePoolData>
  rewardDistributorData?: AccountData<RewardDistributorData>
  type?: 'update' | 'create'
  handleSubmit: (
    values: CreationForm,
    rewardMintInfo?: splToken.MintInfo
  ) => void
}

export const StakePoolCreationFlow = ({
  type = 'create',
  stakePoolData,
  rewardDistributorData,
}: StakePoolCreationFlowProps) => {
  const { connection, environment } = useEnvironmentCtx()
  const wallet = useWallet()
  const handleCreatePool = useHandleCreatePool()
  const stakePooldForAdmin = useStakePoolsByAuthority()
  const stakePoolsMetadata = useStakePoolsMetadatas(
    stakePooldForAdmin.data?.map((s) => s.pubkey)
  )
  const [stakePoolsWithMetadata, stakePoolsWithoutMetadata] = (
    stakePooldForAdmin.data || []
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

  const [currentStep, setCurrentStep] = useState(0)
  const [activeSlavePanelScreen, setActiveSlavePanelScreen] =
    useState<SlavePanelScreens>(INTRO)

  const initialValues: CreationForm = {
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
    maxRewardSecondsReceived: rewardDistributorData?.parsed
      .maxRewardSecondsReceived
      ? rewardDistributorData?.parsed.maxRewardSecondsReceived.toString()
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
    onSubmit: () => {},
    validationSchema: creationFormSchema,
  })
  const { values, setFieldValue } = formState

  const [submitDisabled, setSubmitDisabled] = useState<boolean>(false)
  const [_processingMintAddress, setProcessingMintAddress] =
    useState<boolean>(false)
  const [mintInfo, setMintInfo] = useState<Mint>()
  const [_userRewardAmount, setUserRewardAmount] = useState<string>()

  useMemo(async () => {
    if (values.rewardMintAddress) {
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
        const mint = new PublicKey(values.rewardMintAddress)
        const mintInfo = await getMint(connection, mint)
        setMintInfo(mintInfo)
        setFieldValue('rewardAmount', 0)
        if (
          type === 'update' &&
          values.rewardMintAddress?.toString() ===
            rewardDistributorData?.parsed.rewardMint.toString()
        ) {
          return
        }

        let userAta: Account | undefined = undefined
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
              asWallet(wallet),
              transaction,
              {}
            )
          }
          userAta = await getAccount(connection, mintAta)
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

  if (handleCreatePool.isSuccess) {
    return (
      <div className="absolute top-0 left-0 right-0 bottom-0">
        <SuccessPanel />
      </div>
    )
  }
  return (
    <div className="w-full px-10">
      <div className="mb-8 flex w-full py-8">
        <MasterPanel
          type={type}
          submitDisabled={submitDisabled}
          mintInfo={mintInfo}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          setActiveSlavePanelScreen={setActiveSlavePanelScreen}
          formState={formState}
        />
        <SlavePanel activeScreen={activeSlavePanelScreen} />
      </div>
      {currentStep === 0 &&
        stakePooldForAdmin.data &&
        stakePooldForAdmin.data?.length > 0 && (
          <>
            <div className="text-2xl font-medium">My Stake Pools</div>
            <div className="grid grid-cols-3 gap-5 py-10">
              {stakePoolsWithMetadata
                .concat(stakePoolsWithoutMetadata)
                .map((stakePool) => (
                  <div
                    key={stakePool.stakePoolData.pubkey.toString()}
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
                        <div className="mt-5 flex h-[100px] w-[100px] items-center justify-center rounded-full text-5xl text-white text-opacity-40">
                          <img
                            className="mx-auto mt-5 h-[100px] w-[100px] rounded-md"
                            src={'/cardinal-crosshair.svg'}
                            alt={stakePool.stakePoolData.pubkey.toString()}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </>
        )}
    </div>
  )
}
