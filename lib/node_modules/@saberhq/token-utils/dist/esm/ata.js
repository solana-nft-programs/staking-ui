import { getProgramAddress } from "@saberhq/solana-contrib";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, } from "@solana/spl-token";
/**
 * Gets an associated token account address.
 *
 * @deprecated use {@link getATAAddressSync}
 */
export const getATAAddress = async ({ mint, owner, }) => {
    return Promise.resolve(getATAAddressSync({ mint, owner }));
};
/**
 * Gets an associated token account address synchronously.
 */
export const getATAAddressSync = ({ mint, owner, }) => {
    return getProgramAddress([owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()], ASSOCIATED_TOKEN_PROGRAM_ID);
};
/**
 * Gets multiple associated token account addresses.
 *
 * @deprecated use {@link getATAAddressesSync}
 */
export const getATAAddresses = ({ mints, owner, }) => {
    return Promise.resolve(getATAAddressesSync({ mints, owner }));
};
/**
 * Gets multiple associated token account addresses.
 */
export const getATAAddressesSync = ({ mints, owner, }) => {
    const result = Object.entries(mints).map((args) => {
        const [name, mint] = args;
        const result = getATAAddressSync({
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
//# sourceMappingURL=ata.js.map