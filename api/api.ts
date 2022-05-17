import { getBatchedMultipleAccounts as getBatchedMultipleAccounts } from '@cardinal/common'
import { parseError, stakePool } from '@cardinal/staking'
import { REWARD_DISTRIBUTOR_IDL } from '@cardinal/staking/dist/cjs/programs/rewardDistributor'
import { STAKE_POOL_IDL } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { getStakeEntriesForUser } from '@cardinal/staking/dist/cjs/programs/stakePool/accounts'
import { findStakeAuthorizationId } from '@cardinal/staking/dist/cjs/programs/stakePool/pda'
import { findStakeEntryIdFromMint } from '@cardinal/staking/dist/cjs/programs/stakePool/utils'
import { tokenManager } from '@cardinal/token-manager/dist/cjs/programs'
import { tryTokenManagerAddressFromMint } from '@cardinal/token-manager/dist/cjs/programs/tokenManager/pda'
import * as metaplex from '@metaplex-foundation/mpl-token-metadata'
import {
  Edition,
  EditionData,
  MasterEditionV2Data,
  MetadataKey,
} from '@metaplex-foundation/mpl-token-metadata'
import * as anchor from '@project-serum/anchor'
import * as spl from '@solana/spl-token'
import * as web3 from '@solana/web3.js'
import { PublicKey } from '@solana/web3.js'
import { StakeEntryTokenData, TokenData } from './types'

export async function getTokenAccountsWithData(
  connection: web3.Connection,
  addressId: string,
  stakePoolId?: PublicKey
): Promise<TokenData[]> {
  const allTokenAccounts = await connection.getParsedTokenAccountsByOwner(
    new PublicKey(addressId),
    { programId: spl.TOKEN_PROGRAM_ID }
  )
  const tokenAccounts = allTokenAccounts.value
    .filter(
      (tokenAccount) =>
        tokenAccount.account.data.parsed.info.tokenAmount.uiAmount > 0
    )
    .sort((a, b) => a.pubkey.toBase58().localeCompare(b.pubkey.toBase58()))

  const metadataTuples: [
    PublicKey,
    PublicKey,
    PublicKey | null,
    PublicKey | null,
    PublicKey | null,
    PublicKey
  ][] = await Promise.all(
    tokenAccounts.map(async (tokenAccount) => {
      const [[metadataId], editionId, tokenManagerId] = await Promise.all([
        PublicKey.findProgramAddress(
          [
            anchor.utils.bytes.utf8.encode(metaplex.MetadataProgram.PREFIX),
            metaplex.MetadataProgram.PUBKEY.toBuffer(),
            new PublicKey(
              tokenAccount.account.data.parsed.info.mint
            ).toBuffer(),
          ],
          metaplex.MetadataProgram.PUBKEY
        ),
        Edition.getPDA(tokenAccount.account.data.parsed.info.mint),
        tryTokenManagerAddressFromMint(
          connection,
          new PublicKey(tokenAccount.account.data.parsed.info.mint)
        ),
      ])

      let stakeEntryId = null
      let stakeAuthorizationId = null
      if (stakePoolId) {
        ;[[stakeEntryId], [stakeAuthorizationId]] = await Promise.all([
          findStakeEntryIdFromMint(
            connection,
            new PublicKey(addressId),
            stakePoolId,
            new PublicKey(tokenAccount.account.data.parsed.info.mint)
          ),
          await findStakeAuthorizationId(
            stakePoolId,
            new PublicKey(tokenAccount.account.data.parsed.info.mint)
          ),
        ])
      }

      return [
        metadataId,
        editionId,
        tokenManagerId,
        stakeEntryId,
        stakeAuthorizationId,
        tokenAccount.pubkey,
      ]
    })
  )

  const metadataIds: [
    PublicKey[],
    PublicKey[],
    (PublicKey | null)[],
    (PublicKey | null)[],
    (PublicKey | null)[]
  ] = metadataTuples.reduce(
    (
      acc,
      [
        metaplexId,
        editionId,
        tokenManagerId,
        stakeEntryId,
        stakeAuthorizationId,
      ]
    ) => [
      [...acc[0], metaplexId],
      [...acc[1], editionId],
      [...acc[2], tokenManagerId],
      [...acc[3], stakeEntryId],
      [...acc[4], stakeAuthorizationId],
    ],
    [[], [], [], [], []] as [
      PublicKey[],
      PublicKey[],
      (PublicKey | null)[],
      (PublicKey | null)[],
      (PublicKey | null)[]
    ]
  )

  const [
    metaplexAccountInfos,
    editionInfos,
    tokenManagers,
    stakeEntries,
    stakeAuthorizationIds,
  ] = await Promise.all([
    getBatchedMultipleAccounts(connection, metadataIds[0]),
    getBatchedMultipleAccounts(connection, metadataIds[1]),
    tokenManager.accounts.getTokenManagers(
      connection,
      metadataIds[2].filter((pk) => pk) as PublicKey[]
    ),
    stakePool.accounts.getStakeEntries(
      connection,
      metadataIds[3].filter((pk) => pk) as PublicKey[]
    ),
    stakePool.accounts.getStakeAuthorizations(
      connection,
      metadataIds[4].filter((pk) => pk) as PublicKey[]
    ),
  ])

  const metaplexData = metaplexAccountInfos.map((accountInfo, i) => {
    let md
    try {
      md = {
        pubkey: metadataIds[0][i]!,
        ...accountInfo,
        data: metaplex.MetadataData.deserialize(accountInfo?.data as Buffer),
      }
    } catch (e) {}
    return md
  })

  const editionData = editionInfos.map((accountInfo, i) => {
    let md
    try {
      const key =
        accountInfo === null || accountInfo === void 0
          ? void 0
          : (accountInfo.data as Buffer)[0]
      let parsed
      if (key === MetadataKey.EditionV1) {
        parsed = EditionData.deserialize(accountInfo?.data as Buffer)
      } else if (
        key === MetadataKey.MasterEditionV1 ||
        key === MetadataKey.MasterEditionV2
      ) {
        parsed = MasterEditionV2Data.deserialize(accountInfo?.data as Buffer)
      }

      if (parsed) {
        md = {
          pubkey: metadataIds[1][i]!,
          ...accountInfo,
          data: parsed,
        }
      }
    } catch (e) {
      console.log(e)
    }
    return md
  })

  const metadata = await Promise.all(
    metaplexData.map(async (md) => {
      try {
        if (!md?.data.data.uri) return null
        const json = await fetch(md.data.data.uri).then((r) => r.json())
        return {
          pubkey: md.pubkey,
          data: json,
        }
      } catch (e) {
        // console.log(e)
        return null
      }
    })
  )

  return metadataTuples.map(
    ([
      metaplexId,
      editionId,
      tokenManagerId,
      stakeEntryId,
      stakeAuthorizationId,
      tokenAccountId,
    ]) => ({
      tokenAccount: tokenAccounts.find((data) =>
        data ? data.pubkey.toBase58() === tokenAccountId.toBase58() : undefined
      ),
      metaplexData: metaplexData.find((data) =>
        data ? data.pubkey.toBase58() === metaplexId.toBase58() : undefined
      ),
      editionData: editionData.find((data) =>
        data ? data.pubkey.toBase58() === editionId.toBase58() : undefined
      ),
      tokenManager: tokenManagers.find((tkm) =>
        tkm?.parsed
          ? tkm.pubkey.toBase58() === tokenManagerId?.toBase58()
          : undefined
      ),
      metadata: metadata.find((data) =>
        data ? data.pubkey.toBase58() === metaplexId.toBase58() : undefined
      ),
      stakeEntry: stakeEntries.find((data) =>
        data?.parsed
          ? data.pubkey.toString() === stakeEntryId?.toString()
          : undefined
      ),
      stakeAuthorization: stakeAuthorizationIds.find((data) =>
        data?.parsed
          ? data.pubkey.toString() === stakeAuthorizationId?.toString()
          : undefined
      ),
    })
  )
}

