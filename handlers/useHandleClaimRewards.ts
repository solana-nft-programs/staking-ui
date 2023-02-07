import {
  executeTransactionSequence,
  withFindOrInitAssociatedTokenAccount,
} from '@cardinal/common'
import { claimRewards as claimRewardsV2 } from '@cardinal/rewards-center'
import { claimRewardsAll } from '@cardinal/staking'
import {
  createAssociatedTokenAccountIdempotentInstruction,
  getAssociatedTokenAddressSync,
} from '@solana/spl-token'
import { useWallet } from '@solana/wallet-adapter-react'
import { Transaction } from '@solana/web3.js'
import { notify } from 'common/Notification'
import { asWallet } from 'common/Wallets'
import { TOKEN_DATAS_KEY } from 'hooks/useAllowedTokenDatas'
import type { StakeEntryTokenData } from 'hooks/useStakedTokenDatas'
import { useMutation, useQueryClient } from 'react-query'

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

      const ataTx = new Transaction()
      if (rewardDistributorData.data && rewardDistributorData.data.parsed) {
        // create user reward mint ata
        await withFindOrInitAssociatedTokenAccount(
          ataTx,
          connection,
          rewardDistributorData.data.parsed.rewardMint,
          wallet.publicKey!,
          wallet.publicKey!
        )
      }

      const tokensToClaim = tokenDatas
      let transactions: { tx: Transaction }[][] = []
      if (isRewardDistributorV2(rewardDistributorData.data!.parsed!)) {
        const tx = new Transaction()
        const userRewardMintTokenAccountId = getAssociatedTokenAddressSync(
          rewardDistributorData.data.parsed.rewardMint,
          wallet.publicKey,
          true
        )
        tx.add(
          createAssociatedTokenAccountIdempotentInstruction(
            wallet.publicKey,
            userRewardMintTokenAccountId,
            wallet.publicKey,
            rewardDistributorData.data.parsed.rewardMint
          )
        )
        transactions.push([{ tx }])
        transactions = (
          await claimRewardsV2(
            connection,
            wallet,
            stakePool.parsed!.identifier,
            tokensToClaim.map((token) => ({
              mintId: token.stakeEntry!.parsed.stakeMint,
            })),
            rewardDistributorData.data
              ? [rewardDistributorData.data.pubkey]
              : [],
            true
          )
        ).map((tx) => [
          {
            tx,
          },
        ])
      } else {
        transactions = await claimRewardsAll(connection, wallet, {
          stakePoolId: stakePool.pubkey,
          stakeEntryIds: tokensToClaim.map((token) => token.stakeEntry!.pubkey),
        })
      }

      const txids = await executeTransactionSequence(
        connection,
        transactions,
        wallet,
        {
          confirmOptions: { skipPreflight: true },
          errorHandler: (e) => {
            notify({ message: 'Failed to claim rewards', description: `${e}` })
            return null
          },
        }
      )
      return txids
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
