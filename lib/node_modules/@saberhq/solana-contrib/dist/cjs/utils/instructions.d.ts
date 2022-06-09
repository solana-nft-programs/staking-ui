import { PublicKey, TransactionInstruction } from "@solana/web3.js";
/**
 * ID of the memo program.
 */
export declare const MEMO_PROGRAM_ID: PublicKey;
/**
 * Creates a memo program instruction.
 *
 * More info: https://spl.solana.com/memo
 *
 * @param text Text of the memo.
 * @param signers Optional signers to validate.
 * @returns
 */
export declare const createMemoInstruction: (text: string, signers?: readonly PublicKey[]) => TransactionInstruction;
//# sourceMappingURL=instructions.d.ts.map