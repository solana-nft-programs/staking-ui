import { executeTransactionSequence, logError, tryNull } from '@cardinal/common'
import { unstake as unstakeV2 } from '@cardinal/rewards-center'
import { unstakeAll } from '@cardinal/staking'
import type { Account } from '@solana/spl-token'
import {
  createAssociatedTokenAccountIdempotentInstruction,
  getAccount,
  getAssociatedTokenAddressSync,
} from '@solana/spl-token'
import { useWallet } from '@solana/wallet-adapter-react'
import type { PublicKey, Signer, Transaction } from '@solana/web3.js'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { BN } from 'bn.js'
import { notify } from 'common/Notification'
import { asWallet } from 'common/Wallets'
import type { StakeEntryTokenData } from 'hooks/useStakedTokenDatas'

import { TOKEN_DATAS_KEY } from '../hooks/useAllowedTokenDatas'
import { useRewardDistributorData } from '../hooks/useRewardDistributorData'
import { isStakePoolV2, useStakePoolData } from '../hooks/useStakePoolData'
import { useStakePoolId } from '../hooks/useStakePoolId'
import { useEnvironmentCtx } from '../providers/EnvironmentProvider'

export const useHandleUnstake = (callback?: () => void) => {
  const wallet = asWallet(useWallet())
  const { connection } = useEnvironmentCtx()
  const queryClient = useQueryClient()
  const { data: stakePool } = useStakePoolData()
  const rewardDistributorData = useRewardDistributorData()
  const { data: stakePoolId } = useStakePoolId()

  return useMutation(
    async ({
      tokenDatas,
    }: {
      tokenDatas: StakeEntryTokenData[]
    }): Promise<[(string | null)[][], number]> => {
      if (!stakePoolId) throw 'Stake pool not found'
      if (!wallet.publicKey) throw 'Wallet not connected'
      if (!stakePool || !stakePool.parsed) throw 'Stake pool not found'

      let txs: { tx: Transaction; signers?: Signer[] }[][] = []
      const cooldownTokens = tokenDatas.filter((token) => {
        return (
          stakePool.parsed?.cooldownSeconds &&
          !token.stakeEntry?.parsed?.cooldownStartSeconds &&
          !stakePool.parsed.minStakeSeconds
        )
      })

      if (isStakePoolV2(stakePool.parsed!)) {
        // TODO Handle fungible
        const unstakeTxs = await unstakeV2(
          connection,
          wallet,
          stakePool.parsed?.identifier,
          tokenDatas.map((token) => ({
            mintId: token.stakeEntry!.parsed.stakeMint,
            fungible: token.stakeEntry?.parsed.amount.gt(new BN(1)),
          })),
          rewardDistributorData.data
            ? [rewardDistributorData.data?.pubkey]
            : undefined
        )

        // create ata if not exists in first tx and execute first
        let rewardTokenAccount: Account | null = null
        let userRewardTokenAccountId: PublicKey | null = null
        if (rewardDistributorData.data?.parsed) {
          userRewardTokenAccountId = getAssociatedTokenAddressSync(
            rewardDistributorData.data.parsed.rewardMint,
            wallet.publicKey
          )
          rewardTokenAccount = await tryNull(
            getAccount(connection, userRewardTokenAccountId)
          )
        }
        txs =
          rewardDistributorData.data?.parsed &&
          userRewardTokenAccountId &&
          !rewardTokenAccount
            ? [
                unstakeTxs.slice(0, 1).map((tx) => {
                  if (userRewardTokenAccountId && rewardDistributorData.data) {
                    tx.instructions = [
                      createAssociatedTokenAccountIdempotentInstruction(
                        wallet.publicKey,
                        userRewardTokenAccountId,
                        wallet.publicKey,
                        rewardDistributorData.data?.parsed.rewardMint
                      ),
                      ...tx.instructions,
                    ]
                  }
                  return { tx }
                }),
                unstakeTxs.slice(1).map((tx) => ({ tx })),
              ]
            : [unstakeTxs.map((tx) => ({ tx }))]
      } else {
        // ata creation handled inside of transaction sequence
        txs = await unstakeAll(connection, wallet, {
          stakePoolId,
          mintInfos: tokenDatas.map((token) => ({
            mintId: token.stakeEntry!.parsed.stakeMint,
            stakeEntryId: token.stakeEntry?.pubkey,
            fungible: token.stakeEntry?.parsed.amount.gt(new BN(1)),
          })),
        })
      }
      const txids = await executeTransactionSequence(connection, txs, wallet, {
        errorHandler: (e, { count }) => {
          notify({
            message: `Failed to stake ${count}/${txs.flat().length}`,
            description: `Please try again later`,
          })
          logError(e)
          return null
        },
      })
      return [txids, cooldownTokens.length]
    },
    {
      onSuccess: ([txids, cooldownTokens]) => {
        const filteredTxids = txids.flat().filter((x): x is string => !!x)
        if (filteredTxids.length !== 0) {
          notify({
            message: `Successfully ${
              cooldownTokens > 0
                ? `initiated cooldown for ${cooldownTokens} tokens and`
                : ''
            } unstaked ${filteredTxids.length - cooldownTokens}/${
              txids.flat().length - cooldownTokens
            }`,
            description: 'Stake progress will now dynamically update',
          })
          queryClient.resetQueries([TOKEN_DATAS_KEY])
          if (callback) callback
        }
      },
      onError: (e) => {
        notify({ message: 'Failed to unstake', description: `${e}` })
      },
    }
  )
}
