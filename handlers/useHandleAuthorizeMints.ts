import {
  findStakeAuthorizationRecordId,
  rewardsCenterProgram,
} from '@cardinal/rewards-center'
import { executeTransaction } from '@cardinal/staking'
import { withAuthorizeStakeEntry } from '@cardinal/staking/dist/cjs/programs/stakePool/transaction'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import { notify } from 'common/Notification'
import { asWallet } from 'common/Wallets'
import { useMutation } from 'react-query'

import { isStakePoolV2, useStakePoolData } from '../hooks/useStakePoolData'
import { useEnvironmentCtx } from '../providers/EnvironmentProvider'

export const useHandleAuthorizeMints = () => {
  const wallet = asWallet(useWallet())
  const { connection } = useEnvironmentCtx()
  const { data: stakePool } = useStakePoolData()

  return useMutation(
    async ({
      mintsToAuthorize,
    }: {
      mintsToAuthorize: string
    }): Promise<void> => {
      if (!wallet) throw 'Wallet not found'
      if (!stakePool || !stakePool.parsed) throw 'No stake pool found'
      const authorizePublicKeys =
        mintsToAuthorize.length > 0
          ? mintsToAuthorize
              .split(',')
              .map((address) => new PublicKey(address.trim()))
          : []

      if (authorizePublicKeys.length === 0) {
        notify({ message: `Error: No mints inserted` })
        return
      }

      for (let i = 0; i < authorizePublicKeys.length; i++) {
        const mint = authorizePublicKeys[i]!

        let transaction = new Transaction()
        if (isStakePoolV2(stakePool.parsed)) {
          const program = rewardsCenterProgram(connection, wallet)
          const stakeAuthorizationId = findStakeAuthorizationRecordId(
            stakePool.pubkey,
            mint
          )
          const ix = await program.methods
            .authorizeMint(mint)
            .accounts({
              stakePool: stakePool.pubkey,
              stakeAuthorizationRecord: stakeAuthorizationId,
              payer: wallet.publicKey,
              systemProgram: SystemProgram.programId,
            })
            .instruction()
          transaction.add(ix)
        } else {
          transaction = await withAuthorizeStakeEntry(
            new Transaction(),
            connection,
            wallet,
            {
              stakePoolId: stakePool.pubkey,
              originalMintId: mint,
            }
          )
        }

        await executeTransaction(connection, wallet, transaction, {
          silent: false,
          signers: [],
        })
        notify({
          message: `Successfully authorized ${i + 1}/${
            authorizePublicKeys.length
          }`,
          type: 'success',
        })
      }
    },
    {
      onError: (e) => {
        notify({ message: 'Failed to authorize mints', description: `${e}` })
      },
    }
  )
}
