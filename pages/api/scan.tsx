import { AccountData, getBatchedMultipleAccounts } from '@cardinal/common'
import { scan } from '@cardinal/scanner/dist/cjs/programs/cardinalScanner'
import { StakePoolData } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { getStakePool } from '@cardinal/staking/dist/cjs/programs/stakePool/accounts'
import { utils } from '@project-serum/anchor'
import {
  AccountInfo,
  Connection,
  Keypair,
  ParsedAccountData,
  PublicKey,
  Transaction,
} from '@solana/web3.js'
import * as metaplex from '@metaplex-foundation/mpl-token-metadata'
import { stakePoolMetadatas } from 'api/mapping'
import { firstParam, tryPublicKey } from 'common/utils'
import { allowedTokensForPool } from 'hooks/useAllowedTokenDatas'
import type { NextApiHandler } from 'next'
import { ENVIRONMENTS } from 'providers/EnvironmentProvider'
import * as spl from '@solana/spl-token'

interface GetResponse {
  label: string
  icon: string
}

const get: NextApiHandler<GetResponse> = async (req, res) => {
  const { collection: collectionParam } = req.query
  const config = stakePoolMetadatas.find(
    (p) => p.name === firstParam(collectionParam)
  )
  const icon = config!.imageUrl?.includes('http')
    ? config!.imageUrl
    : `https://${req.headers.host}${config!.imageUrl ?? ''}`
  res.status(200).send({
    label: config?.displayName || 'Unknown project',
    icon,
  })
}

interface PostResponse {
  transaction?: string
  message?: string
  error?: string
}

export type BaseTokenData = {
  tokenAccount?: {
    pubkey: PublicKey
    account: AccountInfo<ParsedAccountData>
  }
  metaplexData?: { pubkey: PublicKey; data: metaplex.MetadataData } | null
}

export async function getTokenAccounts(
  connection: Connection,
  addressId: string
): Promise<BaseTokenData[]> {
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

  // lookup metaplex data
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
    connection,
    metaplexIds
  )
  const metaplexData = metaplexAccountInfos.reduce((acc, accountInfo, i) => {
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
  }, {} as { [tokenAccountId: string]: { pubkey: PublicKey; data: metaplex.MetadataData } })

  return tokenAccounts.map((tokenAccount) => ({
    tokenAccount,
    metaplexData: metaplexData[tokenAccount.pubkey.toString()],
  }))
}

const post: NextApiHandler<PostResponse> = async (req, res) => {
  const {
    cluster: clusterParam,
    collection: collectionParam,
    keypair: keypairParam,
  } = req.query
  const { account } = req.body
  const foundEnvironment = ENVIRONMENTS.find(
    (e) => e.label === (firstParam(clusterParam) || 'mainnet-beta')
  )
  if (!foundEnvironment)
    return res.status(400).json({ error: 'Invalid cluster' })

  const keypair = Keypair.fromSecretKey(
    utils.bytes.bs58.decode(firstParam(keypairParam))
  )
  const accountId = tryPublicKey(account)
  if (!accountId) return res.status(400).json({ error: 'Invalid account' })

  const connection = new Connection(foundEnvironment!.primary)
  const config = stakePoolMetadatas.find(
    (p) => p.name === firstParam(collectionParam)
  )!

  let tokenDatas: BaseTokenData[] = []
  let stakePool: AccountData<StakePoolData>
  try {
    stakePool = await getStakePool(connection, config.stakePoolAddress)
    tokenDatas = await getTokenAccounts(connection, accountId.toString())
  } catch (e) {
    console.log('Failed to get toke accounts: ', e)
    return res.status(500).json({ error: 'Failed to get token accounts' })
  }
  tokenDatas = allowedTokensForPool(tokenDatas, stakePool, [], true)
  const foundToken = tokenDatas.find((tk) => tk)

  if (!foundToken) {
    return res.status(404).json({
      error: `No valid tokens found in wallet for config ${config.name}`,
    })
  }

  let transaction = new Transaction()
  if (foundToken) {
    const instruction = scan(
      connection,
      {
        signTransaction: async (tx: Transaction) => tx,
        signAllTransactions: async (txs: Transaction[]) => txs,
        publicKey: accountId,
      },
      accountId
    )
    transaction.instructions = [
      {
        ...instruction,
        keys: [
          ...instruction.keys,
          { pubkey: keypair.publicKey, isSigner: false, isWritable: false },
        ],
      },
    ]
  }
  transaction.feePayer = accountId
  transaction.recentBlockhash = (
    await connection.getRecentBlockhash('max')
  ).blockhash
  transaction = Transaction.from(
    transaction.serialize({
      verifySignatures: false,
      requireAllSignatures: false,
    })
  )
  // Serialize and return the unsigned transaction.
  const serialized = transaction.serialize({
    verifySignatures: false,
    requireAllSignatures: false,
  })
  const base64 = serialized.toString('base64')
  res.status(200).send({
    transaction: base64,
    message: `Verifying ownership of a ${config.name} NFT`,
  })
}

const index: NextApiHandler<GetResponse | PostResponse> = async (
  request,
  response
) => {
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Access-Control-Allow-Methods', '*')
  response.setHeader('Access-Control-Allow-Headers', '*')
  response.setHeader('Access-Control-Allow-Credentials', 'true')
  if (request.method === 'OPTIONS') {
    return response.status(200).json({})
  }
  if (request.method === 'GET') return get(request, response)
  if (request.method === 'POST') return post(request, response)
  throw new Error(`Unexpected method ${request.method}`)
}

export default index
