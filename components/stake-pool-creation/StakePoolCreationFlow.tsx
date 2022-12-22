import type { AccountData } from '@cardinal/common'
import { withFindOrInitAssociatedTokenAccount } from '@cardinal/common'
import { executeTransaction } from '@cardinal/staking'
import type { RewardDistributorData } from '@cardinal/staking/dist/cjs/programs/rewardDistributor'
import type { StakePoolData } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction } from '@solana/web3.js'
import { handleError } from 'common/errors'
import { notify } from 'common/Notification'
import { asWallet } from 'common/Wallets'
import { useFormik } from 'formik'
import { useHandleCreationForm } from 'handlers/useHandleCreationForm'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useEffect, useMemo, useState } from 'react'
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

const {
  INTRO,
  AUTHORIZATION_1,
  REWARD_DISTRIBUTION_2,
  TIME_BASED_PARAMETERS_1,
} = SlavePanelScreens

export type StakePoolCreationFlowProps = {
  stakePoolData?: AccountData<StakePoolData>
  rewardDistributorData?: AccountData<RewardDistributorData>
  type?: 'update' | 'create'
}

const initialSlaveScreenPerStep = [
  INTRO,
  AUTHORIZATION_1,
  REWARD_DISTRIBUTION_2,
  TIME_BASED_PARAMETERS_1,
]

export const StakePoolCreationFlow = ({
  type = 'create',
  stakePoolData,
  rewardDistributorData,
}: StakePoolCreationFlowProps) => {
  const { connection } = useEnvironmentCtx()
  const wallet = useWallet()
  const handleCreationForm = useHandleCreationForm()

  const [currentStep, setCurrentStep] = useState(0)
  const [activeSlavePanelScreen, setActiveSlavePanelScreen] =
    useState<SlavePanelScreens>(INTRO)
  const [stakePoolId, setStakePoolId] = useState<PublicKey>()

  const initialValues: CreationForm = {
    requireCollections: (stakePoolData?.parsed.requiresCollections ?? []).map(
      (pk) => pk.toString()
    ),
    requireCreators: (stakePoolData?.parsed.requiresCreators ?? []).map((pk) =>
      pk.toString()
    ),
    requiresAuthorization: stakePoolData?.parsed.requiresAuthorization ?? false,
    resetOnStake: stakePoolData?.parsed.resetOnStake ?? false,
    cooldownPeriodSeconds: stakePoolData?.parsed.cooldownSeconds ?? undefined,
    minStakeSeconds: stakePoolData?.parsed.minStakeSeconds ?? undefined,
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
    if (!values.rewardMintAddress) {
      setMintInfo(undefined)
      return
    }
    if (values.rewardMintAddress) {
      if (!wallet?.connected || !wallet.publicKey) {
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
            wallet.publicKey,
            wallet.publicKey,
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

  const autoSelectFirstSlaveScreen = () => {
    if (!initialSlaveScreenPerStep[currentStep]) return
    setActiveSlavePanelScreen(initialSlaveScreenPerStep[currentStep] || INTRO)
  }

  useEffect(() => {
    autoSelectFirstSlaveScreen()
  }, [currentStep])

  if (handleCreationForm.isSuccess) {
    return <SuccessPanel stakePoolId={stakePoolId} />
  }

  return (
    <div className="flex h-[85vh] min-h-[550px] py-8">
      <MasterPanel
        activeSlavePanelScreen={activeSlavePanelScreen}
        type={type}
        submitDisabled={submitDisabled}
        mintInfo={mintInfo}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        setActiveSlavePanelScreen={setActiveSlavePanelScreen}
        formState={formState}
        handleSubmit={() =>
          handleCreationForm.mutate(
            {
              values: formState.values,
              mintInfo: mintInfo,
            },
            {
              onSuccess: ([, publicKey]) => setStakePoolId(publicKey),
            }
          )
        }
        isLoading={handleCreationForm.isLoading}
      />
      <SlavePanel activeScreen={activeSlavePanelScreen} />
    </div>
  )
}
