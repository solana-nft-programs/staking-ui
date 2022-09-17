import {
  createStakeEntryAndStakeMint,
  stake,
  unstake
} from '@cardinal/staking'
import '@dialectlabs/react-ui/index.css'
import { ReceiptType } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, Signer, Transaction } from '@solana/web3.js'
import { Header } from 'common/Header'
import Head from 'next/head'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useEffect, useState } from 'react'
import { Wallet } from '@metaplex/js'
import { LoadingSpinner } from 'common/LoadingSpinner'
import { removeTokenName, secondstoDuration, valueOrDefault } from 'common/utils'
import {
  parseMintNaturalAmountFromDecimal
} from 'common/units'
import { BN } from '@project-serum/anchor'
import {
  StakeEntryTokenData,
  useStakedTokenDatas,
} from 'hooks/useStakedTokenDatas'
import { useStakePoolEntries } from 'hooks/useStakePoolEntries'
import { useStakePoolData } from 'hooks/useStakePoolData'
import {
  AllowedTokenData,
  useAllowedTokenDatas,
} from 'hooks/useAllowedTokenDatas'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'
import { defaultSecondaryColor, TokenStandard } from 'api/mapping'
import { Footer } from 'common/Footer'
import { DisplayAddress } from '@cardinal/namespaces-components'
import { Switch } from '@headlessui/react'
import { FaInfoCircle } from 'react-icons/fa'
import { MouseoverTooltip } from 'common/Tooltip'
import { useUTCNow } from 'providers/UTCNowProvider'
import { executeAllTransactions } from 'api/utils'
import { useRouter } from 'next/router'
import { QuickActions } from 'common/QuickActions'
import * as splToken from '@solana/spl-token'
import { usePoolAnalytics } from 'hooks/usePoolAnalytics'
import { useSentriesStats } from 'hooks/useSentriesStats'
import { Button } from 'components/Button'
import { Notifications } from 'components/Notifications'
import { useNotifications } from 'hooks/useNotifications'
import { Tab } from '@headlessui/react'
import { TabButton, TabPanel } from 'components/Tab'
import { Stats } from 'features/Stats'
import { ConnectWallet } from 'features/ConnectWallet'
import { useValidatorInfo } from 'hooks/useValidatorInfo'
import { useSentryPower } from 'hooks/useSentryPower'

