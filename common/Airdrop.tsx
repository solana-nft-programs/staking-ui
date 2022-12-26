import { withCreateMint } from '@cardinal/common'
import { createInitMintManagerInstruction } from '@cardinal/creator-standard/dist/cjs/generated'
import {
  findMintManagerId,
  findMintMetadataId,
  findRulesetId,
} from '@cardinal/creator-standard/dist/cjs/pda'
import { executeTransaction } from '@cardinal/staking'
import {
  CreateMetadataV2,
  Creator,
  DataV2,
  Metadata,
} from '@metaplex-foundation/mpl-token-metadata'
import type { Wallet } from '@saberhq/solana-contrib'
import { useWallet } from '@solana/wallet-adapter-react'
import type { Connection } from '@solana/web3.js'
import { Keypair, LAMPORTS_PER_SOL, Transaction } from '@solana/web3.js'
import { notify } from 'common/Notification'
import { useAllowedTokenDatas } from 'hooks/useAllowedTokenDatas'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'

import { AsyncButton } from './Button'
import { asWallet } from './Wallets'

export type AirdropMetadata = { name: string; symbol: string; uri: string }

export async function airdropNFT(
  connection: Connection,
  wallet: Wallet,
  airdropMetadatas: AirdropMetadata[]
): Promise<string> {
  const transaction = new Transaction()
  const randInt = Math.round(Math.random() * (airdropMetadatas.length - 1))
  const metadata: AirdropMetadata | undefined = airdropMetadatas[randInt]
  if (!metadata) throw new Error('No configured airdrops found')

  const mintKeypair = Keypair.generate()
  const [holderTokenAccountId] = await withCreateMint(
    transaction,
    connection,
    wallet,
    wallet.publicKey,
    mintKeypair.publicKey
  )

  const masterEditionMetadataId = await Metadata.getPDA(mintKeypair.publicKey)
  const metadataTx = new CreateMetadataV2(
    { feePayer: wallet.publicKey },
    {
      metadata: masterEditionMetadataId,
      metadataData: new DataV2({
        name: metadata.name,
        symbol: metadata.symbol,
        uri: metadata.uri,
        sellerFeeBasisPoints: 10,
        creators: [
          new Creator({
            address: wallet.publicKey.toString(),
            verified: false,
            share: 100,
          }),
        ],
        collection: null,
        uses: null,
      }),
      updateAuthority: wallet.publicKey,
      mint: mintKeypair.publicKey,
      mintAuthority: wallet.publicKey,
    }
  )

  // init mint manager
  const rulesetId = findRulesetId()
  const mintManagerId = findMintManagerId(mintKeypair.publicKey)
  const mintMetadataId = findMintMetadataId(mintKeypair.publicKey)

  const initMintManagerIx = createInitMintManagerInstruction({
    mintManager: mintManagerId,
    mintMetadata: mintMetadataId,
    mint: mintKeypair.publicKey,
    ruleset: rulesetId,
    holderTokenAccount: holderTokenAccountId,
    tokenAuthority: wallet.publicKey,
    authority: wallet.publicKey,
    payer: wallet.publicKey,
  })

  transaction.instructions = [
    ...transaction.instructions,
    ...metadataTx.instructions,
    initMintManagerIx,
  ]

  const txid = await executeTransaction(connection, wallet, transaction, {
    confirmOptions: { commitment: 'confirmed' },
    signers: [mintKeypair],
  })
  console.log(
    `CCS token (${mintKeypair.publicKey.toString()}) created with metadata (${masterEditionMetadataId.toString()})`
  )
  return txid
}

export const Airdrop = () => {
  const { connection } = useEnvironmentCtx()
  const wallet = useWallet()
  const allowedTokenDatas = useAllowedTokenDatas(true)
  const { data: stakePoolMetadata } = useStakePoolMetadata()

  return (
    <AsyncButton
      disabled={!wallet.connected}
      className="rounded-md px-3 py-1"
      onClick={async () => {
        if (!wallet.connected) return
        try {
          await airdropNFT(
            connection,
            asWallet(wallet),
            stakePoolMetadata?.airdrops || airdrops || []
          )
          notify({ message: 'Aidrop successfull', type: 'success' })
          await allowedTokenDatas.remove()
        } catch (e) {
          notify({ message: `Airdrop failed: ${e}`, type: 'error' })
        }
      }}
    >
      <div className="text-xs">Airdrop</div>
    </AsyncButton>
  )
}

export const AirdropSol = () => {
  const { connection } = useEnvironmentCtx()
  const wallet = useWallet()
  const allowedTokenDatas = useAllowedTokenDatas(true)

  return (
    <AsyncButton
      disabled={!wallet.connected}
      onClick={async () => {
        if (!wallet.connected) return
        try {
          await connection.requestAirdrop(wallet.publicKey!, LAMPORTS_PER_SOL)
          notify({ message: 'Airdropped 1 sol successfully' })
          await allowedTokenDatas.remove()
        } catch (e) {
          notify({ message: `Airdrop failed: ${e}`, type: 'error' })
        }
      }}
    >
      Faucet
    </AsyncButton>
  )
}

const airdrops: { name: string; symbol: string; uri: string }[] = [
  {
    name: 'Origin Jambo',
    symbol: 'JAMB',
    uri: 'https://arweave.net/XBoDa9TqiOZeXW_6bV8wvieD8fMQS6IHxKipwdvduCo',
  },
  {
    name: 'Solana Monkey Business',
    symbol: 'SMB',
    uri: 'https://arweave.net/VjfB54_BbELJ5bc1kH-kddrXfq5noloSjkcvK2Odhh0',
  },
  {
    name: 'Degen Ape',
    symbol: 'DAPE',
    uri: 'https://arweave.net/mWra8rTxavmbCnqxs6KoWwa0gC9uM8NMeOsyVhDy0-E',
  },
  {
    name: 'Thugbirdz',
    symbol: 'THUG',
    uri: 'https://arweave.net/l9VXqVWCsiKW-R8ShX8jknFPgBibrhQI1JRgUI9uvbw',
  },
  {
    name: 'Turtles',
    symbol: 'TRTL',
    uri: 'https://arweave.net/KKbhlHaPMOB9yMm9yG_i7PxzK0y24I5C7gNTaRDI9OE',
  },
  {
    name: 'Almost Famous Pandas',
    symbol: 'AFP',
    uri: '8cs7hpBcuiRbzcdUY5BHpCFCgv1m8JhpZEVHUkYTmhnA',
  },
  {
    name: 'Shi Guardians',
    symbol: 'SHI',
    uri: 'https://arweave.net/hSI4WIsX10yRWnzgXP8oqwSCaSgPfGU5nSN-Pxjslao',
  },
  {
    name: 'Hacker House',
    symbol: 'HH',
    uri: 'https://arweave.net/DLDhnabWSXzAYktEhEKyukt3GIfagj2rPpWncw-KDQo',
  },
  {
    name: '21 Club',
    symbol: '21',
    uri: 'https://bafkreicv3jj6oc53kid76mkk7hqsr6edrnhsydkw4do4vonq777sgfz3le.ipfs.dweb.link?ext=json',
  },
]
