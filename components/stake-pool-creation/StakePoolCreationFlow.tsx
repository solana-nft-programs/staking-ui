import type { AccountData } from '@cardinal/common'
import { withFindOrInitAssociatedTokenAccount } from '@cardinal/common'
import { executeTransaction } from '@cardinal/staking'
import type { RewardDistributorData } from '@cardinal/staking/dist/cjs/programs/rewardDistributor'
import type { StakePoolData } from '@cardinal/staking/dist/cjs/programs/stakePool'
import * as splToken from '@solana/spl-token'
import { useWallet } from '@solana/wallet-adapter-react'
import { Keypair, PublicKey, Transaction } from '@solana/web3.js'
import { handleError } from 'common/errors'
import { notify } from 'common/Notification'
import { asWallet } from 'common/Wallets'
import { useFormik } from 'formik'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useMemo, useState } from 'react'

import { MasterPanel } from '@/components/stake-pool-creation/master-panel/MasterPanel'
import type { CreationForm } from '@/components/stake-pool-creation/Schema'
import { creationFormSchema } from '@/components/stake-pool-creation/Schema'
import {
  SlavePanel,
  SlavePanelScreens,
} from '@/components/stake-pool-creation/SlavePanel'

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
  const { connection } = useEnvironmentCtx()
  const wallet = useWallet()

  const [currentStep, setCurrentStep] = useState(0)
  const [activeSlavePanelScreen, setActiveSlavePanelScreen] =
    useState<SlavePanelScreens>(INTRO)

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
  const { values, errors, setFieldValue, handleChange } = formState

  const [submitDisabled, setSubmitDisabled] = useState<boolean>(true)
  const [processingMintAddress, setProcessingMintAddress] =
    useState<boolean>(false)
  const [mintInfo, setMintInfo] = useState<splToken.MintInfo>()
  const [userRewardAmount, setUserRewardAmount] = useState<string>()

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
        const mintInfo = await checkMint.getMintInfo()
        setMintInfo(mintInfo)
        setFieldValue('rewardAmount', 0)
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
              asWallet(wallet),
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
    <div className="mb-8 flex w-full py-8 px-10">
      <MasterPanel
        mintInfo={mintInfo}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        setActiveSlavePanelScreen={setActiveSlavePanelScreen}
        formState={formState}
      />
      <SlavePanel activeScreen={activeSlavePanelScreen} />
    </div>
  )
}
