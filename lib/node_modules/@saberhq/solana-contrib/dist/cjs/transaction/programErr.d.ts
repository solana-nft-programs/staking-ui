/**
 * Borrowed from explorer.solana.com code written by @jstarry.
 */
import type { TransactionError } from "@solana/web3.js";
/**
 * Solana error messages built-in.
 */
export declare const BUILTIN_SOLANA_ERROR_MESSAGES: Map<string, string>;
export declare type ProgramError = {
    index: number;
    message: string;
};
export declare function getTransactionInstructionError(error?: TransactionError | null): ProgramError | undefined;
//# sourceMappingURL=programErr.d.ts.map