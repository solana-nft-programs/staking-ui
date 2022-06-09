import { BorshAccountsCoder } from "@project-serum/anchor";
import camelCase from "lodash.camelcase";
/**
 * Creates parsers for accounts.
 *
 * This is intended to be called once at initialization.
 *
 * @param idl The IDL.
 */
export const generateAccountParsers = (idl) => {
    var _a;
    const coder = new BorshAccountsCoder(idl);
    return generateAccountParsersFromCoder((_a = idl.accounts) === null || _a === void 0 ? void 0 : _a.map((a) => a.name), coder);
};
/**
 * Creates parsers for accounts.
 *
 * This is intended to be called once at initialization.
 *
 * @param idl The IDL.
 */
export const generateAccountParsersFromCoder = (accountNames, coder) => {
    return (accountNames !== null && accountNames !== void 0 ? accountNames : []).reduce((parsers, account) => {
        parsers[camelCase(account)] = (data) => coder.decode(account, data);
        return parsers;
    }, {});
};
//# sourceMappingURL=generateAccountParsers.js.map