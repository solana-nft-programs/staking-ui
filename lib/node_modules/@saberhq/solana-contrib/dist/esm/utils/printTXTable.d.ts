import type { Transaction } from "@solana/web3.js";
import { TransactionEnvelope } from "../index.js";
/**
 * Takes in a simulation result of a transaction and prints it in a cool table.
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
 * Safe for browser usage. Can be conveniently run with txEnvelope.simulateTable()
 */
export declare const printTXTable: (tx: TransactionEnvelope, transactionLogs: string[], message: string) => void;
export declare class TXSizeEstimationError extends Error {
    readonly underlyingError: unknown;
    constructor(underlyingError: unknown);
}
export declare class EstimatedTXTooBigError extends Error {
    readonly tx: Transaction;
    readonly size: number;
    constructor(tx: Transaction, size: number);
}
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
 *
 * Returns 8888 if the transaction was too big.
 * Returns 9999 if the transaction was unable to be built.
 */
export declare const estimateTransactionSize: (txEnvelope: TransactionEnvelope) => number;
//# sourceMappingURL=printTXTable.d.ts.map