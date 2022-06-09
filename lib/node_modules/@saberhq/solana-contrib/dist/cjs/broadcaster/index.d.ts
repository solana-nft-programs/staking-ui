import type { Blockhash, BlockhashWithExpiryBlockHeight, Commitment, ConfirmOptions, Connection, RpcResponseAndContext, SimulatedTransactionResponse, Transaction } from "@solana/web3.js";
import type { Broadcaster } from "../interfaces.js";
import { PendingTransaction } from "../transaction/index.js";
export * from "./tiered.js";
/**
 * Options for retrying sending of transactions periodically.
 */
export interface TransactionRetryOptions {
    /**
     * Number of times to retry the transaction being sent.
     */
    retryTimes?: number;
    /**
     * Milliseconds elapsed between transaction retries.
     */
    retryInterval?: number;
}
/**
 * Default retry parameters.
 */
export declare const DEFAULT_RETRY_OPTIONS: Required<TransactionRetryOptions>;
/**
 * Default retry parameters for fallbacks.
 */
export declare const DEFAULT_FALLBACK_RETRY_OPTIONS: Required<TransactionRetryOptions>;
export interface BroadcastOptions extends ConfirmOptions, TransactionRetryOptions {
    /**
     * Prints the transaction logs as emitted by @solana/web3.js. Defaults to true.
     */
    printLogs?: boolean;
    /**
     * Retry options to use for fallback send connections.
     */
    fallbackRetryOptions?: TransactionRetryOptions;
}
/**
 * Broadcasts transactions to a single connection.
 */
export declare class SingleConnectionBroadcaster implements Broadcaster {
    readonly sendConnection: Connection;
    readonly opts: ConfirmOptions;
    constructor(sendConnection: Connection, opts?: ConfirmOptions);
    /**
     * @inheritdoc
     */
    getLatestBlockhash(commitment?: Commitment): Promise<BlockhashWithExpiryBlockHeight>;
    /**
     * @inheritdoc
     */
    getRecentBlockhash(commitment?: Commitment): Promise<Blockhash>;
    /**
     * @inheritdoc
     */
    broadcast(tx: Transaction, { printLogs, ...opts }?: BroadcastOptions): Promise<PendingTransaction>;
    /**
     * @inheritdoc
     */
    simulate(tx: Transaction, { commitment, verifySigners, }?: {
        commitment?: Commitment;
        verifySigners?: boolean;
    }): Promise<RpcResponseAndContext<SimulatedTransactionResponse>>;
}
/**
 * Broadcasts transactions to multiple connections simultaneously.
 */
export declare class MultipleConnectionBroadcaster implements Broadcaster {
    readonly connections: readonly Connection[];
    readonly opts: ConfirmOptions;
    constructor(connections: readonly Connection[], opts?: ConfirmOptions);
    getLatestBlockhash(commitment?: Commitment): Promise<BlockhashWithExpiryBlockHeight>;
    getRecentBlockhash(commitment?: Commitment): Promise<Blockhash>;
    private _sendRawTransaction;
    /**
     * Broadcasts a signed transaction.
     *
     * @param tx
     * @param confirm
     * @param opts
     * @returns
     */
    broadcast(tx: Transaction, { printLogs, ...opts }?: BroadcastOptions): Promise<PendingTransaction>;
    /**
     * Simulates a transaction with a commitment.
     * @param tx
     * @param commitment
     * @returns
     */
    simulate(tx: Transaction, { commitment, verifySigners, }?: {
        commitment?: Commitment;
        verifySigners?: boolean;
    }): Promise<RpcResponseAndContext<SimulatedTransactionResponse>>;
}
//# sourceMappingURL=index.d.ts.map