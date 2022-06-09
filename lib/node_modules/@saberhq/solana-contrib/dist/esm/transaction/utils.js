import { PublicKey, Transaction } from "@solana/web3.js";
/**
 * Stub of a recent blockhash that can be used to simulate transactions.
 */
export const RECENT_BLOCKHASH_STUB = "GfVcyD4kkTrj4bKc7WA9sZCin9JDbdT4Zkd3EittNR1W";
/**
 * Builds a transaction with a fake `recentBlockhash` and `feePayer` for the purpose
 * of simulating a sequence of instructions.
 *
 * @param cluster
 * @param ixs
 * @returns
 */
export const buildStubbedTransaction = (cluster, ixs) => {
    const tx = new Transaction();
    tx.recentBlockhash = RECENT_BLOCKHASH_STUB;
    // random keys that always have money in them
    tx.feePayer =
        cluster === "devnet"
            ? new PublicKey("A2jaCHPzD6346348JoEym2KFGX9A7uRBw6AhCdX7gTWP")
            : new PublicKey("9u9iZBWqGsp5hXBxkVZtBTuLSGNAG9gEQLgpuVw39ASg");
    tx.instructions = ixs;
    return tx;
};
/**
 * Serializes a {@link Transaction} to base64 format without checking signatures.
 * @param tx
 * @returns
 */
export const serializeToBase64Unchecked = (tx) => tx
    .serialize({
    requireAllSignatures: false,
    verifySignatures: false,
})
    .toString("base64");
/**
 * Generates a link for inspecting the contents of a transaction.
 *
 * @returns URL
 */
export const generateInspectLinkFromBase64 = (cluster, base64TX) => {
    return `https://${cluster === "mainnet-beta" ? "" : `${cluster}.`}anchor.so/tx/inspector?message=${encodeURIComponent(base64TX)}`;
};
/**
 * Generates a link for inspecting the contents of a transaction, not checking for
 * or requiring valid signatures.
 *
 * @returns URL
 */
export const generateUncheckedInspectLink = (cluster, tx) => {
    return generateInspectLinkFromBase64(cluster, serializeToBase64Unchecked(tx));
};
//# sourceMappingURL=utils.js.map