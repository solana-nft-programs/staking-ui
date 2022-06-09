"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMemoInstruction = exports.MEMO_PROGRAM_ID = void 0;
const web3_js_1 = require("@solana/web3.js");
/**
 * ID of the memo program.
 */
exports.MEMO_PROGRAM_ID = new web3_js_1.PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");
/**
 * Creates a memo program instruction.
 *
 * More info: https://spl.solana.com/memo
 *
 * @param text Text of the memo.
 * @param signers Optional signers to validate.
 * @returns
 */
const createMemoInstruction = (text, signers = []) => {
    return new web3_js_1.TransactionInstruction({
        programId: exports.MEMO_PROGRAM_ID,
        keys: signers.map((s) => ({
            pubkey: s,
            isSigner: true,
            isWritable: false,
        })),
        data: Buffer.from(text, "utf8"),
    });
};
exports.createMemoInstruction = createMemoInstruction;
//# sourceMappingURL=instructions.js.map