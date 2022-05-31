import { AccountData } from '@cardinal/stake-pool'
import * as metaplex from '@metaplex-foundation/mpl-token-metadata'
import { PublicKey, AccountInfo, ParsedAccountData } from '@solana/web3.js'
import type { StakeEntryData } from '@cardinal/staking/dist/cjs/programs/stakePool'
import { TokenListData } from 'providers/TokenListProvider'

export type TokenData = {
  tokenAccount?: {
    pubkey: PublicKey
    account: AccountInfo<ParsedAccountData>
  }
  metaplexData?: { pubkey: PublicKey; data: metaplex.MetadataData } | null
  editionData?: {
    pubkey: PublicKey
    data: metaplex.EditionData | metaplex.MasterEditionData
  } | null
  metadata?: any
  tokenListData?: TokenListData
  stakeEntry?: AccountData<StakeEntryData> | null
  amountToStake?: string | null
}
