import type { AnchorTypes } from "@saberhq/anchor-contrib";
import { PublicKey } from "@solana/web3.js";

import * as STAKE_POOL_TYPES from "../../idl/cardinal_stake_pool";

export const STAKE_POOL_ADDRESS = new PublicKey(
  "stkBL96RZkjY5ine4TvPihGqW8UHJfch2cokjAPzV8i"
);

export const STAKE_POOL_SEED = "stake-pool";

export const STAKE_ENTRY_SEED = "stake-entry";

export const IDENTIFIER_SEED = "identifier";

export const STAKE_AUTHORIZATION_SEED = "stake-authorization";

export const AUTHORITY_OFFSET = 25;
export const STAKER_OFFSET = 82;
export const POOL_OFFSET = 9;

export type STAKE_POOL_PROGRAM = STAKE_POOL_TYPES.CardinalStakePool;

export const STAKE_POOL_IDL = STAKE_POOL_TYPES.IDL;

export type StakePoolTypes = AnchorTypes<STAKE_POOL_PROGRAM>;

type Accounts = StakePoolTypes["Accounts"];
export type StakePoolData = Accounts["stakePool"];
export type StakeEntryData = Accounts["stakeEntry"];
export type IdentifierData = Accounts["identifier"];
export type StakeAuthorizationData = Accounts["stakeAuthorizationRecord"];

export enum ReceiptType {
  // Receive the original mint wrapped in a token manager
  Original = 1,
  // Receive a receipt mint wrapped in a token manager
  Receipt = 2,
}
