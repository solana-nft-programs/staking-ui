import { getBatchedMultipleAccounts } from '@cardinal/common'
import * as metaplex from '@metaplex-foundation/mpl-token-metadata'
import type { AccountInfo, ParsedAccountData } from '@solana/web3.js'
import { PublicKey } from '@solana/web3.js'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { useQuery } from 'react-query'
import { TOKEN_PROGRAM_ID } from 'spl-token-v3'

import type { TokenListData } from './useTokenList'
import { useTokenList } from './useTokenList'
import { useWalletId } from './useWalletId'

export type UserTokenData = {
  tokenAccount?: {
    pubkey: PublicKey
    account: AccountInfo<ParsedAccountData>
  }
  metaplexData?: { pubkey: PublicKey; data: metaplex.MetadataData } | null
  tokenListData?: TokenListData
}

export const useUserTokenDatas = () => {
  const { secondaryConnection } = useEnvironmentCtx()
  const walletId = useWalletId()
  const tokenList = useTokenList()
  return useQuery<UserTokenData[]>(
    ['useUserTokenDatas', walletId?.toString(), tokenList.data?.length],
    async () => {
      const allTokenAccounts =
        await secondaryConnection.getParsedTokenAccountsByOwner(walletId!, {
          programId: TOKEN_PROGRAM_ID,
        })

      const tokenAccounts = allTokenAccounts.value
        .filter(
          (tokenAccount) =>
            tokenAccount.account.data.parsed.info.tokenAmount.uiAmount > 0
        )
        .sort((a, b) => a.pubkey.toBase58().localeCompare(b.pubkey.toBase58()))

      const metaplexIds = await Promise.all(
        tokenAccounts.map(
          async (tokenAccount) =>
            (
              await metaplex.MetadataProgram.findMetadataAccount(
                new PublicKey(tokenAccount.account.data.parsed.info.mint)
              )
            )[0]
        )
      )
      const metaplexAccountInfos = await getBatchedMultipleAccounts(
        secondaryConnection,
        metaplexIds
      )
      const metaplexData = metaplexAccountInfos.reduce(
        (acc, accountInfo, i) => {
          try {
            acc[tokenAccounts[i]!.pubkey.toString()] = {
              pubkey: metaplexIds[i]!,
              ...accountInfo,
              data: metaplex.MetadataData.deserialize(
                accountInfo?.data as Buffer
              ) as metaplex.MetadataData,
            }
          } catch (e) {}
          return acc
        },
        {} as {
          [tokenAccountId: string]: {
            pubkey: PublicKey
            data: metaplex.MetadataData
          }
        }
      )

      return tokenAccounts.map((tokenAccount, i) => ({
        tokenAccount,
        metaplexData: metaplexData[tokenAccount.pubkey.toString()],
        tokenListData: tokenList.data?.find(
          (t) =>
            t.address === tokenAccount?.account.data.parsed.info.mint.toString()
        ),
      }))
    },
    {
      enabled: !!walletId && tokenList.isFetched,
    }
  )
}
