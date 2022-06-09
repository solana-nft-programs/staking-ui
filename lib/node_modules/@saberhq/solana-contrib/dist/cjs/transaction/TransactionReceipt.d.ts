import type { Cluster, TransactionResponse, TransactionSignature } from "@solana/web3.js";
import type { Event, EventParser } from "../interfaces.js";
import type { PromiseOrValue } from "../utils/misc.js";
import { PendingTransaction } from "./PendingTransaction.js";
import type { TransactionEnvelope } from "./TransactionEnvelope.js";
/**
 * A value that can be processed into a {@link TransactionReceipt}.
 */
export declare type TransactionLike = TransactionEnvelope | PendingTransaction | TransactionReceipt;
/**
 * Confirms a transaction, returning its receipt.
 *
 * @param tx
 * @returns
 */
export declare const confirmTransactionLike: (tx: PromiseOrValue<TransactionLike>) => Promise<TransactionReceipt>;
/**
 * A transaction that has been processed by the cluster.
 */
export declare class TransactionReceipt {
    /**
     * Signature (id) of the transaction.
     */
    readonly signature: TransactionSignature;
    /**
     * Raw response from web3.js
     */
    readonly response: TransactionResponse;
    constructor(
    /**
     * Signature (id) of the transaction.
     */
    signature: TransactionSignature, 
    /**
     * Raw response from web3.js
     */
    response: TransactionResponse);
    /**
     * Gets the events associated with this transaction.
     */
    getEvents<E extends Event>(eventParser: EventParser<E>): readonly E[];
    /**
     * Prints the logs associated with this transaction.
     */
    printLogs(): void;
    /**
     * Gets the compute units used by the transaction.
     * @returns
     */
    get computeUnits(): number;
    /**
     * Generates a link to view this {@link TransactionReceipt} on the official Solana explorer.
     * @param network
     * @returns
     */
    generateSolanaExplorerLink(cluster?: Cluster): string;
}
//# sourceMappingURL=TransactionReceipt.d.ts.map