"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchErrorCode = exports.matchError = exports.generateErrorMap = void 0;
/**
 * Generates the error mapping
 * @param idl
 * @returns
 */
const generateErrorMap = (idl) => {
    var _a, _b;
    return ((_b = (_a = idl.errors) === null || _a === void 0 ? void 0 : _a.reduce((acc, err) => {
        return {
            ...acc,
            [err.name]: err,
        };
    }, {})) !== null && _b !== void 0 ? _b : {});
};
exports.generateErrorMap = generateErrorMap;
/**
 * Returns a RegExp which matches the message of a program error.
 * @param err
 * @returns
 */
const matchError = (err) => (0, exports.matchErrorCode)(err.code);
exports.matchError = matchError;
/**
 * Returns a RegExp which matches the code of a custom program error.
 * @param err
 * @returns
 */
const matchErrorCode = (code) => new RegExp(`custom program error: 0x${code.toString(16)}`);
exports.matchErrorCode = matchErrorCode;
//# sourceMappingURL=errors.js.map