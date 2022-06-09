"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMPUTE_BUDGET_PROGRAM = void 0;
const tslib_1 = require("tslib");
const web3_js_1 = require("@solana/web3.js");
/**
 * The compute budget program.
 * Source: https://github.com/solana-labs/solana/blob/master/program-runtime/src/compute_budget.rs#L101
 */
exports.COMPUTE_BUDGET_PROGRAM = new web3_js_1.PublicKey("ComputeBudget111111111111111111111111111111");
tslib_1.__exportStar(require("./instructions.js"), exports);
//# sourceMappingURL=index.js.map