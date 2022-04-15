import { BigNumber } from 'bignumber.js'
import { AccountData, tryGetAccount } from '@cardinal/common'
import * as splToken from '@solana/spl-token'
import {
  createStakeEntryAndStakeMint,
  stake,
  unstake,
  claimRewards,
  executeTransaction,
} from '@cardinal/staking'
import {
  ReceiptType,
  StakePoolData,
} from '@cardinal/staking/dist/cjs/programs/stakePool'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { TokenData } from 'api/types'
import { Header } from 'common/Header'
import Head from 'next/head'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useEffect, useState } from 'react'
import { Wallet } from '@metaplex/js'
import { useUserTokenData } from 'providers/TokenDataProvider'
import { useStakedTokenData } from 'providers/StakedTokenDataProvider'
import { LoadingSpinner } from 'common/LoadingSpinner'
import { useRouter } from 'next/router'
import { notify } from 'common/Notification'
import { getMintDetails, handlePoolMapping } from 'common/utils'
import { getRewardDistributor } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/accounts'
import { findRewardDistributorId } from '@cardinal/staking/dist/cjs/programs/rewardDistributor/pda'
import {
  getMintDecimalAmountFromNatural,
  getMintNaturalAmountFromDecimal,
} from 'common/units'
import { BN } from '@project-serum/anchor'
import { RewardDistributorData } from '@cardinal/staking/dist/cjs/programs/rewardDistributor'
import { getPendingRewardsForPool } from '@cardinal/staking'

