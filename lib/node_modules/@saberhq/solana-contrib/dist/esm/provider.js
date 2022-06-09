import { SystemProgram } from "@solana/web3.js";
import { default as invariant } from "tiny-invariant";
import { SingleConnectionBroadcaster } from "./broadcaster/index.js";
import { PendingTransaction, SignerWallet, TieredBroadcaster, } from "./index.js";
import { TransactionEnvelope } from "./transaction/TransactionEnvelope.js";
export const DEFAULT_PROVIDER_OPTIONS = {
    preflightCommitment: "confirmed",
    commitment: "confirmed",
};
export const DEFAULT_READONLY_PUBLIC_KEY = SystemProgram.programId;
/**
 * Provider that can only read.
 */
export class SolanaReadonlyProvider {
    /**
     * @param connection The cluster connection where the program is deployed.
     * @param opts       Transaction confirmation options to use by default.
     * @param publicKey  Optional public key of read-only wallet.
     */
    constructor(connection, opts = DEFAULT_PROVIDER_OPTIONS, publicKey = DEFAULT_READONLY_PUBLIC_KEY) {
        this.connection = connection;
        this.opts = opts;
        this.publicKey = publicKey;
        this.wallet = {
            signTransaction: Promise.resolve.bind(Promise),
            signAllTransactions: Promise.resolve.bind(Promise),
            publicKey: DEFAULT_READONLY_PUBLIC_KEY,
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
export const doSignAndBroadcastTransaction = async (wallet, transaction, broadcaster, opts) => {
    const tx = await wallet.signTransaction(transaction);
    if ((opts === null || opts === void 0 ? void 0 : opts.signers) && opts.signers.length > 0) {
        tx.sign(...opts.signers);
    }
    return await broadcaster.broadcast(tx, opts);
};
/**
 * Signs Solana transactions.
 */
export class SolanaTransactionSigner {
    constructor(wallet, broadcaster, preflightCommitment = "confirmed") {
        this.wallet = wallet;
        this.broadcaster = broadcaster;
        this.preflightCommitment = preflightCommitment;
    }
    get publicKey() {
        return this.wallet.publicKey;
    }
    async signAndBroadcastTransaction(transaction, opts) {
        return await doSignAndBroadcastTransaction(this.wallet, transaction, this.broadcaster, opts);
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
/**
 * The network and wallet context used to send transactions paid for and signed
 * by the provider.
 *
 * This implementation was taken from Anchor.
 */
export class SolanaProvider extends SolanaReadonlyProvider {
    /**
     * @param connection The cluster connection where the program is deployed.
     * @param sendConnection The connection where transactions are sent to.
     * @param wallet     The wallet used to pay for and sign all transactions.
     * @param opts       Transaction confirmation options to use by default.
     */
    constructor(connection, broadcaster, wallet, opts = DEFAULT_PROVIDER_OPTIONS, signer = new SolanaTransactionSigner(wallet, broadcaster, opts.preflightCommitment)) {
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
        return new SolanaProvider(connection, new SingleConnectionBroadcaster(sendConnection, opts), wallet, opts);
    }
    /**
     * Initializes a new SolanaProvider.
     */
    static init({ connection, broadcastConnections = [connection], wallet, opts = DEFAULT_PROVIDER_OPTIONS, }) {
        const firstBroadcastConnection = broadcastConnections[0];
        invariant(firstBroadcastConnection, "must have at least one broadcast connection");
        return new SolanaProvider(connection, broadcastConnections.length > 1
            ? new TieredBroadcaster(connection, broadcastConnections, opts)
            : new SingleConnectionBroadcaster(firstBroadcastConnection, opts), wallet, opts);
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
/**
 * Wrapper for a Provider containing utility functions.
 */
export class SolanaAugmentedProvider {
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
        return TransactionEnvelope.create(this, instructions, signers);
    }
    /**
     * Requests an airdrop of tokens.
     * @param amount
     * @returns
     */
    async requestAirdrop(lamports, to = this.wallet.publicKey) {
        return new PendingTransaction(this.connection, await this.connection.requestAirdrop(to, lamports));
    }
    /**
     * Returns this provider with a different signer.
     * @param signer
     * @returns
     */
    withSigner(signer) {
        return new SolanaAugmentedProvider(new SolanaProvider(this.connection, this.broadcaster, new SignerWallet(signer), this.opts));
    }
}
//# sourceMappingURL=provider.js.map