import {
  AccountData,
  getBatchedMultipleAccounts as getBatchedMultipleAccounts,
} from '@cardinal/common'
import { stakePool } from '@cardinal/staking'
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
import { utils } from '@project-serum/anchor'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import * as spl from '@solana/spl-token'
import { Connection } from '@solana/web3.js'
import { PublicKey } from '@solana/web3.js'
import { TokenData } from './types'
import { StakeEntryTokenData } from 'hooks/useStakedTokenDatas'

// export type AccountType =
//   | 'metaplexMetadata'
//   | 'editionData'
//   | 'tokenAccount'
//   | 'stakePool'

// export type AccountTypeData = {
//   type: AccountType
//   displayName?: string
// }

// export type AccountDataById = {
//   [accountId: string]:
//     | (spl.AccountInfo & AccountTypeData)
//     | (AccountData<metaplex.MetadataData> &
//         AccountInfo<Buffer> &
//         AccountTypeData)
//     | (AccountData<metaplex.EditionData> &
//         AccountInfo<Buffer> &
//         AccountTypeData)
//     | (AccountData<metaplex.MasterEditionData> &
//         AccountInfo<Buffer> &
//         AccountTypeData)
//     | (AccountData<undefined> & AccountInfo<Buffer> & AccountTypeData)
// }

// export const deserializeAccountInfos = (
//   accountIds: (PublicKey | null)[],
//   accountInfos: (AccountInfo<Buffer | ParsedAccountData> | null)[]
// ): AccountDataById => {
//   return accountInfos.reduce((acc, accountInfo, i) => {
//     const ownerString = accountInfo?.owner.toString()
//     switch (ownerString) {
//       case TOKEN_PROGRAM_ID.toString():
//         try {
//           acc[accountIds[i]!.toString()] = {
//             type: 'tokenAccount',
//             ...((accountInfo?.data as ParsedAccountData).parsed
//               ?.info as spl.AccountInfo),
//           }
//         } catch (e) {}
//         return acc
//       case STAKE_POOL_ADDRESS.toString():
//         try {
//           acc[accountIds[i]!.toString()] = {
//             type: 'stakePool',
//             displayName: 'Staked',
//             ...((accountInfo?.data as ParsedAccountData).parsed
//               ?.info as spl.AccountInfo),
//           }
//         } catch (e) {}
//         return acc
//       case metaplex.MetadataProgram.PUBKEY.toString():
//         try {
//           acc[accountIds[i]!.toString()] = {
//             type: 'metaplexMetadata',
//             pubkey: accountIds[i]!,
//             parsed: metaplex.MetadataData.deserialize(
//               accountInfo?.data as Buffer
//             ) as metaplex.MetadataData,
//             ...(accountInfo as AccountInfo<Buffer>),
//           }
//         } catch (e) {}
//         try {
//           const key =
//             accountInfo === null || accountInfo === void 0
//               ? void 0
//               : (accountInfo.data as Buffer)[0]
//           let parsed
//           if (key === MetadataKey.EditionV1) {
//             parsed = EditionData.deserialize(accountInfo?.data as Buffer)
//           } else if (
//             key === MetadataKey.MasterEditionV1 ||
//             key === MetadataKey.MasterEditionV2
//           ) {
//             parsed = MasterEditionV2Data.deserialize(
//               accountInfo?.data as Buffer
//             )
//           }
//           if (parsed) {
//             acc[accountIds[i]!.toString()] = {
//               type: 'editionData',
//               pubkey: accountIds[i]!,
//               parsed,
//               ...(accountInfo as AccountInfo<Buffer>),
//             }
//           }
//         } catch (e) {}
//         return acc
//       default:
//         return acc
//     }
//   }, {} as AccountDataById)
// }

// export const accountDataById = async (
//   connection: Connection,
//   ids: (PublicKey | null)[]
// ): Promise<AccountDataById> => {
//   const filteredIds = ids.filter((id): id is PublicKey => id !== null)
//   const accountInfos = await getBatchedMultipleAccounts(
//     connection,
//     filteredIds,
//     { encoding: 'jsonParsed' }
//   )
//   return deserializeAccountInfos(filteredIds, accountInfos)
// }

// export async function getTokenAccountsWithData(
//   connection: Connection,
//   addressId: string,
//   filter?: TokenFilter,
//   cluster?: string
// ): Promise<TokenData[]> {
//   const allTokenAccounts = await connection.getParsedTokenAccountsByOwner(
//     new PublicKey(addressId),
//     { programId: spl.TOKEN_PROGRAM_ID }
//   )
//   let tokenAccounts = allTokenAccounts.value
//     .filter(
//       (tokenAccount) =>
//         tokenAccount.account.data.parsed.info.tokenAmount.uiAmount > 0
//     )
//     .sort((a, b) => a.pubkey.toBase58().localeCompare(b.pubkey.toBase58()))

//   // lookup metaplex data
//   const metaplexIds = await Promise.all(
//     tokenAccounts.map(
//       async (tokenAccount) =>
//         (
//           await metaplex.MetadataProgram.find_metadata_account(
//             new PublicKey(tokenAccount.account.data.parsed.info.mint)
//           )
//         )[0]
//     )
//   )
//   // const metaplexMetadatas = await accountDataById(connection, metaplexIds)
//   // TODO use accountDataById?
//   const metaplexAccountInfos = await getBatchedMultipleAccounts(
//     connection,
//     metaplexIds
//   )
//   const metaplexData = metaplexAccountInfos.reduce((acc, accountInfo, i) => {
//     try {
//       acc[tokenAccounts[i]!.pubkey.toString()] = {
//         pubkey: metaplexIds[i]!,
//         ...accountInfo,
//         data: metaplex.MetadataData.deserialize(
//           accountInfo?.data as Buffer
//         ) as metaplex.MetadataData,
//       }
//     } catch (e) {}
//     return acc
//   }, {} as { [tokenAccountId: string]: { pubkey: PublicKey; data: metaplex.MetadataData } })

