import {
  createStakeEntryAndStakeMint,
  stake,
  unstake,
  claimRewards,
} from '@cardinal/staking'
import '@dialectlabs/react-ui/index.css'
import { ReceiptType } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, Signer, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Header } from 'common/Header'
import Head from 'next/head'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useEffect, useState } from 'react'
import { Wallet } from '@metaplex/js'
import { LoadingSpinner } from 'common/LoadingSpinner'
import { contrastColorMode, pubKeyUrl, secondstoDuration } from 'common/utils'
import {
  formatAmountAsDecimal,
  formatMintNaturalAmountAsDecimal,
  getMintDecimalAmountFromNatural,
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
import { defaultSecondaryColor, TokenStandard } from 'api/mapping'
import { Footer } from 'common/Footer'
import { DisplayAddress } from '@cardinal/namespaces-components'
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
import { lighten, darken } from '@mui/material'
import { QuickActions } from 'common/QuickActions'
import * as splToken from '@solana/spl-token'
import { usePoolAnalytics } from 'hooks/usePoolAnalytics'
import { useRewardsRate } from 'hooks/useRewardsRate'
import { useSentriesStats } from 'hooks/useSentriesStats'
import { Button } from 'common/Button'
import { Notifications } from 'components/Notifications'
import { useNotifications } from 'hooks/useNotifications'


const MAX_EPOCH = new BN(2).pow(new BN(64)).sub(new BN(1))

function Home() {
  const router = useRouter()
  const { connection } = useEnvironmentCtx()
  const wallet = useWallet()
  const walletModal = useWalletModal()
  const { data: stakePool, isFetched: stakePoolLoaded } = useStakePoolData()
  const stakedTokenDatas = useStakedTokenDatas()
  const rewardDistributorData = useRewardDistributorData()
  // const rewardMintInfo = useRewardMintInfo()
  const stakePoolEntries = useStakePoolEntries()
  const maxStaked = useStakePoolMaxStaked()
  const rewardEntries = useRewardEntries()
  // const rewards = useRewards()
  // const rewardsRate = useRewardsRate()
  const sentriesStats = useSentriesStats()

  const [unstakedSelected, setUnstakedSelected] = useState<AllowedTokenData[]>(
    []
  )
  const [stakedSelected, setStakedSelected] = useState<StakeEntryTokenData[]>(
    []
  )
  const [loadingStake, setLoadingStake] = useState(false)
  const [loadingUnstake, setLoadingUnstake] = useState(false)
  const [singleTokenAction, setSingleTokenAction] = useState('')
  const [totalStaked, setTotalStaked] = useState('')
  const [receiptType, setReceiptType] = useState<ReceiptType>(
    ReceiptType.Original
  )
  const [loadingClaimRewards, setLoadingClaimRewards] = useState(false)
  const [showAllowedTokens, setShowAllowedTokens] = useState<boolean>()
  const [showFungibleTokens, setShowFungibleTokens] = useState(false)
  const allowedTokenDatas = useAllowedTokenDatas(showFungibleTokens)
  const { data: stakePoolMetadata } = useStakePoolMetadata()
  const rewardDistributorTokenAccountData = useRewardDistributorTokenAccount()
  const { UTCNow } = useUTCNow()
  const analytics = usePoolAnalytics()
  const { notify } = useNotifications()

  // OG content
  const description = "Stake your Sentry NFT to start earning rewards."
  const title = "Sentries NFT Staking"
  const keyword = "Sentries NFTs, Sentries Validators, NFTs"
  const url = "https://sentries.io"
  const image = "https://sentries.io/images/og_stake_image.png"
  

  if (stakePoolMetadata?.redirect) {
    router.push(stakePoolMetadata?.redirect)
    return
  }

  function formatEpoch(epoch: BN) {
    return epoch.eq(MAX_EPOCH) ? '-' : epoch.toString();
  }

  useEffect(() => {
    stakePoolMetadata?.tokenStandard &&
      setShowFungibleTokens(
        stakePoolMetadata?.tokenStandard === TokenStandard.Fungible
      )
    stakePoolMetadata?.receiptType &&
      setReceiptType(stakePoolMetadata?.receiptType)
  }, [stakePoolMetadata?.name])

  async function handleClaimRewards(all?: boolean) {
    setLoadingClaimRewards(true)
    if (!wallet) {
      throw new Error('Wallet not connected')
    }
    if (!stakePool) {
      notify({ message: `No stake pool detected`, type: 'error' })
      return
    }

    const txs: (Transaction | null)[] = await Promise.all(
      (all ? stakedTokenDatas.data || [] : stakedSelected).map(
        async (token) => {
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
        }
      )
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
    setStakedSelected([])
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
      setTotalStaked('0')
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
    setTotalStaked(Math.ceil(total).toString())
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

  return (
    <>
    <main className="pt-6 relative">
      <Head>
        <title>Sentries NFT Staking</title>
        <meta name="description" content="Stake your Sentry NFT increase your Power." />
        <link rel="icon" href="/favicon.png" />
        <meta property="og:type" content="website"/>
        <meta name="description" content={description}/>
        <meta property="og:title" content={title}/>
        <meta name="description" content={description}/>
        <meta name="keywords" content={keyword}/>
        <meta property="og:url" content={url}/>
        <meta property="og:description" content={description}/>
        <meta property="og:image" content={image}/>
      </Head>
      <Header />
      <div className="w-[420px] h-[420px] fixed top-1/2 -left-[210px] bg-teal-400 rounded-full blur-[300px] z-[-1] opacity-30"></div>
      <div className="w-[120px] h-[120px] fixed bottom-0 -right-[60px] bg-purple-400 rounded-full blur-[60px] z-[-1] opacity-30"></div>
      <div className="container mx-auto w-full z-10 z-100">
        <div className="flex my-8 text-white">
          <div className="w-1/2">
            <h1 className="text-4xl font-bold text-white mb-2">
              The Power Grid
            </h1>
            <p className="text-lg w-3/4 text-neutral-300">Stake your Sentry here, and power it up by locking SOL in our validator, The Lode</p>
          </div>
          <div className="w-1/2">
            <Button variant="primary" onClick={() => {
                notify({
                message: `No NFTs selected`,
                type: 'success',
              })
            }}>Learn More</Button>
          </div>
        </div>
        <div className=' py-6 px-10 mb-4 mx-5'>
          <p>The Power Grid is the rewards pool through which holders earn from the growth of the Sentries business. Stake now to become eligible for enhanced rewards.</p>
          <p>Click <a href="https://www.sentries.io/stake-with-sentries" target="_BLANK">here for staking with the validator instructions</a>.</p>
        </div>
        {/* <div>
        {(solStakeAccount && solStakeAccount.data) ? (
          <>
          Staked:
          {// @ts-ignore
            solStakeAccount.data[0].lamports / LAMPORTS_PER_SOL
          } SOL <br />
          {// @ts-ignore
            solStakeAccount.data[0].address.toString()
          } <br />
          Epoch Activated:
          {// @ts-ignore
          // If current epoch is activated epoch then show as activating..?
          // Same with deactivating...
            formatEpoch(solStakeAccount.data[0].stakeAccount.info.stake.delegation.activationEpoch)
          } <br />
          {
            // @ts-ignore
            // TODO: Calculate APY?
            solStakeAccount.data[0].inflationRewards.map((reward) => (
              <>
              Epoch: {reward.epoch}
              Reward: {reward.amount / LAMPORTS_PER_SOL}
              Post Balance: {reward.postBalance / LAMPORTS_PER_SOL}
              <br />
              </>
            ))}
          </>
        ) : (
          <>
          Error
          </>
        )}
        </div>
        <div>
        {(epochInfo && epochInfo.data) ? (
          <>
          Current slot:
          {
            //@ts-ignore
            epochInfo.data?.epochInfo.absoluteSlot
          }<br />
          Blockheight: 
          {
            //@ts-ignore
            epochInfo.data?.epochInfo.blockHeight
          }<br />
          Current epoch:
          {
            //@ts-ignore
            epochInfo.data?.epochInfo.epoch
          }<br />
          Slot index:
          {
            //@ts-ignore
            epochInfo.data?.epochInfo.slotIndex
          }<br />
          Slots in current epoch:
          {
            //@ts-ignore
            epochInfo.data?.epochInfo.slotsInEpoch
          }<br />
          Transaction count:
          {
            //@ts-ignore
            epochInfo.data?.epochInfo.transactionCount
          }<br />
          Epoch progress (%):
          {
            //@ts-ignore
            epochInfo.data?.epochProgress * 100
          }<br />
          Epoch time remaining (s):
          {
            //@ts-ignore
            epochInfo.data?.epochTimeRemaining
          }
          </>
        ) : (
          <></>
        )}
        </div> */}
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
                      color: stakePoolMetadata?.colors?.fontColor,
                    }
                  : {}
              }
              onClick={() => walletModal.setVisible(true)}
            >
              Connect wallet to continue
            </div>
          )
        )}
        {(maxStaked || rewardDistributorData) && !stakePoolMetadata?.notFound && (
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
            {stakePoolEntries.data ? (
              <>
                <div className="inline-block text-lg">
                  Total Sentries Staked: {Number(totalStaked).toLocaleString()}{' '}
                  {stakePoolMetadata?.maxStaked
                    ? `/ ${stakePoolMetadata?.maxStaked.toLocaleString()}`
                    : '/ 8,000'}
                </div>
                {8000 > 0 && (
                  <div className="inline-block text-lg">
                    {/*TODO: Change how many total NFTs can possibly be staked for your collection (default 10000) */}
                    Percent Staked:{' '}
                    {stakePoolEntries.data?.length &&
                      Math.floor(
                        ((stakePoolEntries.data?.length * 100) / 8000) *
                        8000
                      ) / 8000}
                    %
                  </div>
                )}
              </>
            ) : (
              <div className="relative flex h-8 flex-grow items-center justify-center">
                <span
                  className={`${
                    stakePoolMetadata?.colors?.fontColor
                      ? `text-[${stakePoolMetadata?.colors?.fontColor}]`
                      : 'text-gray-500'
                  }`}
                >
                  Loading pool info...
                </span>
                <div className="absolute w-full animate-pulse items-center justify-center rounded-lg bg-white bg-opacity-10 p-5"></div>
              </div>
            )}
            
          </div>
        )}
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
          {(sentriesStats.data && 
              Object.keys(sentriesStats.data).length > 0 &&
              // @ts-ignore
              !(Object.keys(sentriesStats.data).includes('error')) ? (
                <div className="relative flex flex-grow items-center justify-center">
                  <span className='text-lg'
                    >
                    You current SOL staked with The Lode is {
                    // @ts-ignore
                    sentriesStats.data.total_staked ? sentriesStats.data.total_staked : 0
                    } ◎<br />You will need {
                    // @ts-ignore
                    sentriesStats.data.max_power_level_sol < 0 ? 0 : sentriesStats.data.max_power_level_sol
                    } ◎ to power up the {
                    // @ts-ignore
                    sentriesStats.data.nft_count
                    } Sentries NFT{
                    // @ts-ignore
                    (sentriesStats.data.nft_count > 1) ? ('s') : ('')
                    }
                  </span>
                </div>
            ) : (
              <div className="relative flex flex-grow items-center justify-center">
                {!(
                  sentriesStats.isFetched
                ) ? (
                  <>
                    <span
                      className={`${
                        stakePoolMetadata?.colors?.fontColor
                          ? `text-[${stakePoolMetadata?.colors?.fontColor}]`
                          : 'text-gray-500'
                      }`}
                    >
                      Loading your locked SOL staked in The Lode...
                    </span>
                    <div className="absolute w-full animate-pulse items-center justify-center rounded-lg bg-white bg-opacity-10 p-5"></div>
                  </>
                ) : (
                  <div>
                    Unable to load staking data for your locked stake in The Lode.
                  </div>

                )}
                </div>
            )
          )}
        </div>
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
                  Select Your Sentries
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
            </div>
            <div className="my-3 flex-auto overflow-auto">
              <div
                className="relative my-auto mb-4 h-[60vh] overflow-y-auto overflow-x-hidden rounded-md bg-white bg-opacity-5 p-5"
                style={{
                  background:
                    stakePoolMetadata?.colors?.backgroundSecondary &&
                    (contrastColorMode(
                      stakePoolMetadata?.colors?.primary ?? '#000000'
                    )[1]
                      ? lighten(
                          stakePoolMetadata?.colors?.backgroundSecondary,
                          0.05
                        )
                      : darken(
                          stakePoolMetadata?.colors?.backgroundSecondary,
                          0.05
                        )),
                }}
              >
                {!allowedTokenDatas.isFetched ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="h-[200px] animate-pulse rounded-lg bg-white bg-opacity-5 p-10"></div>
                    <div className="h-[200px] animate-pulse rounded-lg bg-white bg-opacity-5 p-10"></div>
                    <div className="h-[200px] animate-pulse rounded-lg bg-white bg-opacity-5 p-10"></div>
                  </div>
                ) : (allowedTokenDatas.data || []).length == 0 ? (
                  <p
                    className={`font-normal text-[${
                      stakePoolMetadata?.colors?.fontColor
                        ? `text-[${stakePoolMetadata?.colors?.fontColor}]`
                        : 'text-gray-400'
                    }]`}
                  >
                    No Sentries found in your connected wallet.
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
                                setLoadingClaimRewards={setLoadingClaimRewards}
                                setSingleTokenAction={setSingleTokenAction}
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
              <div className="flex gap-5">
                <MouseoverTooltip title="Click on your NFTs to select them">
                  <button
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
                    </span>
                    <span className="my-auto">
                      Stake ({unstakedSelected.length})
                    </span>
                  </button>
                </MouseoverTooltip>
                <MouseoverTooltip title="Attempt to stake all NFTs at once">
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
                </MouseoverTooltip>
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
                  View Staked Sentries{' '}
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
            </div>
            <div className="my-3 flex-auto overflow-auto">
              <div
                className="relative my-auto mb-4 h-[60vh] overflow-y-auto overflow-x-hidden rounded-md bg-white bg-opacity-5 p-5"
                style={{
                  background:
                    stakePoolMetadata?.colors?.backgroundSecondary &&
                    (contrastColorMode(
                      stakePoolMetadata?.colors?.primary ?? '#000000'
                    )[1]
                      ? lighten(
                          stakePoolMetadata?.colors?.backgroundSecondary,
                          0.05
                        )
                      : darken(
                          stakePoolMetadata?.colors?.backgroundSecondary,
                          0.05
                        )),
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
                    No Sentries currently staked.
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
                        <div
                          key={tk?.stakeEntry?.pubkey.toBase58()}
                          className="mx-auto"
                        >
                          <div className="relative w-44 md:w-auto 2xl:w-48">
                            <label
                              htmlFor={tk?.stakeEntry?.pubkey.toBase58()}
                              className="relative"
                            >
                              <div
                                className="relative cursor-pointer rounded-xl"
                                onClick={() => selectStakedToken(tk)}
                                style={{
                                  boxShadow: isStakedTokenSelected(tk)
                                    ? `0px 0px 20px ${
                                        stakePoolMetadata?.colors?.secondary ||
                                        '#FFFFFF'
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
                                  className={`flex-col rounded-b-xl p-2 md:w-40 2xl:w-48 ${
                                    stakePoolMetadata?.colors?.fontColor
                                      ? `text-[${stakePoolMetadata?.colors?.fontColor}]`
                                      : 'text-gray-200'
                                  } ${
                                    stakePoolMetadata?.colors
                                      ?.backgroundSecondary
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
                                  <div className="mt-2">
                                    {tk.stakeEntry?.pubkey && (
                                      <div className="flex w-full flex-row justify-between text-xs font-semibold">
                                        <span>Boost:</span>
                                        <span>
                                          {(rewardDistributorData.data?.parsed
                                            .multiplierDecimals !== undefined &&
                                            formatAmountAsDecimal(
                                              rewardDistributorData.data?.parsed
                                                .multiplierDecimals || 0,
                                              rewardEntries.data
                                                ? rewardEntries.data.find(
                                                    (entry) =>
                                                      entry.parsed.stakeEntry.equals(
                                                        tk.stakeEntry?.pubkey!
                                                      )
                                                  )?.parsed.multiplier ||
                                                    rewardDistributorData.data
                                                      .parsed.defaultMultiplier
                                                : rewardDistributorData.data
                                                    .parsed.defaultMultiplier,
                                              rewardDistributorData.data.parsed
                                                .multiplierDecimals
                                            ).toString()) ||
                                            1}
                                          x
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                {isStakedTokenSelected(tk) && (
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
                              </div>
                            </label>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-2 flex flex-row-reverse flex-wrap justify-between gap-5">
              <div className="flex gap-5">
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
                      } else {
                        handleUnstake()
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
                    </span>
                    <span className="my-auto">
                      Unstake ({stakedSelected.length})
                    </span>
                  </button>
                </MouseoverTooltip>
                <MouseoverTooltip title="Attempt to unstake all tokens at once">
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
                </MouseoverTooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer bgColor={stakePoolMetadata?.colors?.primary} />
    </main>
    <Notifications />
    </>
  )
}

export default Home
