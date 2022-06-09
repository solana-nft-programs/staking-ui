import type { AccountMeta, Cluster, TransactionInstruction } from "@solana/web3.js";
import { Transaction } from "@solana/web3.js";
/**
 * Instruction that can be serialized to JSON.
 */
export interface SerializableInstruction {
    programId: string;
    keys: (Omit<AccountMeta, "pubkey"> & {
        publicKey: string;
    })[];
    data: string;
}
/**
 * Stub of a recent blockhash that can be used to simulate transactions.
 */
export declare const RECENT_BLOCKHASH_STUB = "GfVcyD4kkTrj4bKc7WA9sZCin9JDbdT4Zkd3EittNR1W";
/**
 * Builds a transaction with a fake `recentBlockhash` and `feePayer` for the purpose
 * of simulating a sequence of instructions.
 *
 * @param cluster
 * @param ixs
 * @returns
 */
export declare const buildStubbedTransaction: (cluster: Cluster, ixs: TransactionInstruction[]) => Transaction;
/**
 * Serializes a {@link Transaction} to base64 format without checking signatures.
 * @param tx
 * @returns
 */
export declare const serializeToBase64Unchecked: (tx: Transaction) => string;
/**
 * Generates a link for inspecting the contents of a transaction.
 *
 * @returns URL
 */
export declare const generateInspectLinkFromBase64: (cluster: Cluster, base64TX: string) => string;
/**
 * Generates a link for inspecting the contents of a transaction, not checking for
 * or requiring valid signatures.
 *
 * @returns URL
 */
export declare const generateUncheckedInspectLink: (cluster: Cluster, tx: Transaction) => string;
//# sourceMappingURL=utils.d.ts.map