import { AccountData, tryGetAccount } from '@cardinal/common'
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
import { getStakePool } from '@cardinal/staking/dist/cjs/programs/stakePool/accounts'
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

function Home() {
  const router = useRouter()
  const { stakePoolId } = router.query
  const { connection } = useEnvironmentCtx()
  const [stakePool, setStakePool] = useState<AccountData<StakePoolData>>()
  const wallet = useWallet()
  const { stakedRefreshing, setStakedAddress, stakedTokenDatas, stakedLoaded } =
    useStakedTokenData()
  const { refreshing, setAddress, tokenDatas, loaded } = useUserTokenData()
  const [unstakedSelected, setUnstakedSelected] = useState<TokenData[]>([])
  const [stakedSelected, setStakedSelected] = useState<TokenData[]>([])

  useEffect(() => {
    if (wallet && wallet.connected && wallet.publicKey) {
      setAddress(wallet.publicKey.toBase58())
      setStakedAddress(wallet.publicKey.toBase58())
    }
  }, [wallet.publicKey])

  useEffect(() => {
    if (stakePoolId) {
      const setData = async () => {
        setStakePool(await getStakePool(connection, new PublicKey(stakePoolId)))
      }
      setData().catch(console.error)
    }
  }, [stakePoolId])

  const filterTokens = () => {
    if (!stakePool) {
      return tokenDatas
    }
    return tokenDatas

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
  }
  async function handleUnstake() {
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
        console.log('Unstaking...')
        // stake
        const transaction = await unstake(connection, wallet as Wallet, {
          stakePoolId: stakePool?.pubkey,
          originalMintId: token.stakeEntry.parsed.originalMint,
        })
        await executeTransaction(connection, wallet as Wallet, transaction, {})
        notify({ message: `Successfully unstaked`, type: 'success' })
        console.log('Successfully unstaked')
      } catch (e) {
        notify({ message: `Transaction failed: ${e}`, type: 'error' })
        console.error(e)
      } finally {
        break
      }
    }
  }

  async function handleStake() {
    if (!wallet) {
      throw new Error('Wallet not connected')
    }
    if (!stakePool) {
      throw new Error('No stake pool detected')
    }

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
        notify({ message: `Successfully staked`, type: 'success' })
        console.log('Successfully staked')
      } catch (e) {
        notify({ message: `Transaction failed: ${e}`, type: 'error' })
        console.error(e)
      } finally {
        break
      }
    }
  }

  const isUnstakedTokenSelected = (tk: TokenData) =>
    unstakedSelected.includes(tk)
  const isStakedTokenSelected = (tk: TokenData) => stakedSelected.includes(tk)

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
          <div className="my-2 grid h-full grid-cols-2 gap-4">
            <div className="flex max-h-[85vh] flex-col rounded-md bg-white bg-opacity-5 p-10 text-gray-200">
              <div className="mt-2 flex flex-row">
                <p className="mb-3 text-lg">Select your NFTs</p>
                {refreshing ? <LoadingSpinner height="25px" /> : ''}
              </div>
              {wallet.connected && (
                <div className="my-3 flex-auto overflow-auto">
                  <div className="my-auto mb-4  rounded-md bg-white bg-opacity-5 p-5">
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
                                      setUnstakedSelected((tks) =>
                                        tks.filter(
                                          (data) =>
                                            data.tokenAccount?.account.data.parsed.info.mint.toString() !==
                                            tk.tokenAccount?.account.data.parsed.info.mint.toString()
                                        )
                                      )
                                    } else {
                                      setUnstakedSelected((tokens) =>
                                        tokens.concat(tk)
                                      )
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
                  className="rounded-md bg-blue-700 px-4 py-2"
                >
                  Stake NFTs
                </button>
              </div>
            </div>
            <div className="rounded-md bg-white bg-opacity-5 p-10 text-gray-200">
              <div className="mt-2 flex flex-row">
                <p className="text-lg">View Staked NFTs</p>
                {stakedRefreshing ? <LoadingSpinner height="25px" /> : ''}
              </div>
              {wallet.connected && (
                <div className="my-3 flex-auto overflow-auto">
                  <div className="my-auto mb-4  rounded-md bg-white bg-opacity-5 p-5">
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
                                  // checked={isJamboSelected(token)}
                                  className="absolute top-[8px] right-[8px] h-4 w-4 rounded-sm text-green-600"
                                  id={tk?.tokenAccount?.pubkey.toBase58()}
                                  name={tk?.tokenAccount?.pubkey.toBase58()}
                                  onChange={() => {
                                    if (isStakedTokenSelected(tk)) {
                                      setStakedSelected((tks) =>
                                        tks.filter(
                                          (data) =>
                                            data.tokenAccount?.account.data.parsed.info.mint.toString() !==
                                            tk.tokenAccount?.account.data.parsed.info.mint.toString()
                                        )
                                      )
                                    } else {
                                      setStakedSelected((tokens) =>
                                        tokens.concat(tk)
                                      )
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
                  className="rounded-md bg-blue-700 px-4 py-2"
                >
                  Unstake NFTs
                </button>
                <button
                  onClick={handleClaimRewards}
                  className="mr-5 rounded-md bg-blue-700 px-4 py-2"
                >
                  Claim Rewards
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
