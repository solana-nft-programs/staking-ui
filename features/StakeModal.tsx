import { Authorized, Connection, Keypair, LAMPORTS_PER_SOL, Lockup, PublicKey, sendAndConfirmTransaction, StakeProgram } from "@solana/web3.js"
import { useContext, useEffect, useState } from "react"
import { LoadingSpinner } from 'common/LoadingSpinner'
import { Dialog } from '@headlessui/react'
import { useWallet } from "@solana/wallet-adapter-react"
import { useEnvironmentCtx } from "providers/EnvironmentProvider"
import { Button } from "components/Button"
import { useNotifications } from "hooks/useNotifications"

const VOTE_KEY = 'LodezVTbz3v5GK6oULfWNFfcs7D4rtMZQkmRjnh65gq'
type StakeModal = {
  isOpen: boolean,
  setIsOpen: (open: boolean) => void,
}

export function StakeModal(props: StakeModal) {
  const { isOpen, setIsOpen } = props
  const wallet = useWallet()
  const { secondaryConnection } = useEnvironmentCtx()

  const address = wallet.publicKey
  async function getWalletBalance(address: PublicKey) {
    return await secondaryConnection.getAccountInfo(address)
  }
  // @ts-ignore
  const account = getWalletBalance(wallet.publicKey)

  const [error, setError] = useState<string | null>(null)
  const [amountToStake, setAmountToStake] = useState<string>('')
  const [creatingStakeAccount, setCreatingStakeAccount] = useState(false)
  const [stakeAmount, setStakeAmount] = useState(0)
  
  const { notify } = useNotifications()

  useEffect(() => {
    // @ts-ignore
    if (Number(amountToStake) > (account.lamports ?? 0) / LAMPORTS_PER_SOL) {
      setError('Insufficient SOL balance')
    }
    else {
      setError(null);
    }
  }, [account, amountToStake])

  return(
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
      <Dialog.Panel className="mx-auto w-1/2 rounded-lg text-neutral-200 bg-neutral-900 border border-neutral-700">
          <StakeForm />
      </Dialog.Panel>
    </div>
  </Dialog>
  )
}

export function StakeForm() {
  const wallet = useWallet()
  const { secondaryConnection } = useEnvironmentCtx()

  const address = wallet.publicKey
  const [amountToStake, setAmountToStake] = useState<string>('')
  const [creatingStakeAccount, setCreatingStakeAccount] = useState(false)
  const [stakeAmount, setStakeAmount] = useState(0)
  
  const { notify } = useNotifications()

  async function handleSolStake() {
    const publicKey = wallet.publicKey
    if(!publicKey){
      notify({ message: `Wallet not connected`, type: 'error' })
      return
    }
    if(!stakeAmount || stakeAmount <= 0) {
      notify({ message: `Stake amount needs to be greater than 0`, type: 'error' })
      return
    }
    console.log(stakeAmount)
    setCreatingStakeAccount(true)
    try {
      const stakeAccount = Keypair.generate()// TODO: Review for better / secure
      const minimumRent = await secondaryConnection.getMinimumBalanceForRentExemption(
        StakeProgram.space
      )
      const amountToStake = minimumRent + (stakeAmount * LAMPORTS_PER_SOL)
      const createStakeAccountTx = StakeProgram.createAccount({
        authorized: new Authorized(publicKey, publicKey), // Here we set two authorities: Stake Authority and Withdrawal Authority. Both are set to our wallet.
        fromPubkey: publicKey,
        lamports: amountToStake,
        lockup: new Lockup(0, 0, publicKey), // Optional. We'll set this to 0 for demonstration purposes.
        stakePubkey: stakeAccount.publicKey,
      })

      const createStakeAccountTxId = await wallet.sendTransaction(
        createStakeAccountTx,
        secondaryConnection,
        {signers: [stakeAccount]}
      )

      console.log(`Stake account created. Tx Id: ${createStakeAccountTxId}`)

      let stakeBalance = await secondaryConnection.getBalance(stakeAccount.publicKey)

      console.log(`Stake account balance: ${stakeBalance / LAMPORTS_PER_SOL} SOL`)

      // TODO: We need to capture better errors as this doesn't matter and shouldn't fail the
      // entire set.
      // let stakeStatus = await connection.getStakeActivation(stakeAccount.publicKey)
      // console.log(`Stake account status: ${stakeStatus.state}`)

      const selectedValidatorPubkey = new PublicKey(VOTE_KEY)

      const delegateTx = StakeProgram.delegate({
        stakePubkey: stakeAccount.publicKey,
        authorizedPubkey: publicKey,
        votePubkey: selectedValidatorPubkey,
      })

      const delegateTxId = await wallet.sendTransaction(
        delegateTx,
        secondaryConnection
      )

      console.log(
        `Stake account delegated to ${selectedValidatorPubkey}. Tx Id: ${delegateTxId}`
      )
      let stakeStatus = await secondaryConnection.getStakeActivation(stakeAccount.publicKey)
      console.log(`Stake account status: ${stakeStatus.state}`)
    } catch(err: any) {
      console.error(err)
    }
  }
  return (
    // https://docs.solana.com/cluster/stake-delegation-and-rewards
    // https://stakeview.app/apy/305.json
    <div>
      <div>
        <h2>Vote Account: </h2>
        <h2>Identity: </h2>
      </div>
      <div>
        <p>Estimated APY</p>
        <pre>6.22%</pre>
      </div>
      <div>
        ◎<input name="sol_stake" type={'text'}></input>
      </div>
      <div>
        <h2>Projected returns</h2>
        <div>Period ◎ Earned Total</div>
        <div>Epoch</div>
        <div>Month</div>
        <div>Year</div>
      </div>
      <Button
        as="button" size="sm" variant="secondary"
        onClick={() => handleSolStake()}
      >Stake SOL</Button>
    </div>
  )
}