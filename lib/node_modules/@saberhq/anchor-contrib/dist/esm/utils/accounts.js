import { BorshAccountsCoder } from "@project-serum/anchor";
import camelCase from "lodash.camelcase";
/**
 * Generates the metadata of accounts.
 *
 * This is intended to be called once at initialization.
 */
export const generateAnchorAccounts = (programID, accounts, coder) => {
    const parsers = {};
    accounts.forEach((account) => {
        parsers[camelCase(account.name)] = {
            programID,
            name: account.name,
            encode: (value) => coder.encode(account.name, value),
            parse: (data) => coder.decode(account.name, data),
            idl: account,
            size: coder.size(account),
            discriminator: BorshAccountsCoder.accountDiscriminator(account.name),
        };
    });
    return parsers;
};
//# sourceMappingURL=accounts.js.map