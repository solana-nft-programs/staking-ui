"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestHeapFrameInstruction = exports.requestComputeUnitsInstruction = void 0;
const web3_js_1 = require("@solana/web3.js");
const index_js_1 = require("./index.js");
const layouts_js_1 = require("./layouts.js");
/**
 * Request a specific maximum number of compute units the transaction is
 * allowed to consume and an additional fee to pay.
 */
const requestComputeUnitsInstruction = (units, additionalFee) => {
    const data = Buffer.alloc(layouts_js_1.RequestUnitsLayout.span);
    layouts_js_1.RequestUnitsLayout.encode({ instruction: 0, units, additionalFee }, data);
    return new web3_js_1.TransactionInstruction({
        data,
        keys: [],
        programId: index_js_1.COMPUTE_BUDGET_PROGRAM,
    });
};
exports.requestComputeUnitsInstruction = requestComputeUnitsInstruction;
/**
 * Request a specific transaction-wide program heap region size in bytes.
 * The value requested must be a multiple of 1024. This new heap region
 * size applies to each program executed, including all calls to CPIs.
 */
const requestHeapFrameInstruction = (bytes) => {
    const data = Buffer.alloc(layouts_js_1.RequestHeapFrameLayout.span);
    layouts_js_1.RequestHeapFrameLayout.encode({ instruction: 1, bytes }, data);
    return new web3_js_1.TransactionInstruction({
        data,
        keys: [],
        programId: index_js_1.COMPUTE_BUDGET_PROGRAM,
    });
};
exports.requestHeapFrameInstruction = requestHeapFrameInstruction;
//# sourceMappingURL=instructions.js.map