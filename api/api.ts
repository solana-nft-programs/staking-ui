import { getBatchedMultipleAccounts as getBatchedMultipleAccounts } from '@cardinal/common'
import { stakePool } from '@cardinal/staking'
import { findStakeEntryId } from '@cardinal/staking/dist/cjs/programs/stakePool/pda'
import type { AccountData } from '@cardinal/token-manager'
import {
  claimApprover,
  timeInvalidator,
  tokenManager,
  useInvalidator,
} from '@cardinal/token-manager/dist/cjs/programs'
import type { TokenManagerData } from '@cardinal/token-manager/dist/cjs/programs/tokenManager'
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
import type { Connection, ParsedAccountData } from '@solana/web3.js'
import { PublicKey, SystemProgram } from '@solana/web3.js'
import { TokenData } from './types'

export async function getTokenAccountsWithData(
  connection: Connection,
  stakePoolId: PublicKey,
  addressId: string
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

      let timeInvalidatorId = null
      let useInvalidatorId = null
      if (tokenManagerId) {
        ;[[timeInvalidatorId], [useInvalidatorId]] = await Promise.all([
          timeInvalidator.pda.findTimeInvalidatorAddress(tokenManagerId),
          useInvalidator.pda.findUseInvalidatorAddress(tokenManagerId),
        ])
      }

      let stakeEntryId = null
      if (stakePoolId) {
        ;[stakeEntryId] = await findStakeEntryId(
          connection,
          new PublicKey(addressId),
          stakePoolId,
          new PublicKey(tokenAccount.account.data.parsed.info.mint)
        )
      }

      return [
        metadataId,
        editionId,
        tokenManagerId,
        timeInvalidatorId,
        useInvalidatorId,
        stakeEntryId,
        tokenAccount.pubkey,
      ]
    })
  )

  // @ts-ignore
  const metadataIds: [
    PublicKey[],
    PublicKey[],
    PublicKey[],
    PublicKey[],
    PublicKey[],
    PublicKey[]
  ] =
    // @ts-ignore
    metadataTuples.reduce(
      (
        acc,
        [
          metaplexId,
          editionId,
          tokenManagerId,
          timeInvalidatorId,
          useInvalidatorId,
          stakeEntryId,
        ]
      ) => [
        [...acc[0], metaplexId],
        [...acc[1], editionId],
        [...acc[2], tokenManagerId],
        [...acc[3], timeInvalidatorId],
        [...acc[4], useInvalidatorId],
        [...acc[5], stakeEntryId],
      ],
      [[], [], [], [], [], []]
    )

  const [
    metaplexAccountInfos,
    editionInfos,
    tokenManagers,
    timeInvalidators,
    useInvalidators,
    stakeEntries,
  ] = await Promise.all([
    getBatchedMultipleAccounts(connection, metadataIds[0]),
    getBatchedMultipleAccounts(connection, metadataIds[1]),
    tokenManager.accounts.getTokenManagers(connection, metadataIds[2]),
    timeInvalidator.accounts.getTimeInvalidators(connection, metadataIds[3]),
    useInvalidator.accounts.getUseInvalidators(connection, metadataIds[4]),
    stakePool.accounts.getStakeEntries(connection, metadataIds[5]),
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
      timeInvalidatorId,
      useInvalidatorId,
      stakeEntryId,
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
      useInvalidator: useInvalidators.find((data) =>
        data?.parsed
          ? data.pubkey.toBase58() === useInvalidatorId?.toBase58()
          : undefined
      ),
      stakeEntry: stakeEntries.find((data) =>
        data?.parsed
          ? data.pubkey.toString() === stakeEntryId?.toString()
          : undefined
      ),
      timeInvalidator: timeInvalidators.find((data) =>
        data?.parsed
          ? data.pubkey.toBase58() === timeInvalidatorId?.toBase58()
          : undefined
      ),
    })
  )
}

