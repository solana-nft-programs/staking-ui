import type { Commitment, ConfirmOptions, Connection, KeyedAccountInfo, PublicKey, RpcResponseAndContext, Signer, SimulatedTransactionResponse, Transaction, TransactionInstruction } from "@solana/web3.js";
import type { Broadcaster, ReadonlyProvider } from "./index.js";
import { PendingTransaction } from "./index.js";
import type { Provider, SendTxRequest, SignAndBroadcastOptions, TransactionSigner, Wallet } from "./interfaces.js";
import { TransactionEnvelope } from "./transaction/TransactionEnvelope.js";
export declare const DEFAULT_PROVIDER_OPTIONS: ConfirmOptions;
export declare const DEFAULT_READONLY_PUBLIC_KEY: PublicKey;
/**
 * Provider that can only read.
 */
export declare class SolanaReadonlyProvider implements ReadonlyProvider {
    readonly connection: Connection;
    readonly opts: ConfirmOptions;
    readonly publicKey: PublicKey;
    /**
     * @param connection The cluster connection where the program is deployed.
     * @param opts       Transaction confirmation options to use by default.
     * @param publicKey  Optional public key of read-only wallet.
     */
    constructor(connection: Connection, opts?: ConfirmOptions, publicKey?: PublicKey);
    wallet: Wallet;
    /**
     * Gets
     * @param accountId
     * @returns
     */
    getAccountInfo(accountId: PublicKey): Promise<KeyedAccountInfo | null>;
}
export declare const doSignAndBroadcastTransaction: (wallet: Pick<Wallet, "signTransaction">, transaction: Transaction, broadcaster: Broadcaster, opts?: SignAndBroadcastOptions) => Promise<PendingTransaction>;
/**
 * Signs Solana transactions.
 */
export declare class SolanaTransactionSigner implements TransactionSigner {
    readonly wallet: Wallet;
    readonly broadcaster: Broadcaster;
    readonly preflightCommitment: Commitment;
    constructor(wallet: Wallet, broadcaster: Broadcaster, preflightCommitment?: Commitment);
    get publicKey(): PublicKey;
    signAndBroadcastTransaction(transaction: Transaction, opts?: SignAndBroadcastOptions | undefined): Promise<PendingTransaction>;
    /**
     * Sends the given transaction, paid for and signed by the provider's wallet.
     *
     * @param tx      The transaction to send.
     * @param signers The set of signers in addition to the provdier wallet that
     *                will sign the transaction.
     * @param opts    Transaction confirmation options.
     */
    sign(tx: Transaction, signers?: readonly (Signer | undefined)[], opts?: ConfirmOptions): Promise<Transaction>;
    /**
     * Similar to `send`, but for an array of transactions and signers.
     */
    signAll(reqs: readonly SendTxRequest[], opts?: ConfirmOptions): Promise<Transaction[]>;
}
/**
 * The network and wallet context used to send transactions paid for and signed
 * by the provider.
 *
 * This implementation was taken from Anchor.
 */
