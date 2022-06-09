"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findClaimApproverAddress = void 0;
const anchor_1 = require("@project-serum/anchor");
const web3_js_1 = require("@solana/web3.js");
const constants_1 = require("./constants");
/**
 * Finds the address of the paid claim approver.
 * @returns
 */
const findClaimApproverAddress = async (tokenManagerId) => {
    return await web3_js_1.PublicKey.findProgramAddress([anchor_1.utils.bytes.utf8.encode(constants_1.CLAIM_APPROVER_SEED), tokenManagerId.toBuffer()], constants_1.CLAIM_APPROVER_ADDRESS);
};
exports.findClaimApproverAddress = findClaimApproverAddress;
//# sourceMappingURL=pda.js.map