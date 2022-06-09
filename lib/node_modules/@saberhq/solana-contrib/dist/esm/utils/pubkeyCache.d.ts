/// <reference types="node" />
import type { PublicKeyInitData } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
/**
 * PublicKey with a cached base58 value.
 */
export declare class CachedPublicKey extends PublicKey {
    private readonly _base58;
    constructor(value: PublicKeyInitData);
    equals(other: PublicKey): boolean;
    toString(): string;
    toBase58(): string;
}
/**
 * Gets or parses a PublicKey.
 * @param pk
 * @returns
 */
export declare const getPublicKey: (pk: string | PublicKey | PublicKeyInitData) => PublicKey;
/**
 * Gets a cached program address for the given seeds.
 * @param seeds
 * @param programId
 * @returns
 */
export declare const getProgramAddress: (seeds: Array<Buffer | Uint8Array>, programId: PublicKey) => PublicKey;
//# sourceMappingURL=pubkeyCache.d.ts.map