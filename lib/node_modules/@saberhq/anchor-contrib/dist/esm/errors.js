/**
 * Generates the error mapping
 * @param idl
 * @returns
 */
export const generateErrorMap = (idl) => {
    var _a, _b;
    return ((_b = (_a = idl.errors) === null || _a === void 0 ? void 0 : _a.reduce((acc, err) => {
        return {
            ...acc,
            [err.name]: err,
        };
    }, {})) !== null && _b !== void 0 ? _b : {});
};
/**
 * Returns a RegExp which matches the message of a program error.
 * @param err
 * @returns
 */
export const matchError = (err) => matchErrorCode(err.code);
/**
 * Returns a RegExp which matches the code of a custom program error.
 * @param err
 * @returns
 */
export const matchErrorCode = (code) => new RegExp(`custom program error: 0x${code.toString(16)}`);
//# sourceMappingURL=errors.js.map