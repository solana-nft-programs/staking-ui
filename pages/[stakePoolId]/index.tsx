import {
  createStakeEntryAndStakeMint,
  stake,
  unstake,
  claimRewards,
} from '@cardinal/staking'
import { ReceiptType } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, Signer, Transaction } from '@solana/web3.js'
import { Header } from 'common/Header'
import Head from 'next/head'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useState } from 'react'
import { Wallet } from '@metaplex/js'
import { LoadingSpinner } from 'common/LoadingSpinner'
import { notify } from 'common/Notification'
import { pubKeyUrl, secondstoDuration } from 'common/utils'
import {
  formatAmountAsDecimal,
  formatMintNaturalAmountAsDecimal,
  getMintDecimalAmountFromNatural,
  getMintDecimalAmountFromNaturalV2,
  parseMintNaturalAmountFromDecimal,
} from 'common/units'
import { BN } from '@project-serum/anchor'
import {
  StakeEntryTokenData,
  useStakedTokenDatas,
} from 'hooks/useStakedTokenDatas'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { useRewards } from 'hooks/useRewards'
import { useRewardMintInfo } from 'hooks/useRewardMintInfo'
import { AllowedTokens } from 'components/AllowedTokens'
import { useStakePoolEntries } from 'hooks/useStakePoolEntries'
import { useStakePoolData } from 'hooks/useStakePoolData'
import { useStakePoolMaxStaked } from 'hooks/useStakePoolMaxStaked'
import {
  AllowedTokenData,
  useAllowedTokenDatas,
} from 'hooks/useAllowedTokenDatas'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'
import { defaultSecondaryColor } from 'api/mapping'
import { Footer } from 'common/Footer'
import { DisplayAddress, shortPubKey } from '@cardinal/namespaces-components'
import { useRewardDistributorTokenAccount } from 'hooks/useRewardDistributorTokenAccount'
import { useRewardEntries } from 'hooks/useRewardEntries'
import { Switch } from '@headlessui/react'
import { FaInfoCircle } from 'react-icons/fa'
import { MouseoverTooltip } from 'common/Tooltip'
import { useUTCNow } from 'providers/UTCNowProvider'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { executeAllTransactions } from 'api/utils'
import { RewardDistributorKind } from '@cardinal/staking/dist/cjs/programs/rewardDistributor'
import { useRouter } from 'next/router'
import { lighten } from '@mui/material'

