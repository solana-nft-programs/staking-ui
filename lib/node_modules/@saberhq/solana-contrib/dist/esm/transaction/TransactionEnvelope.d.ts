import type { Cluster, ConfirmOptions, RpcResponseAndContext, Signer, SimulatedTransactionResponse, TransactionInstruction } from "@solana/web3.js";
import { PublicKey, Transaction } from "@solana/web3.js";
import type { BroadcastOptions } from "../broadcaster/index.js";
import type { Provider } from "../interfaces.js";
import { EstimatedTXTooBigError, TXSizeEstimationError } from "../utils/index.js";
import type { PendingTransaction } from "./PendingTransaction.js";
import type { TransactionReceipt } from "./TransactionReceipt.js";
import type { SerializableInstruction } from "./utils.js";
export declare const PACKET_DATA_SIZE: number;
/**
 * Options for simulating a transaction.
 */
export interface TXEnvelopeSimulateOptions extends ConfirmOptions {
    /**
     * Verify that the signers of the TX enveloper are valid.
     */
    verifySigners?: boolean;
}
/**
 * Contains a Transaction that is being built.
 */
export declare class TransactionEnvelope {
    /**
     * Provider that will be sending the transaction as the fee payer.
     */
    readonly provider: Provider;
    /**
     * Instructions associated with the transaction.
     */
    readonly instructions: TransactionInstruction[];
    /**
     * Optional signers of the transaction.
     */
    readonly signers: Signer[];
    constructor(
    /**
     * Provider that will be sending the transaction as the fee payer.
     */
    provider: Provider, 
    /**
     * Instructions associated with the transaction.
     */
    instructions: TransactionInstruction[], 
    /**
     * Optional signers of the transaction.
     */
    signers?: Signer[]);
    /**
     * Prepends the given {@link TransactionInstruction}s to the {@link TransactionEnvelope}.
     * @param instructions The instructions to prepend.
     * @returns
     */
    prepend(...instructions: (TransactionInstruction | null | undefined | boolean)[]): TransactionEnvelope;
    /**
     * Appends the given {@link TransactionInstruction}s to the {@link TransactionEnvelope}.
     * @param instructions The instructions to append.
     * @returns
     */
    append(...instructions: (TransactionInstruction | null | undefined | boolean)[]): TransactionEnvelope;
    /**
     * A the given {@link TransactionInstruction}s to the {@link TransactionEnvelope}.
     * @param instructions The instructions to add.
     * @deprecated Use {@link #append} instead.
     * @returns
     */
    addInstructions(...instructions: (TransactionInstruction | null | undefined | boolean)[]): TransactionEnvelope;
    /**
     * Adds the given {@link Signer}s to the {@link TransactionEnvelope}.
     * @param signers The signers to add.
     * @returns
     */
    addSigners(...signers: Signer[]): TransactionEnvelope;
    /**
     * Builds a transaction from this envelope.
     * @param feePayer Optional override for the fee payer.
     */
    build(feePayer?: PublicKey): Transaction;
    /**
     * Builds a transaction and estimates the size in bytes.
     * Does not check to see if the transaction is too big.
     *
     * @returns Byte count
     */
    estimateSizeUnsafe(): number;
    /**
     * Builds a transaction and estimates the size in bytes. This number is primrily
     * to be used for checking to see if a transaction is too big and instructions
     * need to be split. It may not be 100% accurate.
     *
     * This is used in expectTXTable and is useful for increasing efficiency in
     * dapps that build large transactions.
     *
     * The max transaction size of a v1 Transaction in Solana is 1232 bytes.
     * For info about Transaction v2: https://docs.solana.com/proposals/transactions-v2
     */
    estimateSize(): {
        size: number;
    } | {
        error: EstimatedTXTooBigError | TXSizeEstimationError;
    };
    /**
     * Partition a large {@link TransactionEnvelope} into smaller, valid {@link Transaction}s.
     * This relies on this envelope already having the correct number of signers.
     *
     * @param feePayer Optional fee payer override.
     * @returns A list of {@link Transaction}s.
     */
    buildPartition(feePayer?: PublicKey): Transaction[];
    /**
     * Partition a large {@link TransactionEnvelope} into smaller, valid transaction envelopes which can be built.
     * This relies on this envelope already having the correct number of signers.
     *
     * @returns
     */
    partition(): TransactionEnvelope[];
    /**
     * Filters the required signers for a list of instructions.
     * @param ixs
     * @returns
     */
    private _filterRequiredSigners;
    /**
     * Generates a link for inspecting the contents of this {@link TransactionEnvelope}.
     *
     * @returns URL
     */
    generateInspectLink(cluster?: Cluster): string;
    /**
     * Simulates the transaction.
     * @param opts
     * @returns
     */
    simulate(opts?: TXEnvelopeSimulateOptions): Promise<RpcResponseAndContext<SimulatedTransactionResponse>>;
    /**
     * Simulates the transaction, without validating signers.
     *
     * @deprecated Use {@link TXEnvelope#simulate} instead.
     * @param opts
     * @returns
     */
    simulateUnchecked(opts: ConfirmOptions): Promise<RpcResponseAndContext<SimulatedTransactionResponse>>;
    /**
     * Simulates the transaction and prints a fancy table in the console.
     * ```
     *    ┌─────┬───┬───┬───┬───────────┬──────┬─────┬──────┬───┐
     *    │index│iso│mar│cum│ programId │quota │used │ left │CPI│
     *    ├─────┼───┼───┼───┼───────────┼──────┼─────┼──────┼───┤
     *    │  0  │298│281│464│'ATokenG..'│200000│24270│175730│ 1 │
     *    │  1  │298│ 74│538│'ATokenG..'│178730│21270│157460│ 1 │
     *    │  2  │298│ 74│612│'ATokenG..'│157460│27277│130183│ 1 │
     *    │  3  │298│ 42│686│'ATokenG..'│130183│21270│108913│ 1 │
     *    │  4  │338│265│951│'qExampL..'│108913│76289│ 32624│ 3 │
     *    └─────┴───┴───┴───┴───────────┴──────┴─────┴──────┴───┘
     * ```
     *
     * - **index**: the array index of the instruction within the transaction
     * - **iso**: the isolated size of the instruction (marginal cost of only the instruction)
     * - **mar**: the marginal size cost of the instruction (when added to previous)
     * - **cum**: the cumulative size of the instructions up until that instruction
     * - **quota/used/left**: [BPF instruction compute unit info](https://docs.solana.com/developing/programming-model/runtime)
     * - **CPI**: [the maximum depth of CPI](https://docs.solana.com/developing/programming-model/calling-between-programs) (current limit in Solana is 4)
     *
     * @param opts
     * @returns
     */
    simulateTable(opts?: TXEnvelopeSimulateOptions): Promise<RpcResponseAndContext<SimulatedTransactionResponse>>;
    /**
     * Sends the transaction without confirming it.
     * @param opts
     * @returns
     */
    send(opts?: BroadcastOptions): Promise<PendingTransaction>;
    /**
     * Sends the transaction and waits for confirmation.
     * @param opts
     */
    confirm(opts?: BroadcastOptions): Promise<TransactionReceipt>;
    /**
     * Combines the instructions/signers of the other envelope to create one large transaction.
     */
    combine(other: TransactionEnvelope): TransactionEnvelope;
    /**
     * Get a list of all writable accounts, deduped
     * All of these accounts likely need to be updated after the transaction is confirmed.
     */
    get writableKeys(): PublicKey[];
    /**
     * Gets the instructions in a format that can be serialized easily to JSON.
     */
    get instructionsJSON(): SerializableInstruction[];
    /**
     * Returns a string representation of the {@link TransactionEnvelope}.
     */
    get debugStr(): string;
    /**
     * Creates a new {@link TransactionEnvelope}.
     * @param provider
     * @param instructions
     * @param signers
     * @returns
     */
    static create(provider: Provider, instructions: (TransactionInstruction | null | undefined | boolean)[], signers?: Signer[]): TransactionEnvelope;
    /**
     * Add a memo to each transaction envelope specified.
     */
    static addMemos(memo: string, ...txs: TransactionEnvelope[]): TransactionEnvelope[];
    /**
     * Combines multiple TransactionEnvelopes into one.
     */
    static combineAll(...txs: TransactionEnvelope[]): TransactionEnvelope;
    /**
     * Takes a list of {@link TransactionEnvelope}s and combines them if they
     * are able to be combined under the maximum TX size limit.
     *
     * @param txs
     * @returns
     */
    static pack(...txs: readonly TransactionEnvelope[]): TransactionEnvelope[];
    /**
     * Combines multiple async TransactionEnvelopes into one, serially.
     */
    static combineAllAsync(firstTX: Promise<TransactionEnvelope>, ...txs: Promise<TransactionEnvelope>[]): Promise<TransactionEnvelope>;
    /**
     * Sends all of the envelopes.
     * @returns Pending transactions
     */
    static sendAll(txs: TransactionEnvelope[], opts?: ConfirmOptions): Promise<PendingTransaction[]>;
    /**
     * Deduplicate ATA instructions inside the transaction envelope.
     */
    dedupeATAIXs(): TransactionEnvelope;
    /**
     * Split out ATA instructions to a separate transaction envelope.
     */
    splitATAIXs(): {
        ataIXs: TransactionEnvelope;
        tx: TransactionEnvelope;
    };
    /**
     * Get an instruction from the transaction envelope by index.
     */
    getInstruction(index: number): TransactionInstruction;
    /**
     * Attach a memo instruction to this transaction.
     */
    addMemo(memo: string): TransactionEnvelope;
    /**
     * Request for additional compute units before processing this transaction.
     */
    addAdditionalComputeBudget(units: number, additionalFee: number): TransactionEnvelope;
    /**
     * Request a specific transaction-wide program heap region size in bytes.
     */
    addAdditionalHeapFrame(bytes: number): TransactionEnvelope;
}
//# sourceMappingURL=TransactionEnvelope.d.ts.map