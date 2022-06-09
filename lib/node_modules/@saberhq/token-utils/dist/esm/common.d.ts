/**
 * This file is a port of serum-common, which was built for web3.js 0.x.
 */
import type { Provider } from "@saberhq/solana-contrib";
import type { MintInfo } from "@solana/spl-token";
import type { TransactionInstruction } from "@solana/web3.js";
import { Keypair, PublicKey } from "@solana/web3.js";
import type BN from "bn.js";
import { Token } from "./index.js";
import type { TokenAccountData } from "./layout.js";
export * as token from "./token.js";
export type { ProgramAccount } from "@saberhq/solana-contrib";
/**
 * Default number of decimals of a token.
 */
export declare const DEFAULT_TOKEN_DECIMALS = 6;
export declare const SPL_SHARED_MEMORY_ID: PublicKey;
export declare function createMint(provider: Provider, authority?: PublicKey, decimals?: number): Promise<PublicKey>;
/**
 * Creates a Token.
 *
 * @param provider
 * @param authority The mint authority.
 * @param decimals Number of decimals.
 * @returns
 */
export declare function createToken(provider: Provider, authority?: PublicKey, decimals?: number): Promise<Token>;
export declare function createMintInstructions(provider: Provider, authority: PublicKey, mint: PublicKey, decimals?: number): Promise<TransactionInstruction[]>;
export declare function createMintAndVault(provider: Provider, amount: BN, owner?: PublicKey, decimals?: number): Promise<[PublicKey, PublicKey]>;
export declare function createTokenAccountInstrs(provider: Provider, newAccountPubkey: PublicKey, mint: PublicKey, owner: PublicKey, lamports?: number): Promise<TransactionInstruction[]>;
export declare function createAccountRentExempt(provider: Provider, programId: PublicKey, size: number): Promise<Keypair>;
export declare function getMintInfo(provider: Provider, addr: PublicKey): Promise<MintInfo>;
export declare function getTokenAccount(provider: Provider, addr: PublicKey): Promise<TokenAccountData>;
export declare function sleep(ms: number): Promise<void>;
//# sourceMappingURL=common.d.ts.map