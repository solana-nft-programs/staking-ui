"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAnchorAccounts = void 0;
const tslib_1 = require("tslib");
const anchor_1 = require("@project-serum/anchor");
const lodash_camelcase_1 = tslib_1.__importDefault(require("lodash.camelcase"));
/**
 * Generates the metadata of accounts.
 *
 * This is intended to be called once at initialization.
 */
const generateAnchorAccounts = (programID, accounts, coder) => {
    const parsers = {};
    accounts.forEach((account) => {
        parsers[(0, lodash_camelcase_1.default)(account.name)] = {
            programID,
            name: account.name,
            encode: (value) => coder.encode(account.name, value),
            parse: (data) => coder.decode(account.name, data),
            idl: account,
            size: coder.size(account),
            discriminator: anchor_1.BorshAccountsCoder.accountDiscriminator(account.name),
        };
    });
    return parsers;
};
exports.generateAnchorAccounts = generateAnchorAccounts;
//# sourceMappingURL=accounts.js.map