export async function getTokenDatas(
  connection: Connection,
  wallet: PublicKey,
  stakePoolId: PublicKey,
  tokenManagerDatas: AccountData<TokenManagerData>[]
): Promise<TokenData[]> {
  const metadataTuples: [
    PublicKey,
    PublicKey,
    PublicKey,
    PublicKey,
    PublicKey,
    PublicKey,
    PublicKey | null
  ][] = await Promise.all(
    tokenManagerDatas.map(async (tokenManagerData) => {
      const [
        [metadataId],
        [claimApproverId],
        [timeInvalidatorId],
        [useInvalidatorId],
        [stakeEntryId],
      ] = await Promise.all([
        PublicKey.findProgramAddress(
          [
            anchor.utils.bytes.utf8.encode(metaplex.MetadataProgram.PREFIX),
            metaplex.MetadataProgram.PUBKEY.toBuffer(),
            tokenManagerData.parsed.mint.toBuffer(),
          ],
          metaplex.MetadataProgram.PUBKEY
        ),
        claimApprover.pda.findClaimApproverAddress(tokenManagerData.pubkey),
        timeInvalidator.pda.findTimeInvalidatorAddress(tokenManagerData.pubkey),
        useInvalidator.pda.findUseInvalidatorAddress(tokenManagerData.pubkey),
        stakePool.pda.findStakeEntryId(
          connection,
          wallet,
          stakePoolId,
          tokenManagerData.parsed.mint
        ),
      ])

      const recipientTokenAccountId =
        tokenManagerData.parsed.recipientTokenAccount?.toString() !==
        SystemProgram.programId.toString()
          ? (tokenManagerData.parsed?.recipientTokenAccount as PublicKey)
          : null

      return [
        metadataId,
        tokenManagerData.pubkey,
        claimApproverId,
        timeInvalidatorId,
        useInvalidatorId,
        stakeEntryId,
        recipientTokenAccountId,
      ]
    })
  )

  // @ts-ignore
  const metadataIds: [
    PublicKey[],
    PublicKey[],
    PublicKey[],
    PublicKey[],
    PublicKey[]
  ] =
    // @ts-ignore
    metadataTuples.reduce(
      (
        acc,
        [
          metaplexId,
          _tokenManagerId,
          claimApproverId,
          timeInvalidatorId,
          useInvalidatorId,
          recipientTokenAccountId,
        ]
      ) => [
        [...acc[0], metaplexId],
        [...acc[1], claimApproverId],
        [...acc[2], timeInvalidatorId],
        [...acc[3], useInvalidatorId],
        [...acc[4], recipientTokenAccountId],
      ],
      [[], [], [], [], []]
    )

  const [
    tokenAccounts,
    metaplexAccountInfos,
    claimApprovers,
    timeInvalidators,
    useInvalidators,
  ] = await Promise.all([
    getBatchedMultipleAccounts(
      connection,
      metadataIds[4].filter((pk) => pk),
      {
        encoding: 'jsonParsed',
      }
    )
      .then((tokenAccounts) =>
        tokenAccounts.map(
          (acc) => (acc?.data as ParsedAccountData).parsed?.info
        )
      )
      .catch((e) => {
        console.log('Failed ot get token accounts', e)
        return []
      }) as Promise<(spl.AccountInfo | null)[]>,
    getBatchedMultipleAccounts(connection, metadataIds[0]),
    claimApprover.accounts.getClaimApprovers(connection, metadataIds[1]),
    timeInvalidator.accounts.getTimeInvalidators(connection, metadataIds[2]),
    useInvalidator.accounts.getUseInvalidators(connection, metadataIds[3]),
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
      tokenManagerId,
      claimApproverId,
      timeInvalidatorId,
      useInvalidatorId,
      _tokenAccountId,
    ]) => ({
      recipientTokenAccount: tokenAccounts.find((data) =>
        data
          ? data.delegate?.toString() === tokenManagerId?.toString()
          : undefined
      ),
      metaplexData: metaplexData.find((data) =>
        data ? data.pubkey.toBase58() === metaplexId.toBase58() : undefined
      ),
      tokenManager: tokenManagerDatas.find((tkm) =>
        tkm?.parsed
          ? tkm.pubkey.toBase58() === tokenManagerId?.toBase58()
          : undefined
      ),
      metadata: metadata.find((data) =>
        data ? data.pubkey.toBase58() === metaplexId.toBase58() : undefined
      ),
      claimApprover: claimApprovers.find((data) =>
        data?.parsed
          ? data.pubkey.toBase58() === claimApproverId?.toBase58()
          : undefined
      ),
      useInvalidator: useInvalidators.find((data) =>
        data?.parsed
          ? data.pubkey.toBase58() === useInvalidatorId?.toBase58()
          : undefined
      ),
      timeInvalidator: timeInvalidators.find((data) =>
        data?.parsed
          ? data.pubkey.toBase58() === timeInvalidatorId?.toBase58()
          : undefined
      ),
    })
  )
}