function Home() {
  const router = useRouter()
  const { connection } = useEnvironmentCtx()
  const wallet = useWallet()
  const { data: stakePool, isFetched: stakePoolLoaded } = useStakePoolData()
  const stakedTokenDatas = useStakedTokenDatas()
  const stakePoolEntries = useStakePoolEntries()
  const sentriesStats = useSentriesStats()
  const sentryPower = useSentryPower()
  const validatorDetails = useValidatorInfo()

  const [unstakedSelected, setUnstakedSelected] = useState<AllowedTokenData[]>(
    []
  )
  const [stakedSelected, setStakedSelected] = useState<StakeEntryTokenData[]>(
    []
  )
  const [loadingStake, setLoadingStake] = useState(false)
  const [loadingUnstake, setLoadingUnstake] = useState(false)
  const [singleTokenAction, setSingleTokenAction] = useState('')
  const [totalStaked, setTotalStaked] = useState<number>(0)
  const [receiptType, setReceiptType] = useState<ReceiptType>(
    ReceiptType.Original
  )
  const [loadingClaimRewards, setLoadingClaimRewards] = useState(false)
  const [showFungibleTokens, setShowFungibleTokens] = useState(false)
  const allowedTokenDatas = useAllowedTokenDatas(showFungibleTokens)
  const { data: stakePoolMetadata } = useStakePoolMetadata()
  const { UTCNow } = useUTCNow()
  const analytics = usePoolAnalytics()
  const { notify } = useNotifications()

  // OG content
  const description = 'Stake your Sentry NFT to start earning rewards.'
  const title = 'Sentries NFT Staking'
  const keyword = 'Sentries NFTs, Sentries Validators, NFTs'
  const url = 'https://sentries.io'
  const image = 'https://sentries.io/images/og_stake_image.png'

  if (stakePoolMetadata?.redirect) {
    router.push(stakePoolMetadata?.redirect)
    return
  }

  useEffect(() => {
    stakePoolMetadata?.tokenStandard &&
      setShowFungibleTokens(
        stakePoolMetadata?.tokenStandard === TokenStandard.Fungible
      )
    stakePoolMetadata?.receiptType &&
      setReceiptType(stakePoolMetadata?.receiptType)
  }, [stakePoolMetadata?.name])

  async function handleUnstake() {
    if (!wallet.connected) {
      notify({ message: `Wallet not connected`, type: 'error' })
      return
    }
    if (!stakePool) {
      notify({ message: `No stake pool detected`, type: 'error' })
      return
    }
    if (stakedSelected.length <= 0) {
      notify({ message: `Not tokens selected`, type: 'error' })
      return
    }
    setLoadingUnstake(true)

    let coolDown = false
    const txs: (Transaction | null)[] = await Promise.all(
      stakedSelected.map(async (token) => {
        try {
          if (!token || !token.stakeEntry) {
            throw new Error('No stake entry for token')
          }
          if (
            stakePool.parsed.cooldownSeconds &&
            !token.stakeEntry?.parsed.cooldownStartSeconds &&
            !stakePool.parsed.minStakeSeconds
          ) {
            notify({
              message: `Cooldown period will be initiated for ${token.metaplexData?.data.data.name} unless minimum stake period unsatisfied`,
              type: 'info',
            })
            coolDown = true
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
            message: `Successfully ${
              coolDown ? 'initiated cooldown' : 'unstaked'
            }`,
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
        analytics.refetch()
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
    if (unstakedSelected.length <= 0) {
      notify({ message: `Not tokens selected`, type: 'error' })
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
          message: `Failed to stake token ${unstakedSelected[
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
            throwIndividualError: true,
            notificationConfig: {
              message: `Successfully staked`,
              description: 'Stake progress will now dynamically update',
            },
          }
        )
      } catch (e) {
        setLoadingStake(false)
        return
      }
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
        analytics.refetch()
      }, 2000)
    )
    setStakedSelected([])
    setUnstakedSelected([])
    setLoadingStake(false)
  }

  const selectUnstakedToken = (tk: AllowedTokenData, targetValue?: string) => {
    if (loadingStake || loadingUnstake) return
    const amount = Number(targetValue)
    if (tk.tokenAccount?.account.data.parsed.info.tokenAmount.amount > 1) {
      let newUnstakedSelected = unstakedSelected.filter(
        (data) =>
          data.tokenAccount?.account.data.parsed.info.mint.toString() !==
          tk.tokenAccount?.account.data.parsed.info.mint.toString()
      )
      if (targetValue && targetValue?.length > 0 && !amount) {
        notify({
          message: 'Please enter a valid amount',
          type: 'error',
        })
      } else if (targetValue) {
        tk.amountToStake = targetValue.toString()
        newUnstakedSelected = [...newUnstakedSelected, tk]
        setUnstakedSelected(newUnstakedSelected)
        return
      }
      setUnstakedSelected(
        unstakedSelected.filter(
          (data) =>
            data.tokenAccount?.account.data.parsed.info.mint.toString() !==
            tk.tokenAccount?.account.data.parsed.info.mint.toString()
        )
      )
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
        setUnstakedSelected([...unstakedSelected, tk])
      }
    }
  }

  const selectStakedToken = (tk: StakeEntryTokenData) => {
    if (loadingStake || loadingUnstake) return
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

  const totalStakedTokens = async () => {
    let total = 0
    if (!stakePoolEntries.data) {
      setTotalStaked(0)
      return
    }
    const mintToDecimals: { mint: string; decimals: number }[] = []
    for (const entry of stakePoolEntries.data) {
      try {
        if (entry.parsed.amount.toNumber() > 1) {
          let decimals = 0
          const match = mintToDecimals.find(
            (m) => m.mint === entry.parsed.originalMint.toString()
          )
          if (match) {
            decimals = match.decimals
          } else {
            const mint = new splToken.Token(
              connection,
              entry.parsed.originalMint,
              splToken.TOKEN_PROGRAM_ID,
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              null
            )
            const mintInfo = await mint.getMintInfo()
            decimals = mintInfo.decimals
            mintToDecimals.push({
              mint: entry.parsed.originalMint.toString(),
              decimals: decimals,
            })
          }
          total += entry.parsed.amount.toNumber() / 10 ** decimals
        } else {
          total += 1
        }
      } catch (e) {
        console.log('Error calculating total staked tokens', e)
      }
    }
    setTotalStaked(Math.ceil(total))
  }

  useEffect(() => {
    const fetchData = async () => {
      await totalStakedTokens()
    }
    fetchData().catch(console.error)
  }, [stakePoolEntries.isFetched])

  if (!stakePoolLoaded) {
    return
  }

  // TODO: Review if we need this.
  const totalStakedSentries = stakedTokenDatas.isFetched &&
    stakedTokenDatas?.data?.length || 0
  const totalStakedInSol = Intl.NumberFormat('en').format(Math.floor(valueOrDefault(validatorDetails.data?.totalSolStaked, 0)))
  
  const totalUnstakedSentries = allowedTokenDatas.isFetched &&
    allowedTokenDatas?.data?.length || 0

  const floorPrice = sentriesStats.isFetched && sentriesStats?.data?.floorPrice || 0
  const solPrice = sentriesStats.isFetched && sentriesStats?.data?.solPrice || 0
  const currentValueLocked = floorPrice * totalStaked * solPrice
  const totalMcap = floorPrice * 8000 * solPrice
  const solPowering = sentriesStats.isFetched && sentriesStats?.data?.solPowering || 0

  const renderTotalStaked = (
    <MouseoverTooltip title="Value of total stake">
      <span className="text-sm align-middle font-normal bg-teal-900 border border-teal-700 p-2 pb-1 rounded-full cursor-default">
        {totalStakedInSol} <i className="opacity-50 not-italic">◎</i>
      </span>
    </MouseoverTooltip>
  )

  return (
    <>
      <main className="relative pt-6">
        <Head>
          <title>Sentries NFT Staking</title>
          <meta
            name="description"
            content="Stake your Sentry NFT increase your Power."
          />
          <link rel="icon" href="/favicon.png" />
          <meta property="og:type" content="website" />
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta name="description" content={description} />
          <meta name="keywords" content={keyword} />
          <meta property="og:url" content={url} />
          <meta property="og:description" content={description} />
          <meta property="og:image" content={image} />
        </Head>
        <Header />
        <div className="fixed top-1/2 -left-[210px] z-[-1] h-[420px] w-[420px] rounded-full bg-teal-400 opacity-30 blur-[300px]"></div>
        <div className="fixed bottom-0 -right-[60px] z-[-1] h-[120px] w-[120px] rounded-full bg-purple-400 opacity-30 blur-[60px]"></div>
        <div className="z-100 container z-10 mx-auto w-full">
          <div className="my-8 flex text-white">
            <div className="w-1/3">
              <h1 className="mb-2 text-4xl font-bold text-white">
                The Power Grid {renderTotalStaked}
              </h1>
              <p className="text-lg text-neutral-300">
                Stake your Sentry here, and power it up by locking SOL in our
                validator, The Lode
              </p>
            </div>
            <div className="w-2/3 flex justify-end items-center">
              <Button
                as="button"
                variant="secondary"
                hasArrow={true}
              >
                Learn More
              </Button>
            </div>
          </div>
          {analytics.data &&
            Object.keys(analytics.data).length > 0 &&
            totalStaked && (
              <div
                className={`mx-5 mb-4 flex flex-wrap items-center gap-4 rounded-md px-10 py-6  md:flex-row md:justify-between ${
                  stakePoolMetadata?.colors?.fontColor
                    ? `text-[${stakePoolMetadata?.colors?.fontColor}]`
                    : 'text-gray-200'
                } ${
                  stakePoolMetadata?.colors?.backgroundSecondary
                    ? `bg-[${stakePoolMetadata?.colors?.backgroundSecondary}]`
                    : 'bg-white bg-opacity-5'
                }`}
                style={{
                  background: stakePoolMetadata?.colors?.backgroundSecondary,
                  border: stakePoolMetadata?.colors?.accent
                    ? `2px solid ${stakePoolMetadata?.colors?.accent}`
                    : '',
                }}
              >
                <div className="relative flex flex-grow items-center justify-center">
                  {Object.keys(analytics.data).map((key) => {
                    return (
                      <div className="relative flex flex-grow items-center justify-center text-lg">
                        <span
                          className={`${
                            stakePoolMetadata?.colors?.fontColor
                              ? `text-[${stakePoolMetadata?.colors?.fontColor}]`
                              : 'text-gray-500'
                          }`}
                        >
                          {key}: {(analytics.data![key]! * 100).toFixed(2)} %
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            {!wallet.connected ? <ConnectWallet /> :
            <div className="flex flex-wrap -mx-4">
              <div className="w-1/3 p-4">
                <Stats 
                  stakedSentries={totalStaked}
                  sentriesDetails={sentriesStats.isFetched ? sentriesStats.data : undefined}
                  stats={sentryPower.isFetched ? sentryPower.data : undefined}
                  isLoading={sentryPower.isLoading && sentriesStats.isLoading}
                  isError={sentryPower.isError && sentriesStats.isError}
                  recover={sentryPower.refetch}
                />
              </div>
              <div className="w-2/3 p-4">
                <Tab.Group defaultIndex={
                  totalUnstakedSentries > totalStakedSentries ? 0 : 1
                }>
                  <Tab.List className="p-1 border border-neutral-600 rounded-lg flex bg-neutral-900 bg-opacity-70 mb-4 w-fit">
                    <TabButton>
                      <div className="flex item-center">
                        Unstaked

                        {totalUnstakedSentries ?
                          <span className="rounded-full flex items-center bg-neutral-600 px-2 ml-1 text-[10px]">
                            {totalUnstakedSentries}
                          </span>
                        : null}
                      </div>
                    </TabButton>
                    <TabButton>
                      <div className="flex item-center">
                        Staked
                        {totalStakedSentries ?
                          <span className="bg-teal-400 text-white rounded-full flex items-center px-2 ml-1 text-[10px]">
                            {totalStakedSentries}
                          </span>
                        : null}
                      </div>
                    </TabButton>
                  </Tab.List>
                  <Tab.Panels>
                    <TabPanel>
                    <div className="flex items-center w-full">
                      <h2 className="font-semibold text-white text-2xl">
                        Select Your Sentries
                      </h2>
                      <div className="ml-auto flex items-center justify-between gap-2">
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
                        ) : null}
                        <div className="flex gap-2">
                          <Button
                            as="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              if (unstakedSelected.length === allowedTokenDatas?.data?.length) {
                                setUnstakedSelected([])
                                return
                              }
                              setUnstakedSelected(allowedTokenDatas.data || [])
                            }}
                          >
                            {unstakedSelected.length === allowedTokenDatas?.data?.length ? 'Select None' : 'Select All'}
                          </Button>
                          <Button
                            as="button"
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              if (unstakedSelected.length === 0) {
                                notify({
                                  message: `No NFTs selected`,
                                  type: 'error',
                                })
                              } else {
                                handleStake()
                              }
                            }}
                          >
                              {loadingStake && (
                                <LoadingSpinner
                                  fill={
                                    stakePoolMetadata?.colors?.fontColor
                                      ? stakePoolMetadata?.colors?.fontColor
                                      : '#FFF'
                                  }
                                  height="20px"
                                />
                              )}
                              Stake ({unstakedSelected.length})
                          </Button>
                        </div>
                      </div>
                    </div>
                      <div className="my-3 flex-auto overflow-auto">
                        <div
                          className="relative my-auto mb-4 h-[60vh] overflow-y-auto overflow-x-hidden rounded-md"
                        >
                          {!allowedTokenDatas.isFetched ? (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                              <div className="h-[200px] animate-pulse rounded-lg bg-white bg-opacity-5 p-10"></div>
                              <div className="h-[200px] animate-pulse rounded-lg bg-white bg-opacity-5 p-10"></div>
                              <div className="h-[200px] animate-pulse rounded-lg bg-white bg-opacity-5 p-10"></div>
                            </div>
                          ) : (allowedTokenDatas.data || []).length == 0 ? (
                            <p className="text-neutral-600">
                              No Sentries found in your connected wallet.
                            </p>
                          ) : (
                            <div
                              className={
                                'grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4'
                              }
                            >
                              {(
                                (!stakePoolMetadata?.notFound &&
                                  allowedTokenDatas.data) ||
                                []
                              ).map((tk) => (
                                <div
                                  key={tk.tokenAccount?.pubkey.toString()}
                                  className="mx-auto"
                                >
                                  <div className="relative w-44 md:w-auto 2xl:w-48">
                                    <div
                                      className="relative"
                                    >
                                      <div
                                        className="relative cursor-pointer rounded-xl"
                                        onClick={() => selectUnstakedToken(tk)}
                                        style={{
                                          boxShadow: isUnstakedTokenSelected(tk)
                                            ? `0 0 0 4px #202222, 0 0 0 8px ${
                                              stakePoolMetadata?.colors
                                                ?.secondary || '#FFFFFF'
                                            }`
                                          : '',
                                        }}
                                      >
                                        {loadingStake &&
                                          (isUnstakedTokenSelected(tk) ||
                                            singleTokenAction ===
                                              tk.tokenAccount?.account.data.parsed.info.mint.toString()) && (
                                            <div>
                                              <div className="absolute top-0 left-0 z-10 flex h-full w-full justify-center rounded-xl bg-black bg-opacity-80 align-middle text-white">
                                                <div className="my-auto flex">
                                                  <span className="mr-2">
                                                    <LoadingSpinner height="20px" />
                                                  </span>
                                                  Staking your Sentries...
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        <QuickActions
                                          receiptType={receiptType}
                                          unstakedTokenData={tk}
                                          showFungibleTokens={showFungibleTokens}
                                          setStakedSelected={setStakedSelected}
                                          setUnstakedSelected={setUnstakedSelected}
                                          setLoadingStake={setLoadingStake}
                                          setLoadingUnstake={setLoadingUnstake}
                                          setLoadingClaimRewards={
                                            setLoadingClaimRewards
                                          }
                                          setSingleTokenAction={setSingleTokenAction}
                                          selectUnstakedToken={selectUnstakedToken}
                                          selectStakedToken={selectStakedToken}
                                        />
                                        <img
                                          className="mx-auto mt-4 rounded-xl bg-white bg-opacity-5 object-contain md:h-40 md:w-40 2xl:h-48 2xl:w-48"
                                          src={
                                            tk.metadata?.data.image ||
                                            tk.tokenListData?.logoURI
                                          }
                                          alt={
                                            tk.metadata?.data.name ||
                                            tk.tokenListData?.name
                                          }
                                        />
                                        <div
                                          className="absolute bottom-2 left-1/2 -translate-x-1/2"
                                        >
                                          <div className="truncate text-white bg-white/30 backdrop-blur-md rounded-full px-4 py-1">
                                            {removeTokenName(tk.metadata?.data.name, 'Sentry')}
                                          </div>
                                        </div>
                                      </div>
                                      {isUnstakedTokenSelected(tk) && (
                                        <div
                                          className="absolute -top-5 left-1/2 -translate-x-1/2 inline-block w-7 h-7 rounded-full bg-purple-400 border-4 border-neutral-800 p-1"
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                          </svg>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </TabPanel>
                    <TabPanel>
                      <div className="mb-5 flex justify-between">
                        <div className="flex items-center w-full">
                          <div className="flex items-center">
                            <h2 className="font-semibold text-white text-2xl">
                              Staked Sentries
                            </h2>
                            <div className="inline-block ml-1">
                              {stakedTokenDatas.isRefetching ?
                                (
                                  <LoadingSpinner
                                    fill="#fff"
                                    height="25px"
                                  />
                                ) : null}
                            </div>
                          </div>
                          <div className="ml-auto flex flex-wrap justify-between gap-5">
                            <div className="flex gap-2">
                              <Button
                                as="button"
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                  if (stakedSelected.length === stakedTokenDatas?.data?.length) {
                                    setStakedSelected([])
                                    return
                                  }
                                  setStakedSelected(stakedTokenDatas.data || [])
                                  notify({
                                    message: 'Unstake will automatically claim reward for you.',
                                    type: 'info'
                                  })
                                }}
                              >
                                {stakedSelected.length === stakedTokenDatas?.data?.length ? 'Select None' : 'Select All'}
                              </Button>
                              <Button
                                as="button"
                                variant="primary"
                                size="sm"
                                onClick={() => {
                                  if (stakedSelected.length === 0) {
                                    notify({
                                      message: `No tokens selected`,
                                      type: 'error',
                                    })
                                  } else {
                                    handleUnstake()
                                  }
                                }}
                              >
                                  {loadingUnstake && (
                                    <LoadingSpinner
                                      fill={
                                        stakePoolMetadata?.colors?.fontColor
                                          ? stakePoolMetadata?.colors?.fontColor
                                          : '#FFF'
                                      }
                                      height="20px"
                                    />
                                  )}
                                  Unstake ({stakedSelected.length})
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-evenly">
                          {stakePool?.parsed.endDate &&
                          stakePool?.parsed.endDate.toNumber() !== 0 ? (
                            <div className="flex flex-col">
                              <p className="mr-3 text-sm">
                                End Date:{' '}
                                {new Date(
                                  stakePool.parsed.endDate?.toNumber() * 1000
                                ).toDateString()}{' '}
                              </p>
                            </div>
                          ) : (
                            ''
                          )}
                          {stakePool?.parsed.cooldownSeconds &&
                          stakePool?.parsed.cooldownSeconds !== 0 ? (
                            <div className="flex flex-col">
                              <p className="mr-3 text-sm">
                                Cooldown Period:{' '}
                                {secondstoDuration(stakePool?.parsed.cooldownSeconds)}{' '}
                              </p>
                            </div>
                          ) : (
                            ''
                          )}
                          {stakePool?.parsed.minStakeSeconds &&
                          stakePool?.parsed.minStakeSeconds !== 0 ? (
                            <div className="flex flex-col">
                              <p className="mr-3 text-sm">
                                Minimum Stake Seconds:{' '}
                                {secondstoDuration(stakePool?.parsed.minStakeSeconds)}{' '}
                              </p>
                            </div>
                          ) : (
                            ''
                          )}
                        </div>
                      </div>
                      <div className="my-3 flex-auto overflow-auto">
                        <div
                          className="relative my-auto mb-4 h-[60vh] overflow-y-auto overflow-x-hidden"
                        >
                          {!stakedTokenDatas.isFetched ? (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                              <div className="h-[200px] animate-pulse rounded-lg bg-white bg-opacity-5 p-10"></div>
                              <div className="h-[200px] animate-pulse rounded-lg bg-white bg-opacity-5 p-10"></div>
                              <div className="h-[200px] animate-pulse rounded-lg bg-white bg-opacity-5 p-10"></div>
                            </div>
                          ) : stakedTokenDatas.data?.length === 0 ? (
                            <p
                              className={`font-normal text-[${
                                stakePoolMetadata?.colors?.fontColor
                                  ? ''
                                  : 'text-gray-400'
                              }]`}
                            >
                              No Sentries currently staked.
                            </p>
                          ) : (
                            <div
                              className={
                                'grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-4'
                              }
                            >
                              {!stakePoolMetadata?.notFound &&
                                stakedTokenDatas?.data?.map((tk) => (
                                  <div
                                    key={tk?.stakeEntry?.pubkey.toBase58()}
                                    className="mx-auto"
                                  >
                                    <div className="relative w-44 md:w-auto 2xl:w-48">
                                      <div className="relative">
                                        <div
                                          className="relative cursor-pointer rounded-xl"
                                          onClick={() => selectStakedToken(tk)}
                                          style={{
                                            boxShadow: isStakedTokenSelected(tk)
                                              ? `0 0 0 4px #202222, 0 0 0 8px ${
                                                  stakePoolMetadata?.colors
                                                    ?.secondary || '#FFFFFF'
                                                }`
                                              : '',
                                          }}
                                        >
                                          {(loadingUnstake || loadingClaimRewards) &&
                                            (isStakedTokenSelected(tk) ||
                                              singleTokenAction ===
                                                tk.stakeEntry?.parsed.originalMint.toString()) && (
                                              <div>
                                                <div className="absolute top-0 left-0 z-10 flex h-full w-full justify-center rounded-lg bg-black bg-opacity-80 align-middle text-white">
                                                  <div className="mx-auto flex items-center justify-center">
                                                    <span className="mr-2">
                                                      <LoadingSpinner height="20px" />
                                                    </span>
                                                    {loadingUnstake
                                                      ? 'Unstaking token...'
                                                      : 'Claiming rewards...'}
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                          {tk.stakeEntry?.parsed.lastStaker.toString() !==
                                            wallet.publicKey?.toString() && (
                                            <div>
                                              <div className="absolute top-0 left-0 z-10 flex h-full w-full justify-center rounded-xl bg-black bg-opacity-80  align-middle text-white">
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
                                          <QuickActions
                                            receiptType={receiptType}
                                            stakedTokenData={tk}
                                            showFungibleTokens={showFungibleTokens}
                                            setStakedSelected={setStakedSelected}
                                            setUnstakedSelected={setUnstakedSelected}
                                            setLoadingStake={setLoadingStake}
                                            setLoadingUnstake={setLoadingUnstake}
                                            setLoadingClaimRewards={
                                              setLoadingClaimRewards
                                            }
                                            setSingleTokenAction={setSingleTokenAction}
                                            selectUnstakedToken={selectUnstakedToken}
                                            selectStakedToken={selectStakedToken}
                                          />
                                          <img
                                            className="mx-auto mt-4 rounded-xl bg-white bg-opacity-5 object-contain md:h-40 md:w-40 2xl:h-48 2xl:w-48"
                                            src={
                                              tk.metadata?.data.image ||
                                              tk.tokenListData?.logoURI
                                            }
                                            alt={
                                              tk.metadata?.data.name ||
                                              tk.tokenListData?.name
                                            }
                                          />
                                          <div
                                            className="absolute bottom-2 left-1/2 -translate-x-1/2"
                                          >
                                            <div className="truncate text-white bg-white/30 backdrop-blur-md rounded-full px-4 py-1">
                                              {removeTokenName(tk.metadata?.data.name, 'Sentry')}
                                            </div>
                                          </div>
                                          {isStakedTokenSelected(tk) && (
                                            <div
                                              className="absolute -top-5 left-1/2 -translate-x-1/2 inline-block w-7 h-7 rounded-full bg-purple-400 border-4 border-neutral-800 p-1"
                                            >
                                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                              </svg>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </TabPanel>
                  </Tab.Panels>
                </Tab.Group>
              </div>
            </div>
          }
        </div>
        <Footer bgColor={stakePoolMetadata?.colors?.primary} />
      </main>
      <Notifications />
    </>
  )
}

export default Home
