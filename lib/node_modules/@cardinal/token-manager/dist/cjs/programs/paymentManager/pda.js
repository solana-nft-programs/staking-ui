"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPaymentManagerAddress = void 0;
const anchor_1 = require("@project-serum/anchor");
const web3_js_1 = require("@solana/web3.js");
const _1 = require(".");
/**
 * Finds the address of the payment manager.
 * @returns
 */
const findPaymentManagerAddress = async (name) => {
    return await web3_js_1.PublicKey.findProgramAddress([
        anchor_1.utils.bytes.utf8.encode(_1.PAYMENT_MANAGER_SEED),
        anchor_1.utils.bytes.utf8.encode(name),
    ], _1.PAYMENT_MANAGER_ADDRESS);
};
exports.findPaymentManagerAddress = findPaymentManagerAddress;
//# sourceMappingURL=pda.js.map