function Home() {
  const router = useRouter()
  const { connection, environment } = useEnvironmentCtx()
  const wallet = useWallet()
  const walletModal = useWalletModal()
  const { data: stakePool, isFetched: stakePoolLoaded } = useStakePoolData()
  const stakedTokenDatas = useStakedTokenDatas()
  const rewardDistributorData = useRewardDistributorData()
  const rewardMintInfo = useRewardMintInfo()
  const stakePoolEntries = useStakePoolEntries()
  const maxStaked = useStakePoolMaxStaked()
  const rewardEntries = useRewardEntries()
  const rewards = useRewards()

  const [unstakedSelected, setUnstakedSelected] = useState<AllowedTokenData[]>(
    []
  )
  const [stakedSelected, setStakedSelected] = useState<StakeEntryTokenData[]>(
    []
  )
  const [loadingStake, setLoadingStake] = useState(false)
  const [loadingUnstake, setLoadingUnstake] = useState(false)
  const [receiptType, setReceiptType] = useState<ReceiptType>(
    ReceiptType.Original
  )
  const [loadingClaimRewards, setLoadingClaimRewards] = useState(false)
  const [showFungibleTokens, setShowFungibleTokens] = useState(false)
  const [showAllowedTokens, setShowAllowedTokens] = useState<boolean>()
  const allowedTokenDatas = useAllowedTokenDatas(showFungibleTokens)
  const { data: stakePoolMetadata } = useStakePoolMetadata()
  const rewardDistributorTokenAccountData = useRewardDistributorTokenAccount()
  const { UTCNow } = useUTCNow()

  if (stakePoolMetadata?.redirect) {
    router.push(stakePoolMetadata?.redirect)
    return
  }

  async function handleClaimRewards() {
    if (stakedSelected.length > 4) {
      notify({ message: `Limit of 4 tokens at a time reached`, type: 'error' })
      return
    }
    setLoadingClaimRewards(true)
    if (!wallet) {
      throw new Error('Wallet not connected')
    }
    if (!stakePool) {
      notify({ message: `No stake pool detected`, type: 'error' })
      return
    }

    const txs: (Transaction | null)[] = await Promise.all(
      stakedSelected.map(async (token) => {
        try {
          if (!token || !token.stakeEntry) {
            throw new Error('No stake entry for token')
          }
          return claimRewards(connection, wallet as Wallet, {
            stakePoolId: stakePool.pubkey,
            stakeEntryId: token.stakeEntry.pubkey,
          })
        } catch (e) {
          notify({
            message: `${e}`,
            description: `Failed to claim rewards for token ${token?.stakeEntry?.pubkey.toString()}`,
            type: 'error',
          })
          return null
        }
      })
    )

    try {
      await executeAllTransactions(
        connection,
        wallet as Wallet,
        txs.filter((tx): tx is Transaction => tx !== null),
        {
          notificationConfig: {
            message: 'Successfully claimed rewards',
            description: 'These rewards are now available in your wallet',
          },
        }
      )
    } catch (e) {}

    rewardDistributorData.remove()
    rewardDistributorTokenAccountData.remove()
    setLoadingClaimRewards(false)
  }

  async function handleUnstake() {
    if (!wallet.connected) {
      notify({ message: `Wallet not connected`, type: 'error' })
      return
    }
    if (!stakePool) {
      notify({ message: `No stake pool detected`, type: 'error' })
      return
    }
    setLoadingUnstake(true)

    const txs: (Transaction | null)[] = await Promise.all(
      stakedSelected.map(async (token) => {
        try {
          if (!token || !token.stakeEntry) {
            throw new Error('No stake entry for token')
          }
          if (
            stakePool.parsed.cooldownSeconds &&
            !token.stakeEntry?.parsed.cooldownStartSeconds
          ) {
            notify({
              message: `Cooldown period will be initiated for ${token.metaplexData?.data.data.name}`,
              type: 'info',
            })
          }
          return unstake(connection, wallet as Wallet, {
            stakePoolId: stakePool?.pubkey,
            originalMintId: token.stakeEntry.parsed.originalMint,
          })
        } catch (e) {
          notify({
            message: `${e}`,
            description: `Failed to unstake token ${token?.stakeEntry?.pubkey.toString()}`,
            type: 'error',
          })
          return null
        }
      })
    )

    try {
      await executeAllTransactions(
        connection,
        wallet as Wallet,
        txs.filter((tx): tx is Transaction => tx !== null),
        {
          notificationConfig: {
            message: 'Successfully unstaked',
            description: 'These tokens are now available in your wallet',
          },
        }
      )
    } catch (e) {}

    await Promise.all([
      stakedTokenDatas.remove(),
      allowedTokenDatas.remove(),
      stakePoolEntries.remove(),
    ]).then(() =>
      setTimeout(() => {
        stakedTokenDatas.refetch()
        allowedTokenDatas.refetch()
        stakePoolEntries.refetch()
      }, 2000)
    )
    setStakedSelected([])
    setUnstakedSelected([])
    setLoadingUnstake(false)
  }

  async function handleStake() {
    if (!wallet.connected) {
      notify({ message: `Wallet not connected`, type: 'error' })
      return
    }
    if (!stakePool) {
      notify({ message: `Wallet not connected`, type: 'error' })
      return
    }
    setLoadingStake(true)

    const initTxs: { tx: Transaction; signers: Signer[] }[] = []
    for (let step = 0; step < unstakedSelected.length; step++) {
      try {
        let token = unstakedSelected[step]
        if (!token || !token.tokenAccount) {
          throw new Error('Token account not set')
        }

        if (
          token.tokenAccount?.account.data.parsed.info.tokenAmount.amount > 1 &&
          !token.amountToStake
        ) {
          throw new Error('Invalid amount chosen for token')
        }

        if (token.stakeEntry && token.stakeEntry.parsed.amount.toNumber() > 0) {
          throw new Error(
            'Fungible tokens already staked in the pool. Staked tokens need to be unstaked and then restaked together with the new tokens.'
          )
        }

        if (receiptType === ReceiptType.Receipt) {
          console.log('Creating stake entry and stake mint...')
          const [initTx, , stakeMintKeypair] =
            await createStakeEntryAndStakeMint(connection, wallet as Wallet, {
              stakePoolId: stakePool?.pubkey,
              originalMintId: new PublicKey(
                token.tokenAccount.account.data.parsed.info.mint
              ),
            })
          if (initTx.instructions.length > 0) {
            initTxs.push({
              tx: initTx,
              signers: stakeMintKeypair ? [stakeMintKeypair] : [],
            })
          }
        }
      } catch (e) {
        notify({
          message: `Failed to unstake token ${unstakedSelected[
            step
          ]?.stakeEntry?.pubkey.toString()}`,
          description: `${e}`,
          type: 'error',
        })
      }
    }

    if (initTxs.length > 0) {
      try {
        await executeAllTransactions(
          connection,
          wallet as Wallet,
          initTxs.map(({ tx }) => tx),
          {
            signers: initTxs.map(({ signers }) => signers),
            notificationConfig: {
              message: `Successfully staked`,
              description: 'Stake progress will now dynamically update',
            },
          }
        )
      } catch (e) {}
    }

    const txs: (Transaction | null)[] = await Promise.all(
      unstakedSelected.map(async (token) => {
        try {
          if (!token || !token.tokenAccount) {
            throw new Error('Token account not set')
          }

          if (
            token.tokenAccount?.account.data.parsed.info.tokenAmount.amount >
              1 &&
            !token.amountToStake
          ) {
            throw new Error('Invalid amount chosen for token')
          }

          if (
            token.stakeEntry &&
            token.stakeEntry.parsed.amount.toNumber() > 0
          ) {
            throw new Error(
              'Fungible tokens already staked in the pool. Staked tokens need to be unstaked and then restaked together with the new tokens.'
            )
          }

          const amount = token?.amountToStake
            ? new BN(
                token?.amountToStake && token.tokenListData
                  ? parseMintNaturalAmountFromDecimal(
                      token?.amountToStake,
                      token.tokenListData.decimals
                    ).toString()
                  : 1
              )
            : undefined
          // stake
          return stake(connection, wallet as Wallet, {
            stakePoolId: stakePool?.pubkey,
            receiptType:
              !amount || (amount && amount.eq(new BN(1)))
                ? receiptType
                : undefined,
            originalMintId: new PublicKey(
              token.tokenAccount.account.data.parsed.info.mint
            ),
            userOriginalMintTokenAccountId: token.tokenAccount?.pubkey,
            amount: amount,
          })
        } catch (e) {
          notify({
            message: `Failed to unstake token ${token?.stakeEntry?.pubkey.toString()}`,
            description: `${e}`,
            type: 'error',
          })
          return null
        }
      })
    )

    try {
      await executeAllTransactions(
        connection,
        wallet as Wallet,
        txs.filter((tx): tx is Transaction => tx !== null),
        {
          notificationConfig: {
            message: `Successfully staked`,
            description: 'Stake progress will now dynamically update',
          },
        }
      )
    } catch (e) {}

    await Promise.all([
      stakedTokenDatas.remove(),
      allowedTokenDatas.remove(),
      stakePoolEntries.remove(),
    ]).then(() =>
      setTimeout(() => {
        stakedTokenDatas.refetch()
        allowedTokenDatas.refetch()
        stakePoolEntries.refetch()
      }, 2000)
    )
    setStakedSelected([])
    setUnstakedSelected([])
    setLoadingStake(false)
  }

  const isUnstakedTokenSelected = (tk: AllowedTokenData) =>
    unstakedSelected.some(
      (utk) =>
        utk.tokenAccount?.account.data.parsed.info.mint.toString() ===
        tk.tokenAccount?.account.data.parsed.info.mint.toString()
    )
  const isStakedTokenSelected = (tk: StakeEntryTokenData) =>
    stakedSelected.some(
      (stk) =>
        stk.stakeEntry?.parsed.originalMint.toString() ===
        tk.stakeEntry?.parsed.originalMint.toString()
    )

  return (
    <div style={{ background: stakePoolMetadata?.colors?.primary }}>
      <Head>
        <title>Cardinal Staking UI</title>
        <meta name="description" content="Generated by Cardinal Staking UI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <div className={`container mx-auto w-full`}>
        {(!stakePool && stakePoolLoaded) || stakePoolMetadata?.notFound ? (
          <div
            className="mx-5 mb-5 rounded-md border-[1px] bg-opacity-40 p-4 text-center text-lg font-semibold"
            style={{
              background:
                stakePoolMetadata?.colors?.secondary || defaultSecondaryColor,
              color: stakePoolMetadata?.colors?.fontColor,
              borderColor: lighten(
                stakePoolMetadata?.colors?.secondary || defaultSecondaryColor,
                0.5
              ),
            }}
          >
            Stake pool not found
          </div>
        ) : (
          !wallet.connected && (
            <div
              className="mx-5 mb-5 cursor-pointer rounded-md border-[1px] bg-opacity-40 p-4 text-center text-lg font-semibold"
              style={{
                background:
                  stakePoolMetadata?.colors?.secondary || defaultSecondaryColor,
                color: stakePoolMetadata?.colors?.fontColor,
                borderColor: lighten(
                  stakePoolMetadata?.colors?.secondary || defaultSecondaryColor,
                  0.5
                ),
              }}
              onClick={() => walletModal.setVisible(true)}
            >
              Connect wallet to continue
            </div>
          )
        )}
        {(maxStaked || rewardDistributorData) && !stakePoolMetadata?.notFound && (
          <div
            className="mx-5 mb-4 flex flex-wrap items-center gap-4 rounded-md bg-white bg-opacity-5 px-10 py-6 text-gray-200 md:flex-row md:justify-between"
            style={{
              border: stakePoolMetadata?.colors?.accent
                ? `2px solid ${stakePoolMetadata?.colors?.accent}`
                : '',
            }}
          >
            {stakePoolEntries.data ? (
              <>
                <div className="inline-block text-lg">
                  Total Staked: {stakePoolEntries.data?.length}
                </div>
                {maxStaked > 0 && (
                  <div className="inline-block text-lg">
                    {/*TODO: Change how many total NFTs can possibly be staked for your collection (default 10000) */}
                    Percent Staked:{' '}
                    {stakePoolEntries.data?.length &&
                      Math.floor(
                        ((stakePoolEntries.data?.length * 100) / maxStaked) *
                          10000
                      ) / 10000}
                    %
                  </div>
                )}
              </>
            ) : (
              <div className="relative flex h-8 flex-grow items-center justify-center">
                <span className="text-gray-500">Loading pool info...</span>
                <div className="absolute w-full animate-pulse items-center justify-center rounded-lg bg-white bg-opacity-10 p-5"></div>
              </div>
            )}
            {rewardDistributorData.data && rewardMintInfo.data ? (
              <>
                <div className="inline-block text-lg">
                  <span>Rewards Rate</span>:{' '}
                  <span>
                    {(
                      (Number(
                        getMintDecimalAmountFromNatural(
                          rewardMintInfo.data.mintInfo,
                          new BN(rewardDistributorData.data.parsed.rewardAmount)
                        )
                      ) /
                        rewardDistributorData.data.parsed.rewardDurationSeconds.toNumber()) *
                      86400 *
                      (rewardDistributorData.data.parsed.defaultMultiplier.toNumber() /
                        10 **
                          rewardDistributorData.data.parsed.multiplierDecimals)
                    ).toPrecision(4)}{' '}
                    <a
                      className="text-white underline"
                      target="_blank"
                      href={pubKeyUrl(
                        rewardDistributorData.data.parsed.rewardMint,
                        environment.label
                      )}
                    >
                      {rewardMintInfo.data.tokenListData?.name}
                    </a>{' '}
                    / Day
                  </span>
                </div>
                <div className="flex min-w-[200px] flex-col text-lg">
                  {!rewardMintInfo.isFetched || !rewards.data ? (
                    <div className="relative flex h-10 w-full items-center justify-center">
                      <span className="text-gray-500"></span>
                      <div className="absolute w-full animate-pulse items-center justify-center rounded-lg bg-white bg-opacity-10 p-5"></div>
                    </div>
                  ) : (
                    rewards.data && (
                      <>
                        <div>
                          Earnings:{' '}
                          {formatMintNaturalAmountAsDecimal(
                            rewardMintInfo.data.mintInfo,
                            rewards.data?.claimableRewards,
                            6
                          )}{' '}
                          {rewardMintInfo.data.tokenListData?.name ?? '???'}
                        </div>
                        <div className="text-xs text-gray-500">
                          <a
                            target={'_blank'}
                            href={pubKeyUrl(
                              rewardDistributorData.data.pubkey,
                              environment.label
                            )}
                          >
                            {shortPubKey(rewardDistributorData.data.pubkey)}
                          </a>{' '}
                          {rewardDistributorData.data.parsed.kind ===
                          RewardDistributorKind.Mint
                            ? formatMintNaturalAmountAsDecimal(
                                rewardMintInfo.data.mintInfo,
                                rewardMintInfo.data.mintInfo.supply,
                                6
                              )
                            : rewardDistributorTokenAccountData.data
                            ? formatMintNaturalAmountAsDecimal(
                                rewardMintInfo.data.mintInfo,
                                rewardDistributorTokenAccountData.data?.amount,
                                6
                              )
                            : '??'}{' '}
                          Left
                        </div>
                      </>
                    )
                  )}
                </div>
              </>
            ) : (
              <div className="relative flex flex-grow items-center justify-center">
                {!(
                  rewardDistributorData.isFetched && rewardMintInfo.isFetched
                ) && (
                  <>
                    <span className="text-gray-500">Loading rewards...</span>
                    <div className="absolute w-full animate-pulse items-center justify-center rounded-lg bg-white bg-opacity-10 p-5"></div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
        <div className="my-2 mx-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div
            className={`flex-col rounded-md bg-white bg-opacity-5 p-10 text-gray-200`}
            style={{
              border: stakePoolMetadata?.colors?.accent
                ? `2px solid ${stakePoolMetadata?.colors?.accent}`
                : '',
            }}
          >
            <div className="mt-2 flex w-full flex-row justify-between">
              <div className="flex flex-row">
                <p className="mb-3 mr-3 inline-block text-lg">
                  Select Your Tokens
                </p>
                <div className="inline-block">
                  {allowedTokenDatas.isRefetching &&
                    allowedTokenDatas.isFetched && (
                      <LoadingSpinner height="25px" />
                    )}
                </div>
              </div>

              <div className="flex flex-row">
                <button
                  onClick={() => setShowAllowedTokens(!showAllowedTokens)}
                  className="text-md mr-5 inline-block rounded-md bg-white bg-opacity-5 px-4 py-1 hover:bg-opacity-10 focus:outline-none"
                >
                  {showAllowedTokens ? 'Hide' : 'Show'} Allowed Tokens
                </button>
                <button
                  onClick={() => {
                    setShowFungibleTokens(!showFungibleTokens)
                  }}
                  className="text-md inline-block rounded-md bg-white bg-opacity-5 px-4 py-1 hover:bg-opacity-10"
                >
                  {showFungibleTokens ? 'Show NFTs' : 'Show FTs'}
                </button>
              </div>
            </div>
            {showAllowedTokens && (
              <AllowedTokens stakePool={stakePool}></AllowedTokens>
            )}
            <div className="my-3 flex-auto overflow-auto">
              <div className="relative my-auto mb-4 h-[60vh] overflow-y-auto overflow-x-hidden rounded-md bg-white bg-opacity-5 p-5">
                {!allowedTokenDatas.isFetched ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="h-[200px] animate-pulse rounded-lg bg-white bg-opacity-5 p-10"></div>
                    <div className="h-[200px] animate-pulse rounded-lg bg-white bg-opacity-5 p-10"></div>
                    <div className="h-[200px] animate-pulse rounded-lg bg-white bg-opacity-5 p-10"></div>
                  </div>
                ) : (allowedTokenDatas.data || []).length == 0 ? (
                  <p className="text-gray-400">
                    No allowed tokens found in wallet.
                  </p>
                ) : (
                  <div
                    className={
                      'grid grid-cols-2 gap-4 lg:grid-cols-2 xl:grid-cols-3'
                    }
                  >
                    {(
                      (!stakePoolMetadata?.notFound &&
                        allowedTokenDatas.data) ||
                      []
                    ).map((tk) => (
                      <div key={tk.tokenAccount?.pubkey.toString()}>
                        <div className="relative w-44 md:w-auto 2xl:w-48">
                          <label
                            htmlFor={tk?.tokenAccount?.pubkey.toBase58()}
                            className="relative"
                          >
                            <div className="relative">
                              <div>
                                <div className="relative">
                                  {loadingStake && isUnstakedTokenSelected(tk) && (
                                    <div>
                                      <div className="absolute top-0 left-0 z-10 flex h-full w-full justify-center rounded-xl bg-black bg-opacity-80  align-middle">
                                        <div className="my-auto flex">
                                          <span className="mr-2">
                                            <LoadingSpinner height="25px" />
                                          </span>
                                          Staking token...
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  <img
                                    className="mx-auto mt-4 mb-2 rounded-xl bg-white bg-opacity-5 object-contain md:h-40 md:w-40 2xl:h-48 2xl:w-48"
                                    src={
                                      tk.metadata?.data.image ||
                                      tk.tokenListData?.logoURI
                                    }
                                    alt={
                                      tk.metadata?.data.name ||
                                      tk.tokenListData?.name
                                    }
                                  />
                                </div>
                                {tk.tokenListData && (
                                  <div className="absolute bottom-2 left-2">
                                    {Number(
                                      (
                                        tk.tokenAccount?.account.data.parsed
                                          .info.tokenAmount.amount /
                                        10 ** tk.tokenListData.decimals
                                      ).toFixed(2)
                                    )}{' '}
                                    {tk.tokenListData.symbol}
                                  </div>
                                )}
                              </div>

                              <input
                                disabled={loadingStake || loadingUnstake}
                                placeholder={
                                  tk.tokenAccount?.account.data.parsed.info
                                    .tokenAmount.amount > 1
                                    ? '1'
                                    : ''
                                }
                                autoComplete="off"
                                type={
                                  tk.tokenAccount?.account.data.parsed.info
                                    .tokenAmount.amount > 1
                                    ? 'text'
                                    : 'checkbox'
                                }
                                className={`absolute h-4 ${
                                  tk.tokenAccount?.account.data.parsed.info
                                    .tokenAmount.amount > 1
                                    ? `w-20 py-3 px-2 text-right`
                                    : 'w-4'
                                } top-2 right-2 rounded-sm font-medium text-black focus:outline-none`}
                                id={tk?.tokenAccount?.pubkey.toBase58()}
                                name={tk?.tokenAccount?.pubkey.toBase58()}
                                checked={isUnstakedTokenSelected(tk)}
                                value={
                                  isUnstakedTokenSelected(tk)
                                    ? tk.amountToStake || 0
                                    : 0
                                }
                                onChange={(e) => {
                                  const amount = Number(e.target.value)
                                  if (
                                    tk.tokenAccount?.account.data.parsed.info
                                      .tokenAmount.amount > 1
                                  ) {
                                    let newUnstakedSelected =
                                      unstakedSelected.filter(
                                        (data) =>
                                          data.tokenAccount?.account.data.parsed.info.mint.toString() !==
                                          tk.tokenAccount?.account.data.parsed.info.mint.toString()
                                      )
                                    if (
                                      !amount &&
                                      e.target.value.length != 0 &&
                                      amount !== 0
                                    ) {
                                      notify({
                                        message: 'Please enter a valid amount',
                                        type: 'error',
                                      })
                                    } else {
                                      tk.amountToStake =
                                        e.target.value.toString()
                                      newUnstakedSelected = [
                                        ...newUnstakedSelected,
                                        tk,
                                      ]
                                    }
                                    setUnstakedSelected(newUnstakedSelected)
                                  } else {
                                    if (isUnstakedTokenSelected(tk)) {
                                      setUnstakedSelected(
                                        unstakedSelected.filter(
                                          (data) =>
                                            data.tokenAccount?.account.data.parsed.info.mint.toString() !==
                                            tk.tokenAccount?.account.data.parsed.info.mint.toString()
                                        )
                                      )
                                    } else {
                                      setUnstakedSelected([
                                        ...unstakedSelected,
                                        tk,
                                      ])
                                    }
                                  }
                                }}
                              />
                            </div>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between">
              {!stakePoolMetadata?.receiptType && !showFungibleTokens ? (
                <MouseoverTooltip
                  title={
                    receiptType === ReceiptType.Original
                      ? 'Lock the original token(s) in your wallet when you stake'
                      : 'Receive a dynamically generated NFT receipt representing your stake'
                  }
                >
                  <div className="flex cursor-pointer flex-row gap-2">
                    <Switch
                      checked={receiptType === ReceiptType.Original}
                      onChange={() =>
                        setReceiptType(
                          receiptType === ReceiptType.Original
                            ? ReceiptType.Receipt
                            : ReceiptType.Original
                        )
                      }
                      style={{
                        background:
                          stakePoolMetadata?.colors?.secondary ||
                          defaultSecondaryColor,
                        color: stakePoolMetadata?.colors?.fontColor,
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full`}
                    >
                      <span className="sr-only">Receipt Type</span>
                      <span
                        className={`${
                          receiptType === ReceiptType.Original
                            ? 'translate-x-6'
                            : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white`}
                      />
                    </Switch>
                    <div className="flex items-center gap-1">
                      <span
                        style={{
                          color: stakePoolMetadata?.colors?.fontColor,
                        }}
                      >
                        {receiptType === ReceiptType.Original
                          ? 'Original'
                          : 'Receipt'}
                      </span>
                      <FaInfoCircle />
                    </div>
                  </div>
                </MouseoverTooltip>
              ) : (
                <div></div>
              )}
              <button
                onClick={() => {
                  if (unstakedSelected.length === 0) {
                    notify({
                      message: `No tokens selected`,
                      type: 'error',
                    })
                  }
                  handleStake()
                }}
                style={{
                  background:
                    stakePoolMetadata?.colors?.secondary ||
                    defaultSecondaryColor,
                  color: stakePoolMetadata?.colors?.fontColor,
                }}
                className="my-auto flex rounded-md px-4 py-2 hover:scale-[1.03]"
              >
                <span className="mr-1 inline-block">
                  {loadingStake && <LoadingSpinner height="25px" />}
                </span>
                <span className="my-auto">Stake Tokens</span>
              </button>
            </div>
          </div>
          <div
            className="rounded-md bg-white bg-opacity-5 p-10 text-gray-200"
            style={{
              border: stakePoolMetadata?.colors?.accent
                ? `2px solid ${stakePoolMetadata?.colors?.accent}`
                : '',
            }}
          >
            <div className="mb-5 flex flex-row justify-between">
              <div className="mt-2 flex flex-row">
                <p className="mr-3 text-lg">
                  View Staked Tokens{' '}
                  {stakedTokenDatas.isFetched &&
                    stakedTokenDatas.data &&
                    `(${stakedTokenDatas.data.length})`}
                </p>
                <div className="inline-block">
                  {stakedTokenDatas.isRefetching &&
                    stakedTokenDatas.isFetched && (
                      <LoadingSpinner height="25px" />
                    )}
                </div>
              </div>
              <div className="flex flex-col justify-evenly">
                {stakePool?.parsed.cooldownSeconds &&
                stakePool?.parsed.cooldownSeconds !== 0 ? (
                  <div className="flex flex-col">
                    <p className="mr-3 text-sm">
                      Cooldown Period: {stakePool?.parsed.cooldownSeconds} secs
                    </p>
                  </div>
                ) : (
                  ''
                )}
                {stakePool?.parsed.minStakeSeconds &&
                stakePool?.parsed.minStakeSeconds !== 0 ? (
                  <div className="flex flex-col">
                    <p className="mr-3 text-sm">
                      Minimum Stake Seconds: {stakePool?.parsed.minStakeSeconds}{' '}
                      secs
                    </p>
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
            <div className="my-3 flex-auto overflow-auto">
              <div className="relative my-auto mb-4 h-[60vh] overflow-y-auto overflow-x-hidden rounded-md bg-white bg-opacity-5 p-5">
                {!stakedTokenDatas.isFetched ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="h-[200px] animate-pulse rounded-lg bg-white bg-opacity-5 p-10"></div>
                    <div className="h-[200px] animate-pulse rounded-lg bg-white bg-opacity-5 p-10"></div>
                    <div className="h-[200px] animate-pulse rounded-lg bg-white bg-opacity-5 p-10"></div>
                  </div>
                ) : stakedTokenDatas.data?.length === 0 ? (
                  <p className="text-gray-400">No tokens currently staked.</p>
                ) : (
                  <div
                    className={
                      'grid grid-cols-2 gap-4 lg:grid-cols-2 xl:grid-cols-3'
                    }
                  >
                    {!stakePoolMetadata?.notFound &&
                      stakedTokenDatas.data &&
                      stakedTokenDatas.data.map((tk) => (
                        <div key={tk?.stakeEntry?.pubkey.toBase58()}>
                          <div className="relative w-44 md:w-auto 2xl:w-48">
                            <label
                              htmlFor={tk?.stakeEntry?.pubkey.toBase58()}
                              className="relative"
                            >
                              <div className="relative">
                                <div>
                                  <div className="relative">
                                    {(loadingUnstake || loadingClaimRewards) &&
                                      isStakedTokenSelected(tk) && (
                                        <div>
                                          <div className="absolute top-0 left-0 z-10 flex h-full w-full justify-center rounded-lg bg-black bg-opacity-80  align-middle">
                                            <div className="mx-auto flex items-center justify-center">
                                              <span className="mr-2">
                                                <LoadingSpinner height="25px" />
                                              </span>
                                              {loadingUnstake
                                                ? 'Unstaking token...'
                                                : 'Claim rewards...'}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    {tk.stakeEntry?.parsed.lastStaker.toString() !==
                                      wallet.publicKey?.toString() && (
                                      <div>
                                        <div className="absolute top-0 left-0 z-10 flex h-full w-full justify-center rounded-lg bg-black bg-opacity-80  align-middle">
                                          <div className="mx-auto flex flex-col items-center justify-center">
                                            <div>Owned by</div>
                                            <DisplayAddress
                                              dark
                                              connection={connection}
                                              address={
                                                tk.stakeEntry?.parsed.lastStaker
                                              }
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    <img
                                      className="mx-auto mt-4 mb-2 rounded-xl bg-white bg-opacity-5 object-contain md:h-40 md:w-40 2xl:h-48 2xl:w-48"
                                      src={
                                        tk.metadata?.data.image ||
                                        tk.tokenListData?.logoURI
                                      }
                                      alt={
                                        tk.metadata?.data.name ||
                                        tk.tokenListData?.name
                                      }
                                    />
                                  </div>
                                  {tk.tokenListData && (
                                    <div className="absolute bottom-2 left-2">
                                      {Number(
                                        getMintDecimalAmountFromNaturalV2(
                                          tk.tokenListData!.decimals,
                                          new BN(
                                            tk.stakeEntry!.parsed.amount.toNumber()
                                          )
                                        ).toFixed(2)
                                      )}{' '}
                                      {tk.tokenListData.symbol}
                                    </div>
                                  )}
                                </div>

                                <input
                                  disabled={loadingStake || loadingUnstake}
                                  placeholder={
                                    tk.stakeEntry!.parsed.amount.toNumber() > 1
                                      ? Number(
                                          getMintDecimalAmountFromNaturalV2(
                                            tk.tokenListData!.decimals,
                                            new BN(
                                              tk.stakeEntry!.parsed.amount.toNumber()
                                            )
                                          ).toFixed(2)
                                        ).toString()
                                      : ''
                                  }
                                  autoComplete="off"
                                  type="checkbox"
                                  className={`absolute top-2 right-2 h-4 w-4 rounded-sm font-medium text-black focus:outline-none`}
                                  id={tk?.stakeEntry?.pubkey.toBase58()}
                                  name={tk?.stakeEntry?.pubkey.toBase58()}
                                  checked={isStakedTokenSelected(tk)}
                                  onChange={() => {
                                    if (
                                      tk.stakeEntry?.parsed.lastStaker.toString() !==
                                      wallet.publicKey?.toString()
                                    ) {
                                      return
                                    }
                                    if (isStakedTokenSelected(tk)) {
                                      setStakedSelected(
                                        stakedSelected.filter(
                                          (data) =>
                                            data.stakeEntry?.pubkey.toString() !==
                                            tk.stakeEntry?.pubkey.toString()
                                        )
                                      )
                                    } else {
                                      setStakedSelected([...stakedSelected, tk])
                                    }
                                  }}
                                />
                                {tk.stakeEntry?.pubkey &&
                                  rewardEntries.data &&
                                  rewardEntries.data.find((entry) =>
                                    entry.parsed.stakeEntry.equals(
                                      tk.stakeEntry?.pubkey!
                                    )
                                  )?.parsed.multiplier &&
                                  !rewardEntries.data
                                    .find((entry) =>
                                      entry.parsed.stakeEntry.equals(
                                        tk.stakeEntry?.pubkey!
                                      )
                                    )
                                    ?.parsed.multiplier.eq(new BN(0)) &&
                                  !rewardEntries.data
                                    .find((entry) =>
                                      entry.parsed.stakeEntry.equals(
                                        tk.stakeEntry?.pubkey!
                                      )
                                    )
                                    ?.parsed.multiplier.eq(new BN(1)) && (
                                    <div
                                      className="absolute top-1 left-1 flex items-center justify-center rounded-full bg-[#9945ff] px-1 py-1 text-[8px]"
                                      style={{
                                        color:
                                          stakePoolMetadata?.colors?.secondary,
                                        background:
                                          stakePoolMetadata?.colors?.primary,
                                      }}
                                    >
                                      {rewardDistributorData.data?.parsed
                                        .multiplierDecimals !== undefined &&
                                        formatAmountAsDecimal(
                                          rewardDistributorData.data?.parsed
                                            .multiplierDecimals,
                                          rewardEntries.data.find((entry) =>
                                            entry.parsed.stakeEntry.equals(
                                              tk.stakeEntry?.pubkey!
                                            )
                                          )?.parsed.multiplier!,
                                          rewardDistributorData.data.parsed
                                            .multiplierDecimals
                                        ).toString()}
                                      x
                                    </div>
                                  )}
                              </div>
                              {rewards.data &&
                                rewards.data.rewardMap[
                                  tk.stakeEntry?.pubkey.toString() || ''
                                ] &&
                                rewardDistributorData.data?.parsed.rewardDurationSeconds.gte(
                                  new BN(60)
                                ) && (
                                  <div className="mt-1 flex items-center justify-center text-xs">
                                    {secondstoDuration(
                                      rewards.data.rewardMap[
                                        tk.stakeEntry?.pubkey.toString() || ''
                                      ]?.nextRewardsIn.toNumber() || 0
                                    )}{' '}
                                  </div>
                                )}
                              {tk.stakeEntry?.parsed.cooldownStartSeconds &&
                              stakePool?.parsed.cooldownSeconds ? (
                                <div
                                  className="mt-1 flex items-center justify-center text-xs"
                                  style={{
                                    color: 'white',
                                    background:
                                      stakePoolMetadata?.colors?.primary,
                                  }}
                                >
                                  {tk.stakeEntry?.parsed.cooldownStartSeconds.toNumber() +
                                    stakePool.parsed.cooldownSeconds -
                                    UTCNow >
                                  0
                                    ? 'Cooldown: ' +
                                      secondstoDuration(
                                        tk.stakeEntry?.parsed.cooldownStartSeconds.toNumber() +
                                          stakePool.parsed.cooldownSeconds -
                                          UTCNow
                                      )
                                    : 'Cooldown finished!'}
                                </div>
                              ) : (
                                ''
                              )}
                              {stakePool?.parsed.minStakeSeconds &&
                              tk.stakeEntry?.parsed.lastStakedAt ? (
                                <div
                                  className="mt-1 flex items-center justify-center text-xs"
                                  style={{
                                    color: 'white',
                                    background:
                                      stakePoolMetadata?.colors?.primary,
                                  }}
                                >
                                  {tk.stakeEntry?.parsed.lastStakedAt.toNumber() +
                                    stakePool.parsed.minStakeSeconds -
                                    UTCNow >
                                  0
                                    ? 'Able to unstake in: ' +
                                      secondstoDuration(
                                        tk.stakeEntry?.parsed.lastStakedAt.toNumber() +
                                          stakePool.parsed.minStakeSeconds -
                                          UTCNow
                                      )
                                    : 'Min Staked Time Satisfied!'}
                                </div>
                              ) : (
                                ''
                              )}
                            </label>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-2 flex flex-row-reverse">
              <MouseoverTooltip
                title={'Unstake will automatically claim reward for you.'}
              >
                <button
                  onClick={() => {
                    if (stakedSelected.length === 0) {
                      notify({
                        message: `No tokens selected`,
                        type: 'error',
                      })
                    }
                    handleUnstake()
                  }}
                  style={{
                    background:
                      stakePoolMetadata?.colors?.secondary ||
                      defaultSecondaryColor,
                    color: stakePoolMetadata?.colors?.fontColor,
                  }}
                  className="my-auto flex rounded-md px-4 py-2 hover:scale-[1.03]"
                >
                  <span className="mr-1 inline-block">
                    {loadingUnstake ? <LoadingSpinner height="25px" /> : ''}
                  </span>
                  <span className="my-auto">Unstake Tokens</span>
                </button>
              </MouseoverTooltip>
              {rewardDistributorData.data &&
              rewards.data?.claimableRewards.gt(new BN(0)) ? (
                <button
                  onClick={() => {
                    if (stakedSelected.length === 0) {
                      notify({
                        message: `No tokens selected`,
                        type: 'error',
                      })
                    }
                    handleClaimRewards()
                  }}
                  disabled={!rewards.data?.claimableRewards.gt(new BN(0))}
                  style={{
                    background:
                      stakePoolMetadata?.colors?.secondary ||
                      defaultSecondaryColor,
                    color: stakePoolMetadata?.colors?.fontColor,
                  }}
                  className="my-auto mr-5 flex rounded-md px-4 py-2 hover:scale-[1.03]"
                >
                  <span className="mr-1 inline-block">
                    {loadingClaimRewards && <LoadingSpinner height="20px" />}
                  </span>
                  <span className="my-auto">Claim Rewards</span>
                </button>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer bgColor={stakePoolMetadata?.colors?.primary} />
    </div>
  )
}

export default Home
