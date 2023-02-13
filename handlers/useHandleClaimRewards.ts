import { executeTransactionSequence, logError, tryNull } from '@cardinal/common'
import { claimRewards as claimRewardsV2 } from '@cardinal/rewards-center'
import { claimRewardsAll } from '@cardinal/staking'
import {
  createAssociatedTokenAccountIdempotentInstruction,
  getAccount,
  getAssociatedTokenAddressSync,
} from '@solana/spl-token'
import { useWallet } from '@solana/wallet-adapter-react'
import type { Transaction } from '@solana/web3.js'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notify } from 'common/Notification'
import { asWallet } from 'common/Wallets'
import { TOKEN_DATAS_KEY } from 'hooks/useAllowedTokenDatas'
import type { StakeEntryTokenData } from 'hooks/useStakedTokenDatas'

import {
  isRewardDistributorV2,
  useRewardDistributorData,
} from '../hooks/useRewardDistributorData'
import { useStakePoolData } from '../hooks/useStakePoolData'
import { useEnvironmentCtx } from '../providers/EnvironmentProvider'

export const REWARD_QUERY_KEY = 'rewards'

export const useHandleClaimRewards = () => {
  const wallet = asWallet(useWallet())
  const { connection } = useEnvironmentCtx()
  const queryClient = useQueryClient()
  const { data: stakePool } = useStakePoolData()
  const rewardDistributorData = useRewardDistributorData()

  return useMutation(
    async ({
      tokenDatas,
    }: {
      tokenDatas: StakeEntryTokenData[]
    }): Promise<(string | null)[][]> => {
      if (!wallet) throw 'Wallet not found'
      if (!stakePool || !stakePool.parsed) throw 'No stake pool found'
      if (!rewardDistributorData.data?.parsed)
        throw 'No reward distributor data found'

      let txs: { tx: Transaction }[][] = []
      if (isRewardDistributorV2(rewardDistributorData.data!.parsed!)) {
        const claimTxs = await claimRewardsV2(
          connection,
          wallet,
          stakePool.parsed!.identifier,
          tokenDatas.map((token) => ({
            mintId: token.stakeEntry!.parsed.stakeMint,
          })),
          rewardDistributorData.data ? [rewardDistributorData.data.pubkey] : []
        )

        // create ata if not exists in first tx and execute first
        const userRewardTokenAccountId = getAssociatedTokenAddressSync(
          rewardDistributorData.data.parsed.rewardMint,
          wallet.publicKey
        )
        const rewardTokenAccount = await tryNull(
          getAccount(connection, userRewardTokenAccountId)
        )
        txs =
          rewardDistributorData.data?.parsed &&
          userRewardTokenAccountId &&
          !rewardTokenAccount
            ? [
                claimTxs.slice(0, 1).map((tx) => {
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
                claimTxs.slice(1).map((tx) => ({ tx })),
              ]
            : [claimTxs.map((tx) => ({ tx }))]
      } else {
        txs = await claimRewardsAll(connection, wallet, {
          stakePoolId: stakePool.pubkey,
          stakeEntryIds: tokenDatas.map((token) => token.stakeEntry!.pubkey),
        })
      }

      return executeTransactionSequence(connection, txs, wallet, {
        confirmOptions: { skipPreflight: true },
        errorHandler: (e) => {
          notify({ message: 'Failed to claim rewards', description: `${e}` })
          logError(e)
          return null
        },
      })
    },
    {
      onSuccess: (txids) => {
        const filteredTxids = txids.flat().filter((x): x is string => !!x)
        if (filteredTxids.length !== 0) {
          notify({
            message: `Successfully claimed rewards ${filteredTxids.length}/${
              txids.flat().length
            }`,
            description: 'Stake progress will now dynamically update',
          })
        }
        queryClient.resetQueries([REWARD_QUERY_KEY])
        queryClient.resetQueries([TOKEN_DATAS_KEY])
      },
      onError: (e) => {
        notify({ message: 'Failed to claim rewards', description: `${e}` })
      },
    }
  )
}
