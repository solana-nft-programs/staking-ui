import { PublicKey } from "@solana/web3.js";
const pubkeyCache = {};
/**
 * PublicKey with a cached base58 value.
 */
export class CachedPublicKey extends PublicKey {
    constructor(value) {
        super(value);
        this._base58 = super.toBase58();
    }
    equals(other) {
        if (other instanceof CachedPublicKey) {
            return other._base58 === this._base58;
        }
        return super.equals(other);
    }
    toString() {
        return this._base58;
    }
    toBase58() {
        return this._base58;
    }
}
const getOrCreatePublicKey = (pk) => {
    const cached = pubkeyCache[pk];
    if (!cached) {
        return (pubkeyCache[pk] = new CachedPublicKey(pk));
    }
    return cached;
};
/**
 * Gets or parses a PublicKey.
 * @param pk
 * @returns
 */
export const getPublicKey = (pk) => {
    if (typeof pk === "string") {
        return getOrCreatePublicKey(pk);
    }
    else if (pk instanceof PublicKey) {
        return getOrCreatePublicKey(pk.toString());
    }
    else {
        return getOrCreatePublicKey(new PublicKey(pk).toString());
    }
};
const gpaCache = {};
/**
 * Concatenates seeds to generate a unique number array.
 * @param seeds
 * @returns
 */
const concatSeeds = (seeds) => {
    return Uint8Array.from(seeds.reduce((acc, seed) => [...acc, ...seed], []));
};
/**
 * Gets a cached program address for the given seeds.
 * @param seeds
 * @param programId
 * @returns
 */
export const getProgramAddress = (seeds, programId) => {
    const normalizedSeeds = concatSeeds(seeds);
    const cacheKey = `${normalizedSeeds.toString()}_${programId.toString()}`;
    const cached = gpaCache[cacheKey];
    if (cached) {
        return cached;
    }
    const [key] = PublicKey.findProgramAddressSync(seeds, programId);
    return (gpaCache[cacheKey] = getPublicKey(key));
};
//# sourceMappingURL=pubkeyCache.js.map