export async function getStakeEntryDatas(
  connection: web3.Connection,
  stakePoolId: PublicKey,
  userId: PublicKey
): Promise<StakeEntryTokenData[]> {
  const stakeEntries = (
    await getStakeEntriesForUser(connection, userId)
  ).filter((entry) => entry.parsed.pool.toString() === stakePoolId.toString())
  const mintIds = stakeEntries.map(
    (stakeEntry) => stakeEntry.parsed.originalMint
  )

  const metadataTuples: [PublicKey, PublicKey][] = await Promise.all(
    mintIds.map(async (mintId) => {
      const [metaplexId] = await PublicKey.findProgramAddress(
        [
          anchor.utils.bytes.utf8.encode(metaplex.MetadataProgram.PREFIX),
          metaplex.MetadataProgram.PUBKEY.toBuffer(),
          mintId.toBuffer(),
        ],
        metaplex.MetadataProgram.PUBKEY
      )
      return [metaplexId, mintId]
    })
  )

  const metaplexIds = metadataTuples.map(([metaplexId]) => metaplexId)

  const metaplexAccountInfos = await getBatchedMultipleAccounts(
    connection,
    metaplexIds
  )

  const metaplexData = metaplexAccountInfos.map((accountInfo, i) => {
    let md
    try {
      md = {
        pubkey: metaplexIds[i]!,
        ...accountInfo,
        data: metaplex.MetadataData.deserialize(accountInfo?.data as Buffer),
      }
    } catch (e) {}
    return md
  })

  const metadata = await Promise.all(
    metaplexData.map(async (md, i) => {
      try {
        if (!md) return null
        const json = await fetch(md.data.data.uri).then((r) => r.json())
        return {
          pubkey: md.pubkey!,
          data: json,
        }
      } catch (e) {
        // console.log(e)
        return null
      }
    })
  )

  return metadataTuples.map(([metaplexId, mintId]) => ({
    metaplexData: metaplexData.find((data) =>
      data ? data.pubkey.toBase58() === metaplexId.toBase58() : undefined
    ),
    metadata: metadata.find((data) =>
      data ? data.pubkey.toBase58() === metaplexId.toBase58() : undefined
    ),
    stakeEntry: stakeEntries.find((data) =>
      data
        ? data.parsed.originalMint.toBase58() === mintId.toBase58()
        : undefined
    ),
  }))
}

export function handleError(
  e: any,
  fallBackMessage: string = 'Transaction failed'
): string {
  const hex = (e as web3.SendTransactionError).message.split(' ').at(-1)
  if (hex) {
    const dec = parseInt(hex, 16)
    const stakePoolErr = STAKE_POOL_IDL.errors.find((err) => err.code === dec)
    const rewardDistributorErr = REWARD_DISTRIBUTOR_IDL.errors.find(
      (err) => err.code === dec
    )
    if (stakePoolErr && rewardDistributorErr) {
      return stakePoolErr.msg + ' or ' + rewardDistributorErr.msg
    } else if (stakePoolErr) {
      return stakePoolErr.msg
    } else if (rewardDistributorErr) {
      return rewardDistributorErr.msg
    } else {
      return parseError(e, fallBackMessage)
    }
  }
  return fallBackMessage
}
