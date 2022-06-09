import { PublicKey } from "@solana/web3.js";
export { PublicKey } from "@solana/web3.js";
/**
 * Returns a {@link PublicKey} if it can be parsed, otherwise returns null.
 * @param pk
 * @returns
 */
export declare const parsePublicKey: (pk: unknown) => PublicKey | null;
/**
 * Returns true if the given value is a {@link PublicKey}.
 * @param pk
 * @returns
 */
export declare const isPublicKey: (pk: unknown) => pk is PublicKey;
//# sourceMappingURL=publicKey.d.ts.map