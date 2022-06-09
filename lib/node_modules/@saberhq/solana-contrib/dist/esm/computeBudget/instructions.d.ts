import { TransactionInstruction } from "@solana/web3.js";
/**
 * Request a specific maximum number of compute units the transaction is
 * allowed to consume and an additional fee to pay.
 */
export declare const requestComputeUnitsInstruction: (units: number, additionalFee: number) => TransactionInstruction;
/**
 * Request a specific transaction-wide program heap region size in bytes.
 * The value requested must be a multiple of 1024. This new heap region
 * size applies to each program executed, including all calls to CPIs.
 */
export declare const requestHeapFrameInstruction: (bytes: number) => TransactionInstruction;
//# sourceMappingURL=instructions.d.ts.map