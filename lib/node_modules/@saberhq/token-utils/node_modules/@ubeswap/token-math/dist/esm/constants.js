import { default as JSBI } from "jsbi";
/**
 * Zero bigint.
 */
export const ZERO = JSBI.BigInt(0);
/**
 * One bigint.
 */
export const ONE = JSBI.BigInt(1);
/**
 * 10 bigint.
 */
export const TEN = JSBI.BigInt(10);
export var Rounding;
(function (Rounding) {
    Rounding[Rounding["ROUND_DOWN"] = 0] = "ROUND_DOWN";
    Rounding[Rounding["ROUND_HALF_UP"] = 1] = "ROUND_HALF_UP";
    Rounding[Rounding["ROUND_UP"] = 2] = "ROUND_UP";
})(Rounding || (Rounding = {}));
export const MAX_U64 = JSBI.BigInt("0xffffffffffffffff");
export const MAX_U256 = JSBI.BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
//# sourceMappingURL=constants.js.map