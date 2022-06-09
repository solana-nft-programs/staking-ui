"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccountParsersFromCoder = exports.generateAccountParsers = void 0;
const tslib_1 = require("tslib");
const anchor_1 = require("@project-serum/anchor");
const lodash_camelcase_1 = tslib_1.__importDefault(require("lodash.camelcase"));
/**
 * Creates parsers for accounts.
 *
 * This is intended to be called once at initialization.
 *
 * @param idl The IDL.
 */
const generateAccountParsers = (idl) => {
    var _a;
    const coder = new anchor_1.BorshAccountsCoder(idl);
    return (0, exports.generateAccountParsersFromCoder)((_a = idl.accounts) === null || _a === void 0 ? void 0 : _a.map((a) => a.name), coder);
};
exports.generateAccountParsers = generateAccountParsers;
/**
 * Creates parsers for accounts.
 *
 * This is intended to be called once at initialization.
 *
 * @param idl The IDL.
 */
const generateAccountParsersFromCoder = (accountNames, coder) => {
    return (accountNames !== null && accountNames !== void 0 ? accountNames : []).reduce((parsers, account) => {
        parsers[(0, lodash_camelcase_1.default)(account)] = (data) => coder.decode(account, data);
        return parsers;
    }, {});
};
exports.generateAccountParsersFromCoder = generateAccountParsersFromCoder;
//# sourceMappingURL=generateAccountParsers.js.map