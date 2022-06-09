"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendRentalExpiration = exports.claimRental = exports.createRental = void 0;
const web3_js_1 = require("@solana/web3.js");
const _1 = require(".");
/**
 * Main method for creating any kind of rental
 * Allows for optional payment, optional usages or expiration and includes a otp for private links
 * @param connection
 * @param wallet
 * @returns Transaction, public key for the created token manager and a otp if necessary for private links
 */
const createRental = async (connection, wallet, rentalParameters) => (0, _1.withIssueToken)(new web3_js_1.Transaction(), connection, wallet, rentalParameters);
exports.createRental = createRental;
const claimRental = async (connection, wallet, tokenManagerId, payer) => (0, _1.withClaimToken)(new web3_js_1.Transaction(), connection, wallet, tokenManagerId, {
    payer,
});
exports.claimRental = claimRental;
const extendRentalExpiration = async (connection, wallet, tokenManagerId, secondsToAdd) => (0, _1.withExtendExpiration)(new web3_js_1.Transaction(), connection, wallet, tokenManagerId, secondsToAdd);
exports.extendRentalExpiration = extendRentalExpiration;
//# sourceMappingURL=rentals.js.map