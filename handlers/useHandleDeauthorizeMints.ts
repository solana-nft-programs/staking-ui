import {
  findStakeAuthorizationRecordId,
  rewardsCenterProgram,
} from '@cardinal/rewards-center'
import { executeTransaction } from '@cardinal/staking'
import { withDeauthorizeStakeEntry } from '@cardinal/staking/dist/cjs/programs/stakePool/transaction'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction } from '@solana/web3.js'
import { notify } from 'common/Notification'
import { asWallet } from 'common/Wallets'
import { useMutation } from 'react-query'

import { isStakePoolV2, useStakePoolData } from '../hooks/useStakePoolData'
import { useEnvironmentCtx } from '../providers/EnvironmentProvider'

export const useHandleDeauthorizeMints = () => {
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

      const program = rewardsCenterProgram(connection, wallet)
      for (let i = 0; i < authorizePublicKeys.length; i++) {
        const mint = authorizePublicKeys[i]!

        let transaction = new Transaction()
        if (isStakePoolV2(stakePool.parsed)) {
          const stakeAuthorizationId = findStakeAuthorizationRecordId(
            stakePool.pubkey,
            mint
          )
          const ix = await program.methods
            .deauthorizeMint()
            .accounts({
              stakePool: stakePool.pubkey,
              stakeAuthorizationRecord: stakeAuthorizationId,
              authority: wallet.publicKey,
            })
            .instruction()
          transaction.add(ix)
        } else {
          transaction = await withDeauthorizeStakeEntry(
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
          message: `Successfully deauthorized ${i + 1}/${
            authorizePublicKeys.length
          }`,
          type: 'success',
        })
      }
    },
    {
      onError: (e) => {
        notify({ message: 'Failed to deauthorize mints', description: `${e}` })
      },
    }
  )
}
