import { Authorized, Connection, Keypair, LAMPORTS_PER_SOL, Lockup, PublicKey, sendAndConfirmTransaction, StakeProgram } from "@solana/web3.js"
import { useContext, useEffect, useState } from "react"
import { LoadingSpinner } from 'common/LoadingSpinner'
import { Dialog } from '@headlessui/react'
import { useWallet } from "@solana/wallet-adapter-react"
import { useEnvironmentCtx } from "providers/EnvironmentProvider"
import { Button } from "./Button"

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

  useEffect(() => {
    // @ts-ignore
    if (Number(amountToStake) > (account.lamports ?? 0) / LAMPORTS_PER_SOL) {
      setError('Insufficient SOL balance')
    }
    else {
      setError(null);
    }
  }, [account, amountToStake])

  async function createTxn() {
    const stakeAccount = Keypair.generate();
    const minimumRent = await secondaryConnection.getMinimumBalanceForRentExemption(
      StakeProgram.space
    );
    const amountUserWantsToStake = LAMPORTS_PER_SOL / 2; // This is can be user input. For now, we'll hardcode to 0.5 SOL
    const amountToStake = minimumRent + amountUserWantsToStake;
    // Taken from https://solanacookbook.com/references/staking.html#create-stake-account
    // Setup a transaction to create our stake account
    // Note: `StakeProgram.createAccount` returns a `Transaction` preconfigured with the necessary `TransactionInstruction`s
    const createStakeAccountTx = StakeProgram.createAccount({
      authorized: new Authorized(wallet.publicKey, wallet.publicKey), // Here we set two authorities: Stake Authority and Withdrawal Authority. Both are set to our wallet.
      fromPubkey: wallet.publicKey,
      lamports: amountToStake,
      lockup: new Lockup(0, 0, wallet.publicKey), // Optional. We'll set this to 0 for demonstration purposes.
      stakePubkey: stakeAccount.publicKey,
    });

    const createStakeAccountTxId = await sendAndConfirmTransaction(
      secondaryConnection,
      createStakeAccountTx,
      [
        wallet,
        stakeAccount, // Since we're creating a new stake account, we have that account sign as well
      ]
    );
    console.log(`Stake account created. Tx Id: ${createStakeAccountTxId}`);

    // Check our newly created stake account balance. This should be 0.5 SOL.
    let stakeBalance = await secondaryConnection.getBalance(stakeAccount.publicKey);
    console.log(`Stake account balance: ${stakeBalance / LAMPORTS_PER_SOL} SOL`);

    // Verify the status of our stake account. This will start as inactive and will take some time to activate.
    let stakeStatus = await secondaryConnection.getStakeActivation(stakeAccount.publicKey);
    console.log(`Stake account status: ${stakeStatus.state}`)
    const selectedValidatorPubkey = new PublicKey(VOTE_KEY)
    // With a validator selected, we can now setup a transaction that delegates our stake to their vote account.
    const delegateTx = StakeProgram.delegate({
      stakePubkey: stakeAccount.publicKey,
      authorizedPubkey: wallet.publicKey,
      votePubkey: selectedValidatorPubkey,
    });

    const delegateTxId = await sendAndConfirmTransaction(secondaryConnection, delegateTx, [
      wallet,
    ]);
    console.log(
      `Stake account delegated to ${selectedValidatorPubkey}. Tx Id: ${delegateTxId}`
    );

    // Check in on our stake account. It should now be activating.
    stakeStatus = await secondaryConnection.getStakeActivation(stakeAccount.publicKey);
    console.log(`Stake account status: ${stakeStatus.state}`);
    
  }

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

  return (
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
        ◎<input type={'text'}></input>
      </div>
      <div>
        <h2>Projected returns</h2>
        <div>Period ◎ Earned Total</div>
        <div>Epoch</div>
        <div>Month</div>
        <div>Year</div>
      </div>
      <Button>Stake Solana</Button>
    </div>
  )
}