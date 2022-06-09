"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_U256 = exports.MAX_U64 = exports.Rounding = exports.TEN = exports.ONE = exports.ZERO = void 0;
const tslib_1 = require("tslib");
const jsbi_1 = tslib_1.__importDefault(require("jsbi"));
/**
 * Zero bigint.
 */
exports.ZERO = jsbi_1.default.BigInt(0);
/**
 * One bigint.
 */
exports.ONE = jsbi_1.default.BigInt(1);
/**
 * 10 bigint.
 */
exports.TEN = jsbi_1.default.BigInt(10);
var Rounding;
(function (Rounding) {
    Rounding[Rounding["ROUND_DOWN"] = 0] = "ROUND_DOWN";
    Rounding[Rounding["ROUND_HALF_UP"] = 1] = "ROUND_HALF_UP";
    Rounding[Rounding["ROUND_UP"] = 2] = "ROUND_UP";
})(Rounding = exports.Rounding || (exports.Rounding = {}));
exports.MAX_U64 = jsbi_1.default.BigInt("0xffffffffffffffff");
exports.MAX_U256 = jsbi_1.default.BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
//# sourceMappingURL=constants.js.map