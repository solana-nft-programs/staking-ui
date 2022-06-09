"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUncheckedInspectLink = exports.generateInspectLinkFromBase64 = exports.serializeToBase64Unchecked = exports.buildStubbedTransaction = exports.RECENT_BLOCKHASH_STUB = void 0;
const web3_js_1 = require("@solana/web3.js");
/**
 * Stub of a recent blockhash that can be used to simulate transactions.
 */
exports.RECENT_BLOCKHASH_STUB = "GfVcyD4kkTrj4bKc7WA9sZCin9JDbdT4Zkd3EittNR1W";
/**
 * Builds a transaction with a fake `recentBlockhash` and `feePayer` for the purpose
 * of simulating a sequence of instructions.
 *
 * @param cluster
 * @param ixs
 * @returns
 */
const buildStubbedTransaction = (cluster, ixs) => {
    const tx = new web3_js_1.Transaction();
    tx.recentBlockhash = exports.RECENT_BLOCKHASH_STUB;
    // random keys that always have money in them
    tx.feePayer =
        cluster === "devnet"
            ? new web3_js_1.PublicKey("A2jaCHPzD6346348JoEym2KFGX9A7uRBw6AhCdX7gTWP")
            : new web3_js_1.PublicKey("9u9iZBWqGsp5hXBxkVZtBTuLSGNAG9gEQLgpuVw39ASg");
    tx.instructions = ixs;
    return tx;
};
exports.buildStubbedTransaction = buildStubbedTransaction;
/**
 * Serializes a {@link Transaction} to base64 format without checking signatures.
 * @param tx
 * @returns
 */
const serializeToBase64Unchecked = (tx) => tx
    .serialize({
    requireAllSignatures: false,
    verifySignatures: false,
})
    .toString("base64");
exports.serializeToBase64Unchecked = serializeToBase64Unchecked;
/**
 * Generates a link for inspecting the contents of a transaction.
 *
 * @returns URL
 */
const generateInspectLinkFromBase64 = (cluster, base64TX) => {
    return `https://${cluster === "mainnet-beta" ? "" : `${cluster}.`}anchor.so/tx/inspector?message=${encodeURIComponent(base64TX)}`;
};
exports.generateInspectLinkFromBase64 = generateInspectLinkFromBase64;
/**
 * Generates a link for inspecting the contents of a transaction, not checking for
 * or requiring valid signatures.
 *
 * @returns URL
 */
const generateUncheckedInspectLink = (cluster, tx) => {
    return (0, exports.generateInspectLinkFromBase64)(cluster, (0, exports.serializeToBase64Unchecked)(tx));
};
exports.generateUncheckedInspectLink = generateUncheckedInspectLink;
//# sourceMappingURL=utils.js.map