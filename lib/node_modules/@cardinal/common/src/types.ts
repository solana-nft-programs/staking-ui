import type * as web3 from "@solana/web3.js";

/**
 * Generic type that defines the return type for a function
 */
export type AccountFn<T> = () => Promise<AccountData<T>>;

/**
 * Generic AccountData type
 * @param pubkey account public key
 * @param parsed parsed data from account
 */
export type AccountData<T> = {
  pubkey: web3.PublicKey;
  parsed: T;
};
