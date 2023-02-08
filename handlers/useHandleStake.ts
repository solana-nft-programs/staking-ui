import { executeTransactionSequence, logError } from '@cardinal/common'
import { stake as stakeV2 } from '@cardinal/rewards-center'
import { stakeAll } from '@cardinal/staking'
import { ReceiptType } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { BN } from '@project-serum/anchor'
import { useWallet } from '@solana/wallet-adapter-react'
import type { Signer, Transaction } from '@solana/web3.js'
import { PublicKey } from '@solana/web3.js'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notify } from 'common/Notification'
import { parseMintNaturalAmountFromDecimal } from 'common/units'
import { asWallet } from 'common/Wallets'
import { isStakePoolV2, useStakePoolData } from 'hooks/useStakePoolData'

import type { AllowedTokenData } from '../hooks/useAllowedTokenDatas'
import { TOKEN_DATAS_KEY } from '../hooks/useAllowedTokenDatas'
import { useStakePoolId } from '../hooks/useStakePoolId'
import { useEnvironmentCtx } from '../providers/EnvironmentProvider'

const stakeInfosFromTokenData = (tokenDatas: AllowedTokenData[]) => {
  return tokenDatas
    .map((tokenData) => {
      try {
        return stakeInfoFromTokenData(tokenData)
      } catch (e) {
        console.log({
          message: `Failed to stake token ${tokenData?.tokenAccount?.parsed.mint}`,
          description: `${e}`,
          type: 'error',
        })
        return null
      }
    })
    .filter((tk): tk is ReturnType<typeof stakeInfoFromTokenData> => !!tk)
}

const stakeInfoFromTokenData = (tokenData: AllowedTokenData) => {
  if (!tokenData.tokenAccount) throw 'Token account invalid'
  if (
    tokenData.tokenAccount?.parsed.tokenAmount.amount > 1 &&
    !tokenData.amountToStake
  ) {
    throw new Error('Invalid amount chosen for token')
  }
  const mintId = new PublicKey(tokenData.tokenAccount?.parsed.mint)
  const amount = tokenData?.amountToStake
    ? new BN(
        tokenData?.amountToStake &&
        tokenData.tokenAccount.parsed.tokenAmount.amount > 1
          ? parseMintNaturalAmountFromDecimal(
              tokenData?.amountToStake,
              tokenData.tokenAccount.parsed.tokenAmount.decimals
            ).toString()
          : 1
      )
    : undefined
  return {
    tokenAccountId: tokenData.tokenAccount.pubkey,
    mintId,
    amount,
    fungible: (amount?.toNumber() || 0) > 1,
  }
}

export const useHandleStake = (callback?: () => void) => {
  const wallet = asWallet(useWallet())
  const { connection } = useEnvironmentCtx()
  const queryClient = useQueryClient()
  const { data: stakePoolId } = useStakePoolId()
  const { data: stakePoolData } = useStakePoolData()

  return useMutation(
    async ({
      tokenDatas,
      receiptType = ReceiptType.Original,
    }: {
      tokenDatas: AllowedTokenData[]
      receiptType?: ReceiptType
    }): Promise<(string | null)[][]> => {
      if (!wallet) throw 'Wallet not connected'
      if (!stakePoolId) throw 'Stake pool not found'
      if (!stakePoolData?.parsed) throw 'Stake pool data not found'
      if (tokenDatas.length <= 0) throw 'No tokens selected'

      let txs: { tx: Transaction; signers?: Signer[] }[][] = []
      const stakeInfos = stakeInfosFromTokenData(tokenDatas)
      if (!isStakePoolV2(stakePoolData.parsed)) {
        txs = await stakeAll(connection, wallet, {
          stakePoolId: stakePoolId,
          mintInfos: stakeInfos.map((info) => ({
            ...info,
            receiptType,
          })),
        })
      } else {
        ///////////// stake v2 /////////////
        txs = [
          (
            await stakeV2(
              connection,
              wallet,
              stakePoolData.parsed.identifier,
              stakeInfos
            )
          ).map((tx) => ({ tx })),
        ]
      }
      return executeTransactionSequence(connection, txs, wallet, {
        errorHandler: (e) => {
          notify({ message: 'Failed to stake', description: `${e}` })
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
            message: `Successfully staked ${filteredTxids.length}/${
              txids.flat().length
            }`,
            description: 'Stake progress will now dynamically update',
          })
        }
        queryClient.resetQueries([TOKEN_DATAS_KEY])
        if (callback) callback
      },
      onError: (e) => {
        notify({ message: 'Failed to stake', description: `${e}` })
      },
    }
  )
}
