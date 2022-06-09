"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getATAAddressesSync = exports.getATAAddresses = exports.getATAAddressSync = exports.getATAAddress = void 0;
const solana_contrib_1 = require("@saberhq/solana-contrib");
const spl_token_1 = require("@solana/spl-token");
/**
 * Gets an associated token account address.
 *
 * @deprecated use {@link getATAAddressSync}
 */
const getATAAddress = async ({ mint, owner, }) => {
    return Promise.resolve((0, exports.getATAAddressSync)({ mint, owner }));
};
exports.getATAAddress = getATAAddress;
/**
 * Gets an associated token account address synchronously.
 */
const getATAAddressSync = ({ mint, owner, }) => {
    return (0, solana_contrib_1.getProgramAddress)([owner.toBuffer(), spl_token_1.TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()], spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID);
};
exports.getATAAddressSync = getATAAddressSync;
/**
 * Gets multiple associated token account addresses.
 *
 * @deprecated use {@link getATAAddressesSync}
 */
const getATAAddresses = ({ mints, owner, }) => {
    return Promise.resolve((0, exports.getATAAddressesSync)({ mints, owner }));
};
exports.getATAAddresses = getATAAddresses;
/**
 * Gets multiple associated token account addresses.
 */
const getATAAddressesSync = ({ mints, owner, }) => {
    const result = Object.entries(mints).map((args) => {
        const [name, mint] = args;
        const result = (0, exports.getATAAddressSync)({
            mint,
            owner: owner,
        });
        return {
            address: result,
            name,
            mint,
        };
    });
    const deduped = result.reduce((acc, { address, name, mint }) => {
        return {
            accounts: {
                ...acc.accounts,
                [name]: { address, mint },
            },
        };
    }, { accounts: {} });
    return {
        accounts: deduped.accounts,
    };
};
exports.getATAAddressesSync = getATAAddressesSync;
//# sourceMappingURL=ata.js.map