function Home() {
  const router = useRouter()
  const { stakePoolId } = router.query
  const { connection } = useEnvironmentCtx()
  const [stakePool, setStakePool] = useState<AccountData<StakePoolData>>()
  const [rewardDistributor, setRewardDistributor] =
    useState<AccountData<RewardDistributorData>>()
  const wallet = useWallet()
  const { stakedRefreshing, setStakedAddress, stakedTokenDatas, stakedLoaded } =
    useStakedTokenData()
  const { refreshing, setAddress, tokenDatas, loaded } = useUserTokenData()
  const [unstakedSelected, setUnstakedSelected] = useState<TokenData[]>([])
  const [stakedSelected, setStakedSelected] = useState<TokenData[]>([])
  const [claimableRewards, setClaimableRewards] = useState<number>(0)
  const [loadingRewards, setLoadingRewards] = useState<boolean>(false)
  const [loadingStake, setLoadingStake] = useState(false)
  const [loadingUnstake, setLoadingUnstake] = useState(false)
  const [loadingClaimRewards, setLoadingClaimRewards] = useState(false)
  const [mintName, setMintName] = useState('')
  const [loadingMintName, setLoadingMintName] = useState(true)
  const [mintInfo, setMintInfo] = useState<splToken.MintInfo>()

  useEffect(() => {
    if (wallet && wallet.connected && wallet.publicKey) {
      setAddress(wallet.publicKey.toBase58())
      setStakedAddress(wallet.publicKey.toBase58())
    }
  }, [wallet.publicKey])

  useEffect(() => {
    if (stakePoolId) {
      const setData = async () => {
        try {
          const pool = await handlePoolMapping(
            connection,
            stakePoolId as string
          )
          setStakePool(pool)
        } catch (e) {
          notify({
            message: `${e}`,
            type: 'error',
          })
        }
      }
      setData().catch(console.error)
    }
  }, [stakePoolId])

  useEffect(() => {
    if (stakePool) {
      const getRewards = async () => {
        setLoadingRewards(true)
        const [rewardDistributorId] = await findRewardDistributorId(
          stakePool!.pubkey
        )

        let rewardDistributorAcc: AccountData<RewardDistributorData> | null
        if (!rewardDistributor) {
          rewardDistributorAcc = await tryGetAccount(() =>
            getRewardDistributor(connection, rewardDistributorId)
          )
          if (!rewardDistributorAcc) {
            return
          }
          setRewardDistributor(rewardDistributorAcc)
        }
        if (!wallet) {
          throw new Error('Wallet not found')
        }

        if (rewardDistributor && mintName.length === 0) {
          setLoadingMintName(true)
          const mintDetails = await getMintDetails(
            rewardDistributor?.parsed.rewardMint.toString()
          )
          if (mintDetails) {
            setMintName(mintDetails[0].name)
          }
          setLoadingMintName(false)
        }

        let mint = new splToken.Token(
          connection,
          rewardDistributor!.parsed.rewardMint,
          splToken.TOKEN_PROGRAM_ID,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          null
        )
        setMintInfo(await mint.getMintInfo())

        let mintIds: PublicKey[] = []
        stakedTokenDatas.forEach((tk) => {
          if (!tk || !tk.stakeEntry) {
            return
          }
          mintIds.push(tk.stakeEntry?.parsed.originalMint!)
        })
        const rewards = await getPendingRewardsForPool(
          connection,
          wallet.publicKey!,
          mintIds,
          rewardDistributor!
        )
        let amount = new BN(
          Number(getMintDecimalAmountFromNatural(mintInfo!, new BN(rewards)))
        )
        setClaimableRewards(amount.toNumber())
        setLoadingRewards(false)
      }
      getRewards().catch(console.error)
    }
  }, [stakedTokenDatas])

  const filterTokens = () => {
    return tokenDatas.filter(
      (tk) => tk.tokenAccount?.account.data.parsed.info.state !== 'frozen'
    )

    // return tokenDatas.filter((token) => {
    //   let valid = false
    //   const creatorAddresses = stakePool.parsed.requiresCreators
    //   const collectionAddresses = stakePool.parsed.requiresCollections
    //   creatorAddresses.forEach((filterCreator) => {
    //     if (
    //       token?.metadata?.data?.properties?.creators.filter((c) => {
    //         c === filterCreator.toString()
    //       })
    //     ) {
    //       valid = true
    //     }
    //   })
    //   // TODO filter out collections
    //   return valid
    // })
  }

  const filteredTokens = filterTokens()

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
      throw new Error('No stake pool detected')
    }

    for (let step = 0; step < stakedSelected.length; step++) {
      try {
        let token = stakedSelected[step]
        if (!token || !token.stakeEntry) {
          throw new Error('No stake entry for token')
        }
        console.log('Claiming rewards...')

        const transaction = await claimRewards(connection, wallet as Wallet, {
          stakePoolId: stakePool.pubkey,
          originalMintId: token.stakeEntry.parsed.originalMint,
        })
        console.log(transaction)
        await executeTransaction(connection, wallet as Wallet, transaction, {})
        notify({ message: `Successfully claimed rewards`, type: 'success' })
        console.log('Successfully claimed rewards')
      } catch (e) {
        notify({ message: `Transaction failed: ${e}`, type: 'error' })
        console.error(e)
      } finally {
        break
      }
    }
    setLoadingClaimRewards(false)
  }
  async function handleUnstake() {
    if (!wallet) {
      throw new Error('Wallet not connected')
    }
    if (!stakePool) {
      throw new Error('No stake pool detected')
    }
    setLoadingUnstake(true)

    for (let step = 0; step < stakedSelected.length; step++) {
      try {
        let token = stakedSelected[step]
        if (!token || !token.stakeEntry) {
          throw new Error('No stake entry for token')
        }
        console.log('Unstaking...')
        // stake
        const transaction = await unstake(connection, wallet as Wallet, {
          stakePoolId: stakePool?.pubkey,
          originalMintId: token.stakeEntry.parsed.originalMint,
        })
        await executeTransaction(connection, wallet as Wallet, transaction, {})
        notify({
          message: `Successfully unstaked ${step + 1}/${stakedSelected.length}`,
          type: 'success',
        })
        console.log('Successfully unstaked')
      } catch (e) {
        notify({ message: `Transaction failed: ${e}`, type: 'error' })
        console.error(e)
      }
    }
    setLoadingUnstake(false)
  }

  async function handleStake() {
    if (!wallet) {
      throw new Error('Wallet not connected')
    }
    if (!stakePool) {
      throw new Error('No stake pool detected')
    }
    setLoadingStake(true)

    for (let step = 0; step < unstakedSelected.length; step++) {
      try {
        let token = unstakedSelected[step]
        if (!token || !token.tokenAccount) {
          throw new Error('Token account not set')
        }

        console.log('Creating stake entry and stake mint...')
        const [initTx, stakeMintKeypair] = await createStakeEntryAndStakeMint(
          connection,
          wallet as Wallet,
          {
            stakePoolId: stakePool?.pubkey,
            originalMintId: new PublicKey(
              token.tokenAccount.account.data.parsed.info.mint
            ),
          }
        )
        if (initTx.instructions.length > 0) {
          await executeTransaction(connection, wallet as Wallet, initTx, {
            signers: stakeMintKeypair ? [stakeMintKeypair] : [],
          })
        }
        console.log('Successfully created stake entry and stake mint')
        console.log('Staking...')
        // stake
        const transaction = await stake(connection, wallet as Wallet, {
          stakePoolId: stakePool?.pubkey,
          receiptType: ReceiptType.Receipt,
          originalMintId: new PublicKey(
            token.tokenAccount.account.data.parsed.info.mint
          ),
          userOriginalMintTokenAccountId: token.tokenAccount?.pubkey,
        })
        await executeTransaction(connection, wallet as Wallet, transaction, {})
        notify({
          message: `Successfully staked ${step + 1}/${unstakedSelected.length}`,
          type: 'success',
        })
        console.log('Successfully staked')
      } catch (e) {
        notify({ message: `Transaction failed: ${e}`, type: 'error' })
        console.error(e)
      }
    }
    setLoadingStake(false)
  }

  const isUnstakedTokenSelected = (tk: TokenData) =>
    unstakedSelected.some(
      (utk) =>
        utk.tokenAccount?.account.data.parsed.info.mint.toString() ===
        tk.tokenAccount?.account.data.parsed.info.mint.toString()
    )
  const isStakedTokenSelected = (tk: TokenData) =>
    stakedSelected.some(
      (stk) =>
        stk.stakeEntry?.parsed.originalMint.toString() ===
        tk.stakeEntry?.parsed.originalMint.toString()
    )

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
          {rewardDistributor ? (
            <div className="flex h-[10vh] max-h-[10vh] rounded-md bg-white bg-opacity-5 p-10 text-gray-200">
              <p className="mb-3 inline-block text-lg ">
                Reward Mint:{' '}
                <a
                  className="text-white underline"
                  href={
                    'https://explorer.solana.com/address/' +
                    rewardDistributor.parsed.rewardMint.toString()
                  }
                >
                  {mintName}
                </a>
              </p>
              {loadingMintName ? (
                <div className="mb-3 ml-2 inline-block text-lg">
                  <LoadingSpinner height="25px" />
                </div>
              ) : (
                ''
              )}
              <p className="mb-3 ml-10 inline-block text-lg ">
                Reward Duration Seconds:{' '}
                {rewardDistributor.parsed.rewardDurationSeconds.toNumber()}
              </p>
              <p className="mb-3 ml-10 inline-block text-lg ">
                Rewards Issued:{' '}
                {rewardDistributor.parsed.rewardsIssued.toNumber()}
              </p>
              {rewardDistributor.parsed.maxSupply ? (
                <p className="mb-3 ml-10 inline-block text-lg ">
                  Max Supply: {rewardDistributor.parsed.maxSupply.toNumber()}
                </p>
              ) : (
                ''
              )}
              <p className="mb-3 ml-10 mr-2 inline-block text-lg ">
                Claimable Rewards: {claimableRewards} {mintName}
              </p>
              {loadingRewards ? (
                <div className="mb-3 mr-3 inline-block text-lg">
                  <LoadingSpinner height="25px" />
                </div>
              ) : (
                ''
              )}
              {mintInfo ? (
                <p className="mb-3 ml-10 mr-2 inline-block text-lg ">
                  Rewards Rate:{' '}
                  {(
                    Number(
                      getMintDecimalAmountFromNatural(
                        mintInfo!,
                        new BN(rewardDistributor.parsed.rewardAmount)
                      )
                    ) /
                    rewardDistributor.parsed.rewardDurationSeconds.toNumber()
                  ).toFixed(2)}{' '}
                  {mintName}
                </p>
              ) : (
                ''
              )}
            </div>
          ) : (
            ''
          )}
          <div className="my-2 grid h-full grid-cols-2 gap-4">
            <div className="flex h-[85vh] max-h-[85vh] flex-col rounded-md bg-white bg-opacity-5 p-10 text-gray-200">
              <div className="mt-2 flex flex-row">
                <p className="mb-3 mr-3 inline-block text-lg">
                  Select your NFTs
                </p>
                <div className="inline-block">
                  {refreshing ? <LoadingSpinner height="25px" /> : ''}
                </div>
              </div>
              {wallet.connected && (
                <div className="my-3 flex-auto overflow-auto">
                  <div className="my-auto mb-4 min-h-[60vh] rounded-md bg-white bg-opacity-5 p-5">
                    {loaded && filteredTokens.length == 0 && (
                      <p>No NFTs found in wallet.</p>
                    )}
                    {loaded ? (
                      <div className="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-2 lg:grid-cols-3">
                        {filteredTokens.map((tk) => (
                          <div
                            className="relative"
                            key={tk?.tokenAccount?.pubkey.toBase58()}
                          >
                            <label
                              htmlFor={tk?.tokenAccount?.pubkey.toBase58()}
                              className="relative"
                            >
                              <div className="relative">
                                <img
                                  className="mt-2 rounded-lg"
                                  src={tk.metadata?.data.image}
                                  alt={tk.metadata?.data.name}
                                ></img>

                                <input
                                  type="checkbox"
                                  // checked={isJamboSelected(token)}
                                  className="absolute top-[8px] right-[8px] h-4 w-4 rounded-sm text-green-600"
                                  id={tk?.tokenAccount?.pubkey.toBase58()}
                                  name={tk?.tokenAccount?.pubkey.toBase58()}
                                  onChange={() => {
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
                                  }}
                                />
                              </div>
                            </label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>Loading your NFTs...</p>
                    )}
                  </div>
                </div>
              )}
              <div className="mt-2 flex flex-row-reverse">
                <button
                  onClick={handleStake}
                  className="my-auto flex rounded-md bg-blue-700 px-4 py-2"
                >
                  <span className="mr-1 inline-block">
                    {loadingStake ? <LoadingSpinner height="25px" /> : ''}
                  </span>
                  <span className="my-auto">Stake NFTs</span>
                </button>
              </div>
            </div>
            <div className="h-[85vh] max-h-[85vh] rounded-md bg-white bg-opacity-5 p-10 text-gray-200">
              <div className="mt-2 flex flex-row">
                <p className="mr-3 text-lg">View Staked NFTs</p>
                <div className="inline-block">
                  {stakedRefreshing ? <LoadingSpinner height="25px" /> : ''}
                </div>
              </div>
              {wallet.connected && (
                <div className="my-3 flex-auto overflow-auto">
                  <div className="my-auto mb-4 min-h-[60vh] rounded-md bg-white bg-opacity-5 p-5">
                    {stakedLoaded && stakedTokenDatas.length === 0 && (
                      <p>No NFTs currently staked.</p>
                    )}
                    {stakedLoaded ? (
                      <div className="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-2 lg:grid-cols-3">
                        {stakedTokenDatas.map((tk) => (
                          <div
                            className="relative"
                            key={tk?.tokenAccount?.pubkey.toBase58()}
                          >
                            <label
                              htmlFor={tk?.tokenAccount?.pubkey.toBase58()}
                              className="relative"
                            >
                              <div className="relative">
                                <img
                                  className="mt-2 rounded-lg"
                                  src={tk.metadata?.data.image}
                                  alt={tk.metadata?.data.name}
                                ></img>

                                <input
                                  type="checkbox"
                                  className="absolute top-[8px] right-[8px] h-4 w-4 rounded-sm text-green-600"
                                  id={tk?.stakeEntry?.pubkey.toBase58()}
                                  name={tk?.stakeEntry?.pubkey.toBase58()}
                                  onChange={() => {
                                    if (isStakedTokenSelected(tk)) {
                                      setStakedSelected(
                                        stakedSelected.filter(
                                          (data) =>
                                            data.stakeEntry?.parsed.originalMint.toString() !==
                                            tk.stakeEntry?.parsed.originalMint.toString()
                                        )
                                      )
                                    } else {
                                      setStakedSelected([...stakedSelected, tk])
                                    }
                                  }}
                                />
                              </div>
                            </label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>Loading your NFTs...</p>
                    )}
                  </div>
                </div>
              )}
              <div className="mt-2 flex flex-row-reverse">
                <button
                  onClick={handleUnstake}
                  className="my-auto flex rounded-md bg-blue-700 px-4 py-2"
                >
                  <span className="mr-1 inline-block">
                    {loadingUnstake ? <LoadingSpinner height="25px" /> : ''}
                  </span>
                  <span className="my-auto">Unstake NFTs</span>
                </button>
                {rewardDistributor ? (
                  <button
                    onClick={handleClaimRewards}
                    className="my-auto mr-5 flex rounded-md bg-blue-700 px-4 py-2"
                  >
                    <span className="mr-1 inline-block">
                      {loadingClaimRewards ? (
                        <LoadingSpinner height="20px" />
                      ) : (
                        ''
                      )}
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
      </div>
    </div>
  )
}

export default Home
