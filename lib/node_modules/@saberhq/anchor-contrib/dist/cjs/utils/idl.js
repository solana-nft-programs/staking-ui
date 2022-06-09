"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatIdlType = void 0;
/**
 * Formats an IDL type as a string. This comes straight from the Anchor source.
 * @param idlType
 * @returns
 */
const formatIdlType = (idlType) => {
    if (typeof idlType === "string") {
        return idlType;
    }
    if ("vec" in idlType) {
        return `Vec<${(0, exports.formatIdlType)(idlType.vec)}>`;
    }
    if ("option" in idlType) {
        return `Option<${(0, exports.formatIdlType)(idlType.option)}>`;
    }
    if ("defined" in idlType) {
        return idlType.defined;
    }
    if ("array" in idlType) {
        return `Array<${(0, exports.formatIdlType)(idlType.array[0])}; ${idlType.array[1]}>`;
    }
    throw new Error(`Unknown IDL type: ${JSON.stringify(idlType)}`);
};
exports.formatIdlType = formatIdlType;
//# sourceMappingURL=idl.js.map