import * as spl from '@solana/spl-token'
import { AccountData } from '@cardinal/stake-pool'
import * as metaplex from '@metaplex-foundation/mpl-token-metadata'
import { PublicKey, AccountInfo, ParsedAccountData } from '@solana/web3.js'
import type { TokenManagerData } from '@cardinal/token-manager/dist/cjs/programs/tokenManager'
import type { PaidClaimApproverData } from '@cardinal/token-manager/dist/cjs/programs/claimApprover'
import type {
  StakeAuthorizationData,
  StakeEntryData,
} from '@cardinal/staking/dist/cjs/programs/stakePool'
import { TokenListData } from 'providers/TokenListProvider'

export type TokenData = {
  tokenAccount?: {
    pubkey: PublicKey
    account: AccountInfo<ParsedAccountData>
  }
  tokenManager?: AccountData<TokenManagerData>
  metaplexData?: { pubkey: PublicKey; data: metaplex.MetadataData } | null
  editionData?: {
    pubkey: PublicKey
    data: metaplex.EditionData | metaplex.MasterEditionData
  } | null
  metadata?: any
  tokenListData?: TokenListData
  claimApprover?: AccountData<PaidClaimApproverData> | null
  stakeEntry?: AccountData<StakeEntryData> | null
  stakeAuthorization?: AccountData<StakeAuthorizationData> | null
  recipientTokenAccount?: spl.AccountInfo | null
  amountToStake?: number | null
  amountToUnStake?: number | null
}

export type StakeEntryTokenData = {
  tokenListData?: TokenListData
  metaplexData?: { pubkey: PublicKey; data: metaplex.MetadataData } | null
  metadata?:
    | {
        pubkey: PublicKey
        data: any
      }
    | undefined
    | null
  stakeEntry: AccountData<StakeEntryData> | null | undefined
}
