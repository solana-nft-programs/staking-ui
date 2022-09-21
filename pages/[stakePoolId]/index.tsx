import { ReceiptType } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { BN } from '@project-serum/anchor'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { defaultSecondaryColor, TokenStandard } from 'api/mapping'
import { contrastify } from 'common/colors'
import { Footer } from 'common/Footer'
import { FooterSlim } from 'common/FooterSlim'
import { Header } from 'common/Header'
import { LoadingSpinner } from 'common/LoadingSpinner'
import { notify } from 'common/Notification'
import { QuickActions } from 'common/QuickActions'
import { Toggle } from 'common/Toggle'
import { Tooltip } from 'common/Tooltip'
import { formatAmountAsDecimal } from 'common/units'
import { contrastColorMode, secondstoDuration } from 'common/utils'
import { AllowedTokens } from 'components/AllowedTokens'
import { PoolAnalytics } from 'components/PoolAnalytics'
import { StakedToken } from 'components/StakedToken'
import { StakePoolInfo } from 'components/StakePoolInfo'
import { useHandleClaimRewards } from 'handlers/useHandleClaimRewards'
import { useHandleStake } from 'handlers/useHandleStake'
import { useHandleUnstake } from 'handlers/useHandleUnstake'
import type { AllowedTokenData } from 'hooks/useAllowedTokenDatas'
import { useAllowedTokenDatas } from 'hooks/useAllowedTokenDatas'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { useRewards } from 'hooks/useRewards'
import type { StakeEntryTokenData } from 'hooks/useStakedTokenDatas'
import { useStakedTokenDatas } from 'hooks/useStakedTokenDatas'
import { useStakePoolData } from 'hooks/useStakePoolData'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'
import { useUserRegion } from 'hooks/useUserRegion'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FaInfoCircle } from 'react-icons/fa'

function StakePoolHome() {
  const router = useRouter()
  const wallet = useWallet()
  const walletModal = useWalletModal()
  const { data: stakePool, isFetched: stakePoolLoaded } = useStakePoolData()
  const userRegion = useUserRegion()
  const stakedTokenDatas = useStakedTokenDatas()
  const rewardDistributorData = useRewardDistributorData()
  const rewards = useRewards()

  const [unstakedSelected, setUnstakedSelected] = useState<AllowedTokenData[]>(
    []
  )
  const [stakedSelected, setStakedSelected] = useState<StakeEntryTokenData[]>(
    []
  )
  const [singleTokenAction, setSingleTokenAction] = useState('')
  const [receiptType, setReceiptType] = useState<ReceiptType>(
    ReceiptType.Original
  )
  const [showAllowedTokens, setShowAllowedTokens] = useState<boolean>()
  const [showFungibleTokens, setShowFungibleTokens] = useState(false)
  const allowedTokenDatas = useAllowedTokenDatas(showFungibleTokens)
  const { data: stakePoolMetadata } = useStakePoolMetadata()
  const handleStake = useHandleStake()
  const handleUnstake = useHandleUnstake()
  const handleClaimRewards = useHandleClaimRewards()

  if (stakePoolMetadata?.redirect) {
    router.push(stakePoolMetadata?.redirect)
    return <></>
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    stakePoolMetadata?.tokenStandard &&
      setShowFungibleTokens(
        stakePoolMetadata?.tokenStandard === TokenStandard.Fungible
      )
    stakePoolMetadata?.receiptType &&
      setReceiptType(stakePoolMetadata?.receiptType)
  }, [stakePoolMetadata?.name])

  const selectUnstakedToken = (tk: AllowedTokenData, targetValue?: string) => {
    if (handleStake.isLoading || handleUnstake.isLoading) return
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
    if (handleStake.isLoading || handleUnstake.isLoading) return
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

  if (
    !stakePoolLoaded ||
    (stakePoolMetadata?.disallowRegions && !userRegion.isFetched)
  ) {
    return <></>
  }

  if (stakePoolMetadata?.disallowRegions && !userRegion.data?.isAllowed) {
    return (
      <div
        className="flex min-h-screen flex-col"
        style={{
          background: stakePoolMetadata?.colors?.primary,
          backgroundImage: `url(${stakePoolMetadata?.backgroundImage})`,
        }}
      >
        <Header />
        <div className="max flex grow items-center justify-center">
          <div className="w-[600px] max-w-[95vw] rounded-xl bg-black bg-opacity-50 p-10 text-center">
            <div className="text-2xl font-bold">
              Users from Country ({userRegion.data?.countryName}) are not
              Eligible to Participate
            </div>
            <div className="mt-8 text-sm text-light-2">
              It is prohibited to use certain services offered by Parcl if you
              are a resident of, or are located, incorporated, or have a
              registered agent in, {userRegion.data?.countryName} or any other
              jurisdiction where the Services are restricted.
            </div>
          </div>
        </div>
        <FooterSlim />
      </div>
    )
  }

  return (
    <div
      style={{
        background: stakePoolMetadata?.colors?.primary,
        backgroundImage: `url(${stakePoolMetadata?.backgroundImage})`,
      }}
    >
      <Head>
        <title>{stakePoolMetadata?.displayName ?? 'Cardinal Staking UI'}</title>
        <meta name="description" content="Generated by Cardinal Staking UI" />
        <link rel="icon" href={stakePoolMetadata?.imageUrl ?? `/favicon.ico`} />
        <script
          defer
          data-domain="stake.cardinal.so"
          src="https://plausible.io/js/plausible.js"
        ></script>
      </Head>
      <Header />
      <div
        className={`container mx-auto w-full`}
        style={{
          ...stakePoolMetadata?.styles,
          color:
            stakePoolMetadata?.colors?.fontColor ??
            contrastColorMode(
              stakePoolMetadata?.colors?.primary || '#000000'
            )[0],
        }}
      >
        {(!stakePool && stakePoolLoaded) || stakePoolMetadata?.notFound ? (
          <div
            className="mx-5 mb-5 rounded-md border-[1px] bg-opacity-40 p-4 text-center text-lg font-semibold"
            style={{
              background:
                stakePoolMetadata?.colors?.secondary || defaultSecondaryColor,
              color: stakePoolMetadata?.colors?.fontColor,
              borderColor: contrastify(
                0.5,
                stakePoolMetadata?.colors?.secondary || defaultSecondaryColor
              ),
            }}
          >
            Stake pool not found
          </div>
        ) : (
          !wallet.connected && (
            <div
              className={`mx-5 mb-5 cursor-pointer rounded-md border-[1px]  p-4 text-center text-lg font-semibold ${
                stakePoolMetadata?.colors?.accent &&
                stakePoolMetadata?.colors.fontColor
                  ? ''
                  : 'border-yellow-500 bg-yellow-500 bg-opacity-40'
              }`}
              style={
                stakePoolMetadata?.colors?.accent &&
                stakePoolMetadata?.colors.fontColor
                  ? {
                      background: stakePoolMetadata?.colors?.secondary,
                      borderColor: stakePoolMetadata?.colors?.accent,
                      color:
                        stakePoolMetadata?.colors?.fontColorSecondary ||
                        stakePoolMetadata?.colors?.fontColor,
                    }
                  : {}
              }
              onClick={() => walletModal.setVisible(true)}
            >
              Connect wallet to continue
            </div>
          )
        )}
        <StakePoolInfo />
        <PoolAnalytics />
        <div className="my-2 mx-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div
            className={`flex-col rounded-md p-10 ${
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
            <div className="mt-2 flex w-full flex-row justify-between">
              <div className="flex flex-row">
                <p className="mb-3 mr-3 inline-block text-lg">
                  Select Your Tokens
                </p>
                <div className="inline-block">
                  {allowedTokenDatas.isRefetching &&
                    allowedTokenDatas.isFetched && (
                      <LoadingSpinner
                        fill={
                          stakePoolMetadata?.colors?.fontColor
                            ? stakePoolMetadata?.colors?.fontColor
                            : '#FFF'
                        }
                        height="25px"
                      />
                    )}
                </div>
              </div>
              <div className="flex flex-row">
                {!stakePoolMetadata?.hideAllowedTokens && (
                  <button
                    onClick={() => setShowAllowedTokens(!showAllowedTokens)}
                    className="text-md mr-5 inline-block rounded-md bg-white bg-opacity-5 px-4 py-1 hover:bg-opacity-10 focus:outline-none"
                  >
                    {showAllowedTokens ? 'Hide' : 'Show'} Allowed Tokens
                  </button>
                )}
                {!stakePoolMetadata?.tokenStandard && (
                  <button
                    onClick={() => {
                      setShowFungibleTokens(!showFungibleTokens)
                    }}
                    className="text-md inline-block rounded-md bg-white bg-opacity-5 px-4 py-1 hover:bg-opacity-10"
                  >
                    {showFungibleTokens ? 'Show NFTs' : 'Show FTs'}
                  </button>
                )}
              </div>
            </div>
            {showAllowedTokens && (
              <AllowedTokens stakePool={stakePool}></AllowedTokens>
            )}
            <div className="my-3 flex-auto overflow-auto">
              <div
                className="relative my-auto mb-4 h-[60vh] overflow-y-auto overflow-x-hidden rounded-md bg-white bg-opacity-5 p-5"
                style={{
                  background:
                    stakePoolMetadata?.colors?.backgroundSecondary &&
                    contrastify(
                      0.05,
                      stakePoolMetadata?.colors?.backgroundSecondary
                    ),
                }}
              >
                {!allowedTokenDatas.isFetched ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="h-[200px] animate-pulse rounded-lg bg-white bg-opacity-5 p-10"></div>
                    <div className="h-[200px] animate-pulse rounded-lg bg-white bg-opacity-5 p-10"></div>
                    <div className="h-[200px] animate-pulse rounded-lg bg-white bg-opacity-5 p-10"></div>
                  </div>
                ) : (allowedTokenDatas.data || []).length === 0 ? (
                  <p
                    className={`font-normal text-[${
                      stakePoolMetadata?.colors?.fontColor
                        ? `text-[${stakePoolMetadata?.colors?.fontColor}]`
                        : 'text-gray-400'
                    }]`}
                  >
                    No allowed tokens found in wallet.
                  </p>
                ) : (
                  <div
                    className={
                      'grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3'
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
                          <label
                            htmlFor={tk?.tokenAccount?.pubkey.toBase58()}
                            className="relative"
                          >
                            <div
                              className="relative cursor-pointer rounded-xl"
                              onClick={() => selectUnstakedToken(tk)}
                              style={{
                                boxShadow: isUnstakedTokenSelected(tk)
                                  ? `0px 0px 20px ${
                                      stakePoolMetadata?.colors?.secondary ||
                                      '#FFFFFF'
                                    }`
                                  : '',
                              }}
                            >
                              {handleStake.isLoading &&
                                (isUnstakedTokenSelected(tk) ||
                                  singleTokenAction ===
                                    tk.tokenAccount?.account.data.parsed.info.mint.toString()) && (
                                  <div>
                                    <div className="absolute top-0 left-0 z-10 flex h-full w-full justify-center rounded-xl bg-black bg-opacity-80 align-middle text-white">
                                      <div className="my-auto flex">
                                        <span className="mr-2">
                                          <LoadingSpinner height="20px" />
                                        </span>
                                        Staking token...
                                      </div>
                                    </div>
                                  </div>
                                )}
                              <QuickActions
                                receiptType={receiptType}
                                unstakedTokenData={tk}
                                showFungibleTokens={showFungibleTokens}
                                selectUnstakedToken={selectUnstakedToken}
                                selectStakedToken={selectStakedToken}
                              />
                              <img
                                className="mx-auto mt-4 rounded-t-xl bg-white bg-opacity-5 object-contain md:h-40 md:w-40 2xl:h-48 2xl:w-48"
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
                                className={`flex-col rounded-b-xl p-2 ${
                                  stakePoolMetadata?.colors?.fontColor
                                    ? `text-[${stakePoolMetadata?.colors?.fontColor}]`
                                    : 'text-gray-200'
                                } ${
                                  stakePoolMetadata?.colors?.backgroundSecondary
                                    ? `bg-[${stakePoolMetadata?.colors?.backgroundSecondary}]`
                                    : 'bg-white bg-opacity-10'
                                }`}
                                style={{
                                  background:
                                    stakePoolMetadata?.colors
                                      ?.backgroundSecondary,
                                }}
                              >
                                <div className="truncate font-semibold">
                                  {tk.metadata?.data.name ||
                                    tk.tokenListData?.symbol}
                                </div>
                                {showFungibleTokens &&
                                  tk.tokenAccount &&
                                  tk.tokenAccount?.account.data.parsed.info
                                    .tokenAmount.amount > 1 && (
                                    <div className="mt-2">
                                      <div className="truncate font-semibold">
                                        <div className="flex w-full flex-row justify-between text-xs font-semibold">
                                          <span>Available:</span>
                                          <span className="px-1">
                                            {formatAmountAsDecimal(
                                              tk.tokenAccount.account.data
                                                .parsed.info.tokenAmount
                                                .decimals,
                                              tk.tokenAccount?.account.data
                                                .parsed.info.tokenAmount.amount,
                                              tk.tokenAccount.account.data
                                                .parsed.info.tokenAmount
                                                .decimals
                                            )}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="flex w-full flex-row justify-between text-xs font-semibold">
                                        <span>Amount:</span>
                                        <input
                                          className="flex w-3/4 rounded-md bg-transparent px-1 text-right text-xs font-medium focus:outline-none"
                                          type="text"
                                          placeholder={'Enter Amount'}
                                          onChange={(e) => {
                                            selectUnstakedToken(
                                              tk,
                                              e.target.value
                                            )
                                          }}
                                        />
                                      </div>
                                    </div>
                                  )}
                              </div>
                            </div>
                            {isUnstakedTokenSelected(tk) && (
                              <div
                                className={`absolute top-2 left-2`}
                                style={{
                                  height: '10px',
                                  width: '10px',
                                  backgroundColor:
                                    stakePoolMetadata?.colors?.primary ||
                                    '#FFFFFF',
                                  borderRadius: '50%',
                                  display: 'inline-block',
                                }}
                              />
                            )}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between gap-5">
              {!stakePoolMetadata?.receiptType ? (
                <Tooltip
                  title={
                    receiptType === ReceiptType.Original
                      ? 'Lock the original token(s) in your wallet when you stake'
                      : 'Receive a dynamically generated NFT receipt representing your stake'
                  }
                >
                  <div className="flex cursor-pointer flex-row gap-2">
                    <Toggle
                      defaultValue={receiptType === ReceiptType.Original}
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
                    />
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
                </Tooltip>
              ) : (
                <div></div>
              )}
              <div className="flex gap-5">
                <Tooltip title="Click on tokens to select them">
                  <button
                    onClick={() => {
                      if (unstakedSelected.length === 0) {
                        notify({
                          message: `No tokens selected`,
                          type: 'error',
                        })
                      } else {
                        handleStake.mutate({
                          tokenDatas: unstakedSelected,
                          receiptType,
                        })
                      }
                    }}
                    style={{
                      background:
                        stakePoolMetadata?.colors?.secondary ||
                        defaultSecondaryColor,
                      color:
                        stakePoolMetadata?.colors?.fontColorSecondary ||
                        stakePoolMetadata?.colors?.fontColor,
                    }}
                    className="my-auto flex rounded-md px-4 py-2 hover:scale-[1.03]"
                  >
                    <span className="mr-1 inline-block">
                      {handleStake.isLoading && (
                        <LoadingSpinner
                          fill={
                            stakePoolMetadata?.colors?.fontColor
                              ? stakePoolMetadata?.colors?.fontColor
                              : '#FFF'
                          }
                          height="20px"
                        />
                      )}
                    </span>
                    <span className="my-auto">
                      Stake ({unstakedSelected.length})
                    </span>
                  </button>
                </Tooltip>
                <Tooltip title="Attempt to stake all tokens at once">
                  <button
                    onClick={() => {
                      setUnstakedSelected(allowedTokenDatas.data || [])
                    }}
                    style={{
                      background:
                        stakePoolMetadata?.colors?.secondary ||
                        defaultSecondaryColor,
                      color:
                        stakePoolMetadata?.colors?.fontColorSecondary ||
                        stakePoolMetadata?.colors?.fontColor,
                    }}
                    className="my-auto flex cursor-pointer rounded-md px-4 py-2 hover:scale-[1.03]"
                  >
                    <span className="my-auto">Select All</span>
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
          <div
            className={`rounded-md p-10 ${
              stakePoolMetadata?.colors?.fontColor ? '' : 'text-gray-200'
            } bg-white bg-opacity-5`}
            style={{
              background: stakePoolMetadata?.colors?.backgroundSecondary,
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
                      <LoadingSpinner
                        fill={
                          stakePoolMetadata?.colors?.fontColor
                            ? stakePoolMetadata?.colors?.fontColor
                            : '#FFF'
                        }
                        height="25px"
                      />
                    )}
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
                className="relative my-auto mb-4 h-[60vh] overflow-y-auto overflow-x-hidden rounded-md bg-white bg-opacity-5 p-5"
                style={{
                  background:
                    stakePoolMetadata?.colors?.backgroundSecondary &&
                    contrastify(
                      0.05,
                      stakePoolMetadata?.colors?.backgroundSecondary
                    ),
                }}
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
                    No tokens currently staked.
                  </p>
                ) : (
                  <div
                    className={
                      'grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3'
                    }
                  >
                    {!stakePoolMetadata?.notFound &&
                      stakedTokenDatas.data &&
                      stakedTokenDatas.data.map((tk) => (
                        <StakedToken
                          key={tk?.stakeEntry?.pubkey.toBase58()}
                          tk={tk}
                          receiptType={receiptType}
                          select={() => selectStakedToken(tk)}
                          selected={isStakedTokenSelected(tk)}
                          loadingClaim={
                            handleClaimRewards.isLoading &&
                            isStakedTokenSelected(tk)
                          }
                          loadingUnstake={
                            handleUnstake.isLoading && isStakedTokenSelected(tk)
                          }
                        />
                      ))}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-2 flex flex-row-reverse flex-wrap justify-between gap-5">
              <div className="flex gap-5">
                <Tooltip
                  title={'Unstake will automatically claim reward for you.'}
                >
                  <button
                    onClick={() => {
                      if (stakedSelected.length === 0) {
                        notify({
                          message: `No tokens selected`,
                          type: 'error',
                        })
                      } else {
                        handleUnstake.mutate({ tokenDatas: stakedSelected })
                      }
                    }}
                    style={{
                      background:
                        stakePoolMetadata?.colors?.secondary ||
                        defaultSecondaryColor,
                      color:
                        stakePoolMetadata?.colors?.fontColorSecondary ||
                        stakePoolMetadata?.colors?.fontColor,
                    }}
                    className="my-auto flex rounded-md px-4 py-2 hover:scale-[1.03]"
                  >
                    <span className="mr-1 inline-block">
                      {handleUnstake.isLoading && (
                        <LoadingSpinner
                          fill={
                            stakePoolMetadata?.colors?.fontColor
                              ? stakePoolMetadata?.colors?.fontColor
                              : '#FFF'
                          }
                          height="20px"
                        />
                      )}
                    </span>
                    <span className="my-auto">
                      Unstake ({stakedSelected.length})
                    </span>
                  </button>
                </Tooltip>
                <Tooltip title="Attempt to unstake all tokens at once">
                  <button
                    onClick={() => {
                      setStakedSelected(stakedTokenDatas.data || [])
                    }}
                    style={{
                      background:
                        stakePoolMetadata?.colors?.secondary ||
                        defaultSecondaryColor,
                      color:
                        stakePoolMetadata?.colors?.fontColorSecondary ||
                        stakePoolMetadata?.colors?.fontColor,
                    }}
                    className="my-auto flex cursor-pointer rounded-md px-4 py-2 hover:scale-[1.03]"
                  >
                    <span className="my-auto">Select All</span>
                  </button>
                </Tooltip>
              </div>
              <div className="flex gap-5">
                {rewardDistributorData.data &&
                  rewards.data?.claimableRewards.gt(new BN(0)) && (
                    <button
                      onClick={() => {
                        if (stakedSelected.length === 0) {
                          notify({
                            message: `No tokens selected`,
                            type: 'error',
                          })
                        } else {
                          handleClaimRewards.mutate({
                            tokenDatas: stakedSelected,
                          })
                        }
                      }}
                      disabled={!rewards.data?.claimableRewards.gt(new BN(0))}
                      style={{
                        background:
                          stakePoolMetadata?.colors?.secondary ||
                          defaultSecondaryColor,
                        color:
                          stakePoolMetadata?.colors?.fontColorSecondary ||
                          stakePoolMetadata?.colors?.fontColor,
                      }}
                      className="my-auto flex rounded-md px-4 py-2 hover:scale-[1.03]"
                    >
                      <span className="mr-1 inline-block">
                        {handleClaimRewards.isLoading && (
                          <LoadingSpinner
                            fill={
                              stakePoolMetadata?.colors?.fontColor
                                ? stakePoolMetadata?.colors?.fontColor
                                : '#FFF'
                            }
                            height="20px"
                          />
                        )}
                      </span>
                      <span className="my-auto">
                        Claim Rewards ({stakedSelected.length})
                      </span>
                    </button>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {!stakePoolMetadata?.hideFooter ? (
        <Footer bgColor={stakePoolMetadata?.colors?.primary} />
      ) : (
        <div className="h-24"></div>
      )}
    </div>
  )
}

export default StakePoolHome
