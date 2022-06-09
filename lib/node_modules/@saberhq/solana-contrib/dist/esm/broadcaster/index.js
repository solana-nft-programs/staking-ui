import { firstAggregateError } from "../error.js";
import { DEFAULT_PROVIDER_OPTIONS } from "../provider.js";
import { PendingTransaction } from "../transaction/index.js";
import { suppressConsoleErrorAsync } from "../utils/index.js";
import { simulateTransactionWithCommitment } from "../utils/simulateTransactionWithCommitment.js";
import { sendAndSpamRawTx } from "./sendAndSpamRawTx.js";
export * from "./tiered.js";
/**
 * Default retry parameters.
 */
export const DEFAULT_RETRY_OPTIONS = {
    retryTimes: 3,
    retryInterval: 1000,
};
/**
 * Default retry parameters for fallbacks.
 */
export const DEFAULT_FALLBACK_RETRY_OPTIONS = {
    retryTimes: 10,
    retryInterval: 300,
};
/**
 * Broadcasts transactions to a single connection.
 */
export class SingleConnectionBroadcaster {
    constructor(sendConnection, opts = DEFAULT_PROVIDER_OPTIONS) {
        this.sendConnection = sendConnection;
        this.opts = opts;
    }
    /**
     * @inheritdoc
     */
    async getLatestBlockhash(commitment) {
        var _a;
        if (commitment === void 0) { commitment = (_a = this.opts.commitment) !== null && _a !== void 0 ? _a : "confirmed"; }
        return await this.sendConnection.getLatestBlockhash(commitment);
    }
    /**
     * @inheritdoc
     */
    async getRecentBlockhash(commitment) {
        var _a;
        if (commitment === void 0) { commitment = (_a = this.opts.commitment) !== null && _a !== void 0 ? _a : "confirmed"; }
        const result = await this.sendConnection.getLatestBlockhash(commitment);
        return result.blockhash;
    }
    /**
     * @inheritdoc
     */
    async broadcast(tx, { printLogs = true, ...opts } = this.opts) {
        if (tx.signatures.length === 0) {
            throw new Error("Transaction must be signed before broadcasting.");
        }
        const rawTx = tx.serialize();
        if (printLogs) {
            return new PendingTransaction(this.sendConnection, await sendAndSpamRawTx(this.sendConnection, rawTx, opts, opts));
        }
        return await suppressConsoleErrorAsync(async () => {
            // hide the logs of TX errors if printLogs = false
            return new PendingTransaction(this.sendConnection, await sendAndSpamRawTx(this.sendConnection, rawTx, opts, opts));
        });
    }
    /**
     * @inheritdoc
     */
    async simulate(tx, _a) {
        var _b, _c;
        var { commitment = (_b = this.opts.preflightCommitment) !== null && _b !== void 0 ? _b : "confirmed", verifySigners = true, } = _a === void 0 ? {
            commitment: (_c = this.opts.preflightCommitment) !== null && _c !== void 0 ? _c : "confirmed",
            verifySigners: true,
        } : _a;
        if (verifySigners && tx.signatures.length === 0) {
            throw new Error("Transaction must be signed before simulating.");
        }
        return await simulateTransactionWithCommitment(this.sendConnection, tx, commitment);
    }
}
/**
 * Broadcasts transactions to multiple connections simultaneously.
 */
export class MultipleConnectionBroadcaster {
    constructor(connections, opts = DEFAULT_PROVIDER_OPTIONS) {
        this.connections = connections;
        this.opts = opts;
    }
    async getLatestBlockhash(commitment) {
        var _a;
        if (commitment === void 0) { commitment = (_a = this.opts.preflightCommitment) !== null && _a !== void 0 ? _a : "confirmed"; }
        try {
            const result = await Promise.any(this.connections.map((conn) => conn.getLatestBlockhash(commitment)));
            return result;
        }
        catch (e) {
            if (e instanceof AggregateError) {
                throw firstAggregateError(e);
            }
            else {
                throw e;
            }
        }
    }
    async getRecentBlockhash(commitment) {
        var _a;
        if (commitment === void 0) { commitment = (_a = this.opts.preflightCommitment) !== null && _a !== void 0 ? _a : "confirmed"; }
        try {
            const result = await Promise.any(this.connections.map((conn) => conn.getLatestBlockhash(commitment)));
            return result.blockhash;
        }
        catch (e) {
            if (e instanceof AggregateError) {
                throw firstAggregateError(e);
            }
            else {
                throw e;
            }
        }
    }
    async _sendRawTransaction(encoded, options) {
        try {
            return await Promise.any(this.connections.map(async (connection) => {
                return new PendingTransaction(connection, await sendAndSpamRawTx(connection, encoded, options !== null && options !== void 0 ? options : this.opts));
            }));
        }
        catch (e) {
            if (e instanceof AggregateError) {
                throw firstAggregateError(e);
            }
            else {
                throw e;
            }
        }
    }
    /**
     * Broadcasts a signed transaction.
     *
     * @param tx
     * @param confirm
     * @param opts
     * @returns
     */
    async broadcast(tx, { printLogs = true, ...opts } = this.opts) {
        if (tx.signatures.length === 0) {
            throw new Error("Transaction must be signed before broadcasting.");
        }
        const rawTx = tx.serialize();
        if (printLogs) {
            return await this._sendRawTransaction(rawTx, opts);
        }
        return await suppressConsoleErrorAsync(async () => {
            // hide the logs of TX errors if printLogs = false
            return await this._sendRawTransaction(rawTx, opts);
        });
    }
    /**
     * Simulates a transaction with a commitment.
     * @param tx
     * @param commitment
     * @returns
     */
    async simulate(tx, _a) {
        var _b, _c, _d, _e;
        var { commitment = (_c = (_b = this.opts.preflightCommitment) !== null && _b !== void 0 ? _b : this.opts.commitment) !== null && _c !== void 0 ? _c : "confirmed", verifySigners = true, } = _a === void 0 ? {
            commitment: (_e = (_d = this.opts.preflightCommitment) !== null && _d !== void 0 ? _d : this.opts.commitment) !== null && _e !== void 0 ? _e : "confirmed",
            verifySigners: true,
        } : _a;
        if (verifySigners && tx.signatures.length === 0) {
            throw new Error("Transaction must be signed before simulating.");
        }
        try {
            return await Promise.any(this.connections.map(async (connection) => {
                return await simulateTransactionWithCommitment(connection, tx, commitment);
            }));
        }
        catch (e) {
            if (e instanceof AggregateError) {
                throw firstAggregateError(e);
            }
            else {
                throw e;
            }
        }
    }
}
//# sourceMappingURL=index.js.map