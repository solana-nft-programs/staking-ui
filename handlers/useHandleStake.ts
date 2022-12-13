import { stake as stakeV2 } from '@cardinal/rewards-center'
import { createStakeEntryAndStakeMint, stake } from '@cardinal/staking'
import { ReceiptType } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { BN } from '@project-serum/anchor'
import { useWallet } from '@solana/wallet-adapter-react'
import type { Signer, Transaction } from '@solana/web3.js'
import { PublicKey } from '@solana/web3.js'
import { executeAllTransactions } from 'api/utils'
import { notify } from 'common/Notification'
import { parseMintNaturalAmountFromDecimal } from 'common/units'
import { asWallet } from 'common/Wallets'
import { useStakedTokenDatas } from 'hooks/useStakedTokenDatas'
import { isStakePoolV2, useStakePoolData } from 'hooks/useStakePoolData'
import { useMutation, useQueryClient } from 'react-query'

import type { AllowedTokenData } from '../hooks/useAllowedTokenDatas'
import { TOKEN_DATAS_KEY } from '../hooks/useAllowedTokenDatas'
import { useStakePoolId } from '../hooks/useStakePoolId'
import { useEnvironmentCtx } from '../providers/EnvironmentProvider'

export const useHandleStake = (callback?: () => void) => {
  const wallet = asWallet(useWallet())
  const { connection } = useEnvironmentCtx()
  const queryClient = useQueryClient()
  const stakePoolId = useStakePoolId()
  const stakedTokenDatas = useStakedTokenDatas()
  const { data: stakePoolData } = useStakePoolData()

  return useMutation(
    async ({
      tokenDatas,
      receiptType = ReceiptType.Original,
    }: {
      tokenDatas: AllowedTokenData[]
      receiptType?: ReceiptType
    }): Promise<string[]> => {
      if (!wallet) throw 'Wallet not connected'
      if (!stakePoolId) throw 'Stake pool not found'
      if (!stakePoolData || !stakePoolData.parsed)
        throw 'Stake pool data not found'
      if (tokenDatas.length <= 0) throw 'No tokens selected'
      const initTxs: { tx: Transaction; signers: Signer[] }[] = []

      if (!isStakePoolV2(stakePoolData.parsed)) {
        for (let i = 0; i < tokenDatas.length; i++) {
          try {
            const token = tokenDatas[i]!
            if (!token.tokenAccount) throw 'Token account invalid'
            if (receiptType === ReceiptType.Receipt) {
              console.log('Creating stake entry and stake mint...')
              const [initTx, , stakeMintKeypair] =
                await createStakeEntryAndStakeMint(connection, wallet, {
                  stakePoolId: stakePoolId,
                  originalMintId: new PublicKey(token.tokenAccount.parsed.mint),
                })
              if (initTx.instructions.length > 0) {
                initTxs.push({
                  tx: initTx,
                  signers: stakeMintKeypair ? [stakeMintKeypair] : [],
                })
              }
            }
          } catch (e) {
            notify({
              message: `Failed to stake token ${tokenDatas[i]?.tokenAccount?.parsed.mint}`,
              description: `${e}`,
              type: 'error',
            })
          }
        }
      }

      if (initTxs.length > 0) {
        try {
          await executeAllTransactions(
            connection,
            wallet,
            initTxs.map(({ tx }) => tx),
            {
              signers: initTxs.map(({ signers }) => signers),
              throwIndividualError: true,
              notificationConfig: {
                message: `Successfully staked`,
                description: 'Stake progress will now dynamically update',
              },
            }
          )
        } catch (e) {}
      }

      const txs: (Transaction | null)[] = await Promise.all(
        tokenDatas.map(async (token) => {
          try {
            if (!token.tokenAccount) throw 'Token account invalid'
            if (
              token.tokenAccount?.parsed.tokenAmount.amount > 1 &&
              !token.amountToStake
            ) {
              throw new Error('Invalid amount chosen for token')
            }

            const mint = token.tokenAccount?.parsed.mint
            const stakedToken = stakedTokenDatas.data?.find(
              (s) => s.stakeEntry?.parsed?.stakeMint.toString() === mint
            )
            if (
              stakedToken &&
              stakedToken.stakeEntry?.parsed?.amount.gt(new BN(0))
            ) {
              throw 'Fungible tokens already staked in the pool. Staked tokens need to be unstaked and then restaked together with the new tokens.'
            }

            const amount = token?.amountToStake
              ? new BN(
                  token?.amountToStake &&
                  token.tokenAccount.parsed.tokenAmount.amount > 1
                    ? parseMintNaturalAmountFromDecimal(
                        token?.amountToStake,
                        token.tokenAccount.parsed.tokenAmount.decimals
                      ).toString()
                    : 1
                )
              : undefined
            if (isStakePoolV2(stakePoolData.parsed!)) {
              if (!stakePoolData.parsed || !stakePoolData.parsed.identifier)
                throw 'No stake pool parsed data found'
              const txs = await stakeV2(
                connection,
                wallet,
                stakePoolData.parsed.identifier,
                [
                  {
                    mintId: new PublicKey(mint),
                    fungible: (amount?.toNumber() || 0) > 1,
                  },
                ]
              )
              return txs[0] ?? null // TODO limit to one for now
            } else {
              return stake(connection, wallet, {
                stakePoolId: stakePoolId,
                receiptType:
                  (!amount ||
                    (amount &&
                      amount.eq(new BN(1)) &&
                      receiptType === ReceiptType.Receipt)) &&
                  receiptType !== ReceiptType.None
                    ? receiptType
                    : undefined,
                originalMintId: new PublicKey(mint),
                userOriginalMintTokenAccountId: token.tokenAccount.pubkey,
                amount: amount,
              })
            }
          } catch (e) {
            console.log({
              message: `Failed to stake token ${token?.tokenAccount?.parsed.mint}`,
              description: `${e}`,
              type: 'error',
            })
            return null
          }
        })
      )

      await executeAllTransactions(
        connection,
        wallet,
        txs.filter((tx): tx is Transaction => tx !== null),
        {
          notificationConfig: {
            message: `Successfully staked`,
            description: 'Stake progress will now dynamically update',
          },
        }
      )

      return []
    },
    {
      onSuccess: () => {
        queryClient.resetQueries([TOKEN_DATAS_KEY])
        if (callback) callback
      },
      onError: (e) => {
        notify({ message: 'Failed to stake', description: `${e}` })
      },
    }
  )
}
