"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newProgramMap = exports.newProgram = void 0;
const tslib_1 = require("tslib");
const anchor_1 = require("@project-serum/anchor");
const lodash_mapvalues_1 = tslib_1.__importDefault(require("lodash.mapvalues"));
const provider_js_1 = require("./provider.js");
/**
 * Builds a program from its IDL.
 *
 * @param idl
 * @param address
 * @param provider
 * @returns
 */
const newProgram = (idl, address, provider) => {
    return new anchor_1.Program(idl, address.toString(), (0, provider_js_1.makeAnchorProvider)(provider));
};
exports.newProgram = newProgram;
/**
 * Builds a map of programs from their IDLs and addresses.
 *
 * @param provider
 * @param programs
 * @returns
 */
const newProgramMap = (provider, idls, addresses) => {
    return (0, lodash_mapvalues_1.default)(idls, (idl, k) => (0, exports.newProgram)(idl, addresses[k], provider));
};
exports.newProgramMap = newProgramMap;
//# sourceMappingURL=programs.js.map