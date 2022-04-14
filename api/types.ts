import * as spl from '@solana/spl-token'
import { AccountData } from '@cardinal/stake-pool'
import * as metaplex from '@metaplex-foundation/mpl-token-metadata'
import { PublicKey, AccountInfo, ParsedAccountData } from '@solana/web3.js'
import type { TokenManagerData } from '@cardinal/token-manager/dist/cjs/programs/tokenManager'
import type { PaidClaimApproverData } from '@cardinal/token-manager/dist/cjs/programs/claimApprover'
import type { TimeInvalidatorData } from '@cardinal/token-manager/dist/cjs/programs/timeInvalidator'
import type { UseInvalidatorData } from '@cardinal/token-manager/dist/cjs/programs/useInvalidator'
import type { StakeEntryData } from '@cardinal/staking/dist/cjs/programs/stakePool'

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
  claimApprover?: AccountData<PaidClaimApproverData> | null
  useInvalidator?: AccountData<UseInvalidatorData> | null
  timeInvalidator?: AccountData<TimeInvalidatorData> | null
  stakeEntry?: AccountData<StakeEntryData> | null
  recipientTokenAccount?: spl.AccountInfo | null
}

export type StakeEntryTokenData = {
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
