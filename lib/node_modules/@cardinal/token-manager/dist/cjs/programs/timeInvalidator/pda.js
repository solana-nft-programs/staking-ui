"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findTimeInvalidatorAddress = void 0;
const anchor_1 = require("@project-serum/anchor");
const web3_js_1 = require("@solana/web3.js");
const constants_1 = require("./constants");
/**
 * Finds the time invalidator for this token manager.
 * @returns
 */
const findTimeInvalidatorAddress = async (tokenManagerId) => {
    return await web3_js_1.PublicKey.findProgramAddress([anchor_1.utils.bytes.utf8.encode(constants_1.TIME_INVALIDATOR_SEED), tokenManagerId.toBuffer()], constants_1.TIME_INVALIDATOR_ADDRESS);
};
exports.findTimeInvalidatorAddress = findTimeInvalidatorAddress;
//# sourceMappingURL=pda.js.map