/**
 * Adapted from explorer.solana.com code written by @jstarry.
 */
import type { TransactionError } from "@solana/web3.js";
/**
 * A log entry.
 */
export declare type InstructionLogEntry = {
    /**
     * Stack depth.
     */
    depth: number;
} & ({
    type: "text";
    text: string;
} | {
    type: "system";
    text: string;
} | {
    type: "cpi";
    programAddress: string | null;
} | {
    type: "success";
} | {
    type: "programError";
    text: string;
} | {
    type: "runtimeError";
    text: string;
});
/**
 * Logs of an individual instruction.
 */
export interface InstructionLogs {
    /**
     * The program invoked, if it exists in the logs.
     */
    programAddress?: string;
    /**
     * Logs of the instruction.
     */
    logs: InstructionLogEntry[];
    /**
     * Whether the instruction failed.
     */
    failed: boolean;
}
/**
 * Stack-aware program log parser.
 * @param logs
 * @param error
 * @returns
 */
export declare const parseTransactionLogs: (logs: string[] | null, error: TransactionError | null) => InstructionLogs[];
/**
 * Formats a log entry to be printed out.
 * @param entry
 * @param prefix
 * @returns
 */
export declare const formatLogEntry: (entry: InstructionLogEntry, prefix?: boolean) => string;
/**
 * Formats instruction logs.
 * @param logs
 */
export declare const formatInstructionLogs: (logs: readonly InstructionLogs[]) => string;
//# sourceMappingURL=parseTransactionLogs.d.ts.map