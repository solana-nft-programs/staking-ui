import { Transaction } from "@solana/web3.js";
import { withClaimToken, withExtendExpiration, withIssueToken } from ".";
/**
 * Main method for creating any kind of rental
 * Allows for optional payment, optional usages or expiration and includes a otp for private links
 * @param connection
 * @param wallet
 * @returns Transaction, public key for the created token manager and a otp if necessary for private links
 */
export const createRental = async (connection, wallet, rentalParameters) => withIssueToken(new Transaction(), connection, wallet, rentalParameters);
export const claimRental = async (connection, wallet, tokenManagerId, payer) => withClaimToken(new Transaction(), connection, wallet, tokenManagerId, {
    payer,
});
export const extendRentalExpiration = async (connection, wallet, tokenManagerId, secondsToAdd) => withExtendExpiration(new Transaction(), connection, wallet, tokenManagerId, secondsToAdd);
//# sourceMappingURL=rentals.js.map