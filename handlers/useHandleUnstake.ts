import { executeTransactionSequence } from '@cardinal/common'
import { unstake as unstakeV2 } from '@cardinal/rewards-center'
import { unstakeAll } from '@cardinal/staking'
import {
  createAssociatedTokenAccountIdempotentInstruction,
  getAssociatedTokenAddressSync,
} from '@solana/spl-token'
import { useWallet } from '@solana/wallet-adapter-react'
import type { Signer } from '@solana/web3.js'
import { Transaction } from '@solana/web3.js'
import { BN } from 'bn.js'
import { notify } from 'common/Notification'
import { asWallet } from 'common/Wallets'
import type { StakeEntryTokenData } from 'hooks/useStakedTokenDatas'
import { useMutation, useQueryClient } from 'react-query'

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
        if (rewardDistributorData.data && rewardDistributorData.data.parsed) {
          // create user reward mint ata
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
          txs.push([{ tx }])
        }
        // TODO Handle fungible
        txs.push(
          (
            await unstakeV2(
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
          ).map((tx) => ({ tx }))
        )
      } else {
        txs = await unstakeAll(connection, wallet, {
          stakePoolId,
          mintInfos: tokenDatas.map((token) => ({
            mintId: token.stakeEntry!.parsed.stakeMint,
            fungible: token.stakeEntry?.parsed.amount.gt(new BN(1)),
          })),
        })
      }
      const txids = await executeTransactionSequence(connection, txs, wallet, {
        confirmOptions: { skipPreflight: true },
        errorHandler: (e) => {
          notify({ message: 'Failed to stake', description: `${e}` })
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
