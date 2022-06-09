import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
export { PublicKey } from "@solana/web3.js";
/**
 * Returns a {@link PublicKey} if it can be parsed, otherwise returns null.
 * @param pk
 * @returns
 */
export const parsePublicKey = (pk) => {
    if (!pk) {
        return null;
    }
    if (pk instanceof PublicKey) {
        return pk;
    }
    if (typeof pk !== "object" ||
        Array.isArray(pk) ||
        ("constructor" in pk && BN.isBN(pk))) {
        return null;
    }
    try {
        return new PublicKey(pk);
    }
    catch (e) {
        return null;
    }
};
/**
 * Returns true if the given value is a {@link PublicKey}.
 * @param pk
 * @returns
 */
export const isPublicKey = (pk) => {
    return !!parsePublicKey(pk);
};
//# sourceMappingURL=publicKey.js.map