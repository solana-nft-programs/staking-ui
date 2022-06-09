import type { BlockhashWithExpiryBlockHeight, Cluster, Connection, Finality, TransactionSignature } from "@solana/web3.js";
import type { WrapOptions } from "retry";
import { TransactionReceipt } from "./TransactionReceipt.js";
/**
 * Options for awaiting a transaction confirmation.
 */
export interface TransactionWaitOptions extends WrapOptions, Partial<BlockhashWithExpiryBlockHeight> {
    /**
     * Commitment of the transaction. Defaults to `confirmed`.
     */
    readonly commitment?: Finality;
    /**
     * Whether or not to use websockets for awaiting confirmation. Defaults to `false`.
     */
    readonly useWebsocket?: boolean;
}
/**
 * Transaction which may or may not be confirmed.
 */
export declare class PendingTransaction {
    readonly connection: Connection;
    readonly signature: TransactionSignature;
    private _receipt;
    constructor(connection: Connection, signature: TransactionSignature);
    /**
     * Gets the transaction receipt, if it has already been fetched.
     *
     * You probably want the async version of this function, `wait`.
     */
    get receipt(): TransactionReceipt | null;
    /**
     * Waits for the confirmation of the transaction.
     * @returns
     */
    wait({ commitment, useWebsocket, ...retryOpts }?: TransactionWaitOptions): Promise<TransactionReceipt>;
    /**
     * Fetches the TransactionReceipt via polling.
     * @returns
     */
    pollForReceipt({ commitment, ...retryOpts }?: Omit<TransactionWaitOptions, "useWebsocket">): Promise<TransactionReceipt>;
    /**
     * Awaits the confirmation of the transaction, via onSignature subscription.
     *
     * @deprecated use {@link PendingTransaction#confirm}
     * @returns
     */
    awaitSignatureConfirmation(commitment?: Finality): Promise<TransactionSignature>;
    /**
     * Awaits the confirmation of the transaction, via onSignature subscription.
     * @returns
     */
    confirm({ commitment, blockhash, lastValidBlockHeight, }: Pick<TransactionWaitOptions, "commitment" | "blockhash" | "lastValidBlockHeight">): Promise<TransactionSignature>;
    /**
     * Generates a link to view this {@link PendingTransaction} on the official Solana explorer.
     * @param network
     * @returns
     */
    generateSolanaExplorerLink(cluster?: Cluster): string;
}
//# sourceMappingURL=PendingTransaction.d.ts.map