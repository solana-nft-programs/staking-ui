"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaAugmentedProvider = exports.SolanaProvider = exports.SolanaTransactionSigner = exports.doSignAndBroadcastTransaction = exports.SolanaReadonlyProvider = exports.DEFAULT_READONLY_PUBLIC_KEY = exports.DEFAULT_PROVIDER_OPTIONS = void 0;
const tslib_1 = require("tslib");
const web3_js_1 = require("@solana/web3.js");
const tiny_invariant_1 = tslib_1.__importDefault(require("tiny-invariant"));
const index_js_1 = require("./broadcaster/index.js");
const index_js_2 = require("./index.js");
const TransactionEnvelope_js_1 = require("./transaction/TransactionEnvelope.js");
exports.DEFAULT_PROVIDER_OPTIONS = {
    preflightCommitment: "confirmed",
    commitment: "confirmed",
};
exports.DEFAULT_READONLY_PUBLIC_KEY = web3_js_1.SystemProgram.programId;
/**
 * Provider that can only read.
 */
class SolanaReadonlyProvider {
    /**
     * @param connection The cluster connection where the program is deployed.
     * @param opts       Transaction confirmation options to use by default.
     * @param publicKey  Optional public key of read-only wallet.
     */
    constructor(connection, opts = exports.DEFAULT_PROVIDER_OPTIONS, publicKey = exports.DEFAULT_READONLY_PUBLIC_KEY) {
        this.connection = connection;
        this.opts = opts;
        this.publicKey = publicKey;
        this.wallet = {
            signTransaction: Promise.resolve.bind(Promise),
            signAllTransactions: Promise.resolve.bind(Promise),
            publicKey: exports.DEFAULT_READONLY_PUBLIC_KEY,
        };
        this.wallet = {
            ...this.wallet,
            publicKey,
        };
    }
    /**
     * Gets
     * @param accountId
     * @returns
     */
    async getAccountInfo(accountId) {
        const accountInfo = await this.connection.getAccountInfo(accountId, this.opts.commitment);
        if (!accountInfo) {
            return null;
        }
        return {
            accountId,
            accountInfo,
        };
    }
}
exports.SolanaReadonlyProvider = SolanaReadonlyProvider;
const doSignAndBroadcastTransaction = async (wallet, transaction, broadcaster, opts) => {
    const tx = await wallet.signTransaction(transaction);
    if ((opts === null || opts === void 0 ? void 0 : opts.signers) && opts.signers.length > 0) {
        tx.sign(...opts.signers);
    }
    return await broadcaster.broadcast(tx, opts);
};
exports.doSignAndBroadcastTransaction = doSignAndBroadcastTransaction;
/**
 * Signs Solana transactions.
 */
class SolanaTransactionSigner {
    constructor(wallet, broadcaster, preflightCommitment = "confirmed") {
        this.wallet = wallet;
        this.broadcaster = broadcaster;
        this.preflightCommitment = preflightCommitment;
    }
    get publicKey() {
        return this.wallet.publicKey;
    }
    async signAndBroadcastTransaction(transaction, opts) {
        return await (0, exports.doSignAndBroadcastTransaction)(this.wallet, transaction, this.broadcaster, opts);
    }
    /**
     * Sends the given transaction, paid for and signed by the provider's wallet.
     *
     * @param tx      The transaction to send.
     * @param signers The set of signers in addition to the provdier wallet that
     *                will sign the transaction.
     * @param opts    Transaction confirmation options.
     */
    async sign(tx, signers = [], opts = {
        preflightCommitment: this.preflightCommitment,
    }) {
        const { blockhash, lastValidBlockHeight } = await this.broadcaster.getLatestBlockhash(opts.preflightCommitment);
        tx.feePayer = this.wallet.publicKey;
        tx.lastValidBlockHeight = lastValidBlockHeight;
        tx.recentBlockhash = blockhash;
        await this.wallet.signTransaction(tx);
        signers
            .filter((s) => s !== undefined)
            .forEach((kp) => {
            tx.partialSign(kp);
        });
        return tx;
    }
    /**
     * Similar to `send`, but for an array of transactions and signers.
     */
    async signAll(reqs, opts = {
        preflightCommitment: this.preflightCommitment,
    }) {
        const { blockhash, lastValidBlockHeight } = await this.broadcaster.getLatestBlockhash(opts.preflightCommitment);
        const txs = reqs.map(({ tx, signers = [] }) => {
            tx.feePayer = this.wallet.publicKey;
            tx.lastValidBlockHeight = lastValidBlockHeight;
            tx.recentBlockhash = blockhash;
            signers
                .filter((s) => s !== undefined)
                .forEach((kp) => {
                tx.partialSign(kp);
            });
            return tx;
        });
        const signedTxs = await this.wallet.signAllTransactions(txs);
        return signedTxs;
    }
}
exports.SolanaTransactionSigner = SolanaTransactionSigner;
/**
 * The network and wallet context used to send transactions paid for and signed
 * by the provider.
 *
 * This implementation was taken from Anchor.
 */
class SolanaProvider extends SolanaReadonlyProvider {
    /**
     * @param connection The cluster connection where the program is deployed.
     * @param sendConnection The connection where transactions are sent to.
     * @param wallet     The wallet used to pay for and sign all transactions.
     * @param opts       Transaction confirmation options to use by default.
     */
    constructor(connection, broadcaster, wallet, opts = exports.DEFAULT_PROVIDER_OPTIONS, signer = new SolanaTransactionSigner(wallet, broadcaster, opts.preflightCommitment)) {
        super(connection, opts);
        this.connection = connection;
        this.broadcaster = broadcaster;
        this.wallet = wallet;
        this.opts = opts;
        this.signer = signer;
    }
    async signAndBroadcastTransaction(transaction, opts) {
        return await this.signer.signAndBroadcastTransaction(transaction, opts);
    }
    /**
     * Creates a new SolanaProvider.
     * @deprecated use {@link SolanaProvider.init}
     */
    static load({ connection, sendConnection = connection, wallet, opts, }) {
        return new SolanaProvider(connection, new index_js_1.SingleConnectionBroadcaster(sendConnection, opts), wallet, opts);
    }
    /**
     * Initializes a new SolanaProvider.
     */
    static init({ connection, broadcastConnections = [connection], wallet, opts = exports.DEFAULT_PROVIDER_OPTIONS, }) {
        const firstBroadcastConnection = broadcastConnections[0];
        (0, tiny_invariant_1.default)(firstBroadcastConnection, "must have at least one broadcast connection");
        return new SolanaProvider(connection, broadcastConnections.length > 1
            ? new index_js_2.TieredBroadcaster(connection, broadcastConnections, opts)
            : new index_js_1.SingleConnectionBroadcaster(firstBroadcastConnection, opts), wallet, opts);
    }
    /**
     * Sends the given transaction, paid for and signed by the provider's wallet.
     *
     * @param tx      The transaction to send.
     * @param signers The set of signers in addition to the provider wallet that
     *                will sign the transaction.
     * @param opts    Transaction confirmation options.
     */
    async send(tx, signers = [], opts = this.opts) {
        const theTx = await this.signer.sign(tx, signers, opts);
        const pending = await this.broadcaster.broadcast(theTx, opts);
        await pending.wait();
        return pending;
    }
    /**
     * Similar to `send`, but for an array of transactions and signers.
     */
    async sendAll(reqs, opts = this.opts) {
        const txs = await this.signer.signAll(reqs, opts);
        return await Promise.all(txs.map(async (tx) => {
            const pending = await this.broadcaster.broadcast(tx, opts);
            await pending.wait();
            return pending;
        }));
    }
    /**
     * Simulates the given transaction, returning emitted logs from execution.
     *
     * @param tx      The transaction to send.
     * @param signers The set of signers in addition to the provider wallet that
     *                will sign the transaction. If specified, the provider will
     *                sign the transaction.
     * @param opts    Transaction confirmation options.
     */
    async simulate(tx, signers, opts = this.opts) {
        let simTX = tx;
        if (signers !== undefined) {
            simTX = await this.signer.sign(tx, signers, opts);
        }
        return await this.broadcaster.simulate(simTX, {
            verifySigners: signers !== undefined,
            commitment: opts.commitment,
        });
    }
}
exports.SolanaProvider = SolanaProvider;
/**
 * Wrapper for a Provider containing utility functions.
 */
class SolanaAugmentedProvider {
    constructor(provider) {
        this.provider = provider;
    }
    get walletKey() {
        return this.provider.wallet.publicKey;
    }
    get connection() {
        return this.provider.connection;
    }
    get signer() {
        return this.provider.signer;
    }
    get broadcaster() {
        return this.provider.broadcaster;
    }
    get opts() {
        return this.provider.opts;
    }
    get wallet() {
        return this.provider.wallet;
    }
    signAndBroadcastTransaction(transaction, opts) {
        return this.provider.signAndBroadcastTransaction(transaction, opts);
    }
    send(tx, signers, opts) {
        return this.provider.send(tx, signers, opts);
    }
    sendAll(reqs, opts) {
        return this.provider.sendAll(reqs, opts);
    }
    simulate(tx, signers, opts) {
        return this.provider.simulate(tx, signers, opts);
    }
    getAccountInfo(accountId) {
        return this.provider.getAccountInfo(accountId);
    }
    /**
     * Creates a new transaction using this Provider.
     * @param instructions
     * @param signers
     * @returns
     */
    newTX(instructions = [], signers = []) {
        return TransactionEnvelope_js_1.TransactionEnvelope.create(this, instructions, signers);
    }
    /**
     * Requests an airdrop of tokens.
     * @param amount
     * @returns
     */
    async requestAirdrop(lamports, to = this.wallet.publicKey) {
        return new index_js_2.PendingTransaction(this.connection, await this.connection.requestAirdrop(to, lamports));
    }
    /**
     * Returns this provider with a different signer.
     * @param signer
     * @returns
     */
    withSigner(signer) {
        return new SolanaAugmentedProvider(new SolanaProvider(this.connection, this.broadcaster, new index_js_2.SignerWallet(signer), this.opts));
    }
}
exports.SolanaAugmentedProvider = SolanaAugmentedProvider;
//# sourceMappingURL=provider.js.map