export declare class SolanaProvider extends SolanaReadonlyProvider implements Provider {
    readonly connection: Connection;
    readonly broadcaster: Broadcaster;
    readonly wallet: Wallet;
    readonly opts: ConfirmOptions;
    readonly signer: TransactionSigner;
    /**
     * @param connection The cluster connection where the program is deployed.
     * @param sendConnection The connection where transactions are sent to.
     * @param wallet     The wallet used to pay for and sign all transactions.
     * @param opts       Transaction confirmation options to use by default.
     */
    constructor(connection: Connection, broadcaster: Broadcaster, wallet: Wallet, opts?: ConfirmOptions, signer?: TransactionSigner);
    signAndBroadcastTransaction(transaction: Transaction, opts?: SignAndBroadcastOptions): Promise<PendingTransaction>;
    /**
     * Creates a new SolanaProvider.
     * @deprecated use {@link SolanaProvider.init}
     */
    static load({ connection, sendConnection, wallet, opts, }: {
        /**
         * Connection used for general reads
         */
        connection: Connection;
        /**
         * Connection used for sending transactions
         */
        sendConnection?: Connection;
        /**
         * Wallet used for signing transactions
         */
        wallet: Wallet;
        /**
         * Confirmation options
         */
        opts?: ConfirmOptions;
    }): SolanaProvider;
    /**
     * Initializes a new SolanaProvider.
     */
    static init({ connection, broadcastConnections, wallet, opts, }: {
        /**
         * Connection used for general reads
         */
        readonly connection: Connection;
        /**
         * Connections used for broadcasting transactions. Defaults to the read connection.
         */
        readonly broadcastConnections?: readonly Connection[];
        /**
         * Wallet used for signing transactions
         */
        readonly wallet: Wallet;
        /**
         * Confirmation options
         */
        readonly opts?: ConfirmOptions;
    }): SolanaProvider;
    /**
     * Sends the given transaction, paid for and signed by the provider's wallet.
     *
     * @param tx      The transaction to send.
     * @param signers The set of signers in addition to the provider wallet that
     *                will sign the transaction.
     * @param opts    Transaction confirmation options.
     */
    send(tx: Transaction, signers?: (Signer | undefined)[], opts?: ConfirmOptions): Promise<PendingTransaction>;
    /**
     * Similar to `send`, but for an array of transactions and signers.
     */
    sendAll(reqs: readonly SendTxRequest[], opts?: ConfirmOptions): Promise<PendingTransaction[]>;
    /**
     * Simulates the given transaction, returning emitted logs from execution.
     *
     * @param tx      The transaction to send.
     * @param signers The set of signers in addition to the provider wallet that
     *                will sign the transaction. If specified, the provider will
     *                sign the transaction.
     * @param opts    Transaction confirmation options.
     */
    simulate(tx: Transaction, signers: (Signer | undefined)[] | undefined, opts?: ConfirmOptions): Promise<RpcResponseAndContext<SimulatedTransactionResponse>>;
}
/**
 * Provider with utility functions.
 */
export interface AugmentedProvider extends Provider {
    /**
     * The {@link PublicKey} of the wallet.
     */
    readonly walletKey: PublicKey;
    /**
     * Creates a new transaction using this Provider.
     * @param instructions
     * @param signers
     * @returns
     */
    newTX: (instructions?: (TransactionInstruction | null | undefined | boolean)[], signers?: Signer[]) => TransactionEnvelope;
    /**
     * Requests an airdrop of tokens.
     * @param lamports Number of lamports.
     * @returns
     */
    requestAirdrop: (lamports: number) => Promise<PendingTransaction>;
    /**
     * Returns this provider with a different signer.
     * @param signer
     * @returns
     */
    withSigner: (signer: Signer) => AugmentedProvider;
}
/**
 * Wrapper for a Provider containing utility functions.
 */
export declare class SolanaAugmentedProvider implements AugmentedProvider {
    readonly provider: Provider;
    constructor(provider: Provider);
    get walletKey(): PublicKey;
    get connection(): Connection;
    get signer(): TransactionSigner;
    get broadcaster(): Broadcaster;
    get opts(): ConfirmOptions;
    get wallet(): Wallet;
    signAndBroadcastTransaction(transaction: Transaction, opts?: SignAndBroadcastOptions): Promise<PendingTransaction>;
    send(tx: Transaction, signers?: (Signer | undefined)[] | undefined, opts?: ConfirmOptions | undefined): Promise<PendingTransaction>;
    sendAll(reqs: readonly SendTxRequest[], opts?: ConfirmOptions | undefined): Promise<PendingTransaction[]>;
    simulate(tx: Transaction, signers?: (Signer | undefined)[] | undefined, opts?: ConfirmOptions | undefined): Promise<RpcResponseAndContext<SimulatedTransactionResponse>>;
    getAccountInfo(accountId: PublicKey): Promise<KeyedAccountInfo | null>;
    /**
     * Creates a new transaction using this Provider.
     * @param instructions
     * @param signers
     * @returns
     */
    newTX(instructions?: (TransactionInstruction | null | undefined | boolean)[], signers?: Signer[]): TransactionEnvelope;
    /**
     * Requests an airdrop of tokens.
     * @param amount
     * @returns
     */
    requestAirdrop(lamports: number, to?: PublicKey): Promise<PendingTransaction>;
    /**
     * Returns this provider with a different signer.
     * @param signer
     * @returns
     */
    withSigner(signer: Signer): SolanaAugmentedProvider;
}
//# sourceMappingURL=provider.d.ts.map