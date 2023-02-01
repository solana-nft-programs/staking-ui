import { stake as stakeV2 } from '@cardinal/rewards-center'
import { ReceiptType } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { getStakeEntries } from '@cardinal/staking/dist/cjs/programs/stakePool/accounts'
import { findStakeEntryId } from '@cardinal/staking/dist/cjs/programs/stakePool/pda'
import {
  withClaimReceiptMint,
  withInitStakeEntry,
  withInitStakeMint,
  withStake,
} from '@cardinal/staking/dist/cjs/programs/stakePool/transaction'
import { BN } from '@project-serum/anchor'
import { useWallet } from '@solana/wallet-adapter-react'
import type { Signer } from '@solana/web3.js'
import { Keypair, PublicKey, Transaction } from '@solana/web3.js'
import { executeAllTransactions } from 'api/utils'
import { notify } from 'common/Notification'
import { parseMintNaturalAmountFromDecimal } from 'common/units'
import { asWallet } from 'common/Wallets'
import { isStakePoolV2, useStakePoolData } from 'hooks/useStakePoolData'
import { useMutation, useQueryClient } from 'react-query'

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
  const stakePoolId = useStakePoolId()
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
      if (!stakePoolData?.parsed) throw 'Stake pool data not found'
      if (tokenDatas.length <= 0) throw 'No tokens selected'

      let txs: Transaction[] = []
      if (!isStakePoolV2(stakePoolData.parsed)) {
        const stakeInfos = stakeInfosFromTokenData(tokenDatas)
        const stakeEntryIds = await Promise.all(
          stakeInfos.map(
            async ({ mintId, fungible }) =>
              (
                await findStakeEntryId(
                  wallet.publicKey,
                  stakePoolId,
                  mintId,
                  fungible
                )
              )[0]
          )
        )
        let stakeEntries = await getStakeEntries(connection, stakeEntryIds)

        ///////////// init stake mints /////////////
        const initTxs: { tx: Transaction; signers: Signer[] }[] = []
        if (receiptType === ReceiptType.Receipt) {
          for (let i = 0; i < stakeInfos.length; i++) {
            const { mintId } = stakeInfos[i]!
            const transaction = new Transaction()
            const stakeEntry = stakeEntries?.find(
              (s) => s?.parsed?.originalMint.toString() === mintId.toString()
            )
            if (!stakeEntry) {
              await withInitStakeEntry(transaction, connection, wallet, {
                stakePoolId,
                originalMintId: mintId,
              })
            }
            let stakeMintKeypair: Keypair | undefined
            if (!stakeEntry?.parsed.stakeMint) {
              stakeMintKeypair = Keypair.generate()
              await withInitStakeMint(transaction, connection, wallet, {
                stakePoolId: stakePoolId,
                stakeEntryId: stakeEntryIds[i]!,
                originalMintId: mintId,
                stakeMintKeypair,
                name: `POOl${stakePoolData.parsed.identifier.toString()} RECEIPT`,
                symbol: `POOl${stakePoolData.parsed.identifier.toString()}`,
              })
              if (transaction.instructions.length > 0) {
                initTxs.push({ tx: transaction, signers: [stakeMintKeypair] })
              }
            }
          }
        }
        if (initTxs.length > 0) {
          await executeAllTransactions(
            connection,
            wallet,
            initTxs.map(({ tx }) => tx),
            {
              signers: initTxs.map(({ signers }) => signers),
              throwIndividualError: true,
              notificationConfig: {
                message: `Successfully initialized stake entries`,
                description: 'Staking now in progress',
              },
            }
          )
          stakeEntries = await getStakeEntries(connection, stakeEntryIds)
        }

        ///////////// stake v1 /////////////
        txs = await Promise.all(
          stakeInfos.map(async ({ mintId, tokenAccountId, amount }, i) => {
            const transaction = new Transaction()
            const stakeEntry = stakeEntries?.find(
              (s) => s?.parsed?.originalMint.toString() === mintId.toString()
            )
            if (!stakeEntry) {
              await withInitStakeEntry(transaction, connection, wallet, {
                stakePoolId: stakePoolId,
                originalMintId: mintId,
              })
            }
            await withStake(transaction, connection, wallet, {
              stakePoolId: stakePoolId,
              originalMintId: mintId,
              userOriginalMintTokenAccountId: tokenAccountId,
              amount: amount,
            })
            if (receiptType && receiptType !== ReceiptType.None) {
              const receiptMintId =
                receiptType === ReceiptType.Receipt
                  ? stakeEntry?.parsed.stakeMint
                  : mintId
              if (!receiptMintId) {
                throw 'Stake entry has no stake mint. Initialize stake mint first.'
              }
              await withClaimReceiptMint(transaction, connection, wallet, {
                stakePoolId: stakePoolId,
                stakeEntryId: stakeEntryIds[i]!,
                originalMintId: mintId,
                receiptMintId: receiptMintId,
                receiptType: receiptType,
              })
            }
            return transaction
          })
        )
      } else {
        ///////////// stake v2 /////////////
        const stakeInfos = stakeInfosFromTokenData(tokenDatas)
        txs = await stakeV2(
          connection,
          wallet,
          stakePoolData.parsed.identifier,
          stakeInfos
        )
      }
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