//   // filter by creators
//   if (filter?.type === 'creators') {
//     tokenAccounts = tokenAccounts.filter((tokenAccount) =>
//       metaplexData[tokenAccount.pubkey.toString()]?.data?.data?.creators?.some(
//         (creator) =>
//           filter.value.includes(creator.address.toString()) &&
//           (cluster === 'devnet' || creator.verified)
//       )
//     )
//   }

//   // lookup delegates and
//   const delegateIds = tokenAccounts.map((tokenAccount) =>
//     tryPublicKey(tokenAccount.account.data.parsed.info.delegate)
//   )
//   const tokenAccountDelegateData = await accountDataById(
//     connection,
//     delegateIds
//   )
//   const editionIds = await Promise.all(
//     tokenAccounts.map(async (tokenAccount) =>
//       Edition.getPDA(tokenAccount.account.data.parsed.info.mint)
//     )
//   )
//   const idsToFetch = Object.values(tokenAccountDelegateData).reduce(
//     (acc, accountData) => [
//       ...acc,
//       ...(accountData.type === 'tokenManager'
//         ? [
//             (accountData as AccountData<TokenManagerData>).parsed.claimApprover,
//             (accountData as AccountData<TokenManagerData>).parsed
//               .recipientTokenAccount,
//             ...(accountData as AccountData<TokenManagerData>).parsed
//               .invalidators,
//           ]
//         : []),
//     ],
//     [...editionIds] as (PublicKey | null)[]
//   )

//   const accountsById = {
//     ...tokenAccountDelegateData,
//     ...(await accountDataById(connection, idsToFetch)),
//   }

//   const metadata = await Promise.all(
//     Object.values(metaplexData).map(async (md) => {
//       try {
//         if (!md?.data.data.uri) return null
//         const json = await fetch(md.data.data.uri).then((r) => r.json())
//         return {
//           pubkey: md.pubkey,
//           data: json,
//         }
//       } catch (e) {}
//     })
//   )

//   return tokenAccounts.map((tokenAccount, i) => {
//     const delegateData =
//       accountsById[tokenAccount.account.data.parsed.info.delegate]

//     let tokenManagerData: AccountData<TokenManagerData> | undefined
//     let claimApproverId: PublicKey | undefined
//     let timeInvalidatorId: PublicKey | undefined
//     let useInvalidatorId: PublicKey | undefined
//     if (delegateData?.type === 'tokenManager') {
//       tokenManagerData = delegateData as AccountData<TokenManagerData>
//       claimApproverId = tokenManagerData.parsed.claimApprover ?? undefined
//       timeInvalidatorId = tokenManagerData.parsed.invalidators.filter(
//         (invalidator) =>
//           accountsById[invalidator.toString()]?.type === 'timeInvalidator'
//       )[0]
//       useInvalidatorId = tokenManagerData.parsed.invalidators.filter(
//         (invalidator) =>
//           accountsById[invalidator.toString()]?.type === 'useInvalidator'
//       )[0]
//     }
//     return {
//       tokenAccount,
//       metaplexData: metaplexData[tokenAccount.pubkey.toString()],
//       editionData: accountsById[editionIds[i]!.toString()] as
//         | {
//             pubkey: PublicKey
//             parsed: metaplex.EditionData | metaplex.MasterEditionData
//           }
//         | undefined,
//       metadata: metadata.find((data) =>
//         data
//           ? data.pubkey.toBase58() ===
//             metaplexData[tokenAccount.pubkey.toString()]?.pubkey.toBase58()
//           : undefined
//       ),
//       tokenManager: tokenManagerData,
//       claimApprover: claimApproverId
//         ? (accountsById[
//             claimApproverId.toString()
//           ] as AccountData<PaidClaimApproverData>)
//         : undefined,
//       useInvalidator: useInvalidatorId
//         ? (accountsById[
//             useInvalidatorId.toString()
//           ] as AccountData<UseInvalidatorData>)
//         : undefined,
//       timeInvalidator: timeInvalidatorId
//         ? (accountsById[
//             timeInvalidatorId.toString()
//           ] as AccountData<TimeInvalidatorData>)
//         : undefined,
//     }
//   })
// }

export async function getTokenAccountsWithData(
  connection: Connection,
  addressId: string,
  stakePoolId?: PublicKey
): Promise<TokenData[]> {
  const allTokenAccounts = await connection.getParsedTokenAccountsByOwner(
    new PublicKey(addressId),
    { programId: TOKEN_PROGRAM_ID }
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
            utils.bytes.utf8.encode(metaplex.MetadataProgram.PREFIX),
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
  connection: Connection,
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
          utils.bytes.utf8.encode(metaplex.MetadataProgram.PREFIX),
          metaplex.MetadataProgram.PUBKEY.toBuffer(),
          mintId.toBuffer(),
        ],
        metaplex.MetadataProgram.PUBKEY
      )
      return [metaplexId, mintId]
    })
  )

  const metaplexIds = metadataTuples.map(([metaplexId]) => metaplexId)

  const metaplexAccountInfos =
    metaplexIds.length > 0
      ? await getBatchedMultipleAccounts(connection, metaplexIds)
      : []

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