export async function getTokenData(
  connection: Connection,
  tokenManagerId: PublicKey
): Promise<TokenData> {
  const tokenManagerData = await tokenManager.accounts.getTokenManager(
    connection,
    tokenManagerId
  )

  const mintId = tokenManagerData.parsed.mint
  const [[metaplexId]] = await Promise.all([
    PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode(metaplex.MetadataProgram.PREFIX),
        metaplex.MetadataProgram.PUBKEY.toBuffer(),
        mintId.toBuffer(),
      ],
      metaplex.MetadataProgram.PUBKEY
    ),
  ])

  const [[timeInvalidatorId], [useInvalidatorId]] = await Promise.all([
    timeInvalidator.pda.findTimeInvalidatorAddress(tokenManagerId),
    useInvalidator.pda.findUseInvalidatorAddress(tokenManagerId),
  ])

  const [
    metaplexData,
    timeInvalidatorData,
    useInvalidatorData,
    claimApproverData,
  ] = await Promise.all([
    metaplex.Metadata.load(connection, metaplexId).catch((e) => {
      console.log('Failed to get metaplex data', e)
      return null
    }),
    timeInvalidator.accounts
      .getTimeInvalidator(connection, timeInvalidatorId)
      .catch((e) => {
        console.log('Failed to get time invalidator data', e)
        return null
      }),
    useInvalidator.accounts
      .getUseInvalidator(connection, useInvalidatorId)
      .catch((e) => {
        console.log('Failed to get use invalidator data', e)
        return null
      }),
    claimApprover.accounts
      .getClaimApprover(connection, tokenManagerId)
      .catch((e) => {
        console.log('Failed to get use invalidator data', e)
        return null
      }),
  ])

  let metadata: any | null = null
  if (metaplexData) {
    try {
      const json = await fetch(metaplexData.data.data.uri).then((r) => r.json())
      metadata = { pubkey: metaplexData.pubkey, data: json }
    } catch (e) {
      console.log('Failed to get metadata data', e)
    }
  }

  let recipientTokenAccount: spl.AccountInfo | null = null
  if (tokenManagerData?.parsed.recipientTokenAccount) {
    try {
      const mint = new spl.Token(
        connection,
        tokenManagerData?.parsed.mint,
        spl.TOKEN_PROGRAM_ID,
        // @ts-ignore
        null
      )
      recipientTokenAccount = await mint.getAccountInfo(
        tokenManagerData?.parsed.recipientTokenAccount
      )
    } catch (e) {
      console.log('Failed to get recipient token account', e)
    }
  }

  return {
    metaplexData,
    tokenManager: tokenManagerData,
    claimApprover:
      tokenManagerData.parsed.claimApprover?.toString() ===
      claimApproverData?.pubkey?.toString()
        ? claimApproverData
        : undefined,
    useInvalidator: useInvalidatorData,
    timeInvalidator: timeInvalidatorData,
    metadata,
    recipientTokenAccount,
  }
}
