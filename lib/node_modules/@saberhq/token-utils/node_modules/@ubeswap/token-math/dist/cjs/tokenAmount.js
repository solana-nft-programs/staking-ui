"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenAmount = exports.stripTrailingZeroes = exports.validateU256 = exports.validateU64 = exports.TokenAmountUnderflow = exports.TokenAmountOverflow = exports.parseAmountFromString = exports.DEFAULT_GROUP_SEPARATOR = exports.DEFAULT_DECIMAL_SEPARATOR = exports.DEFAULT_LOCALE_GROUP_SEPARATOR = exports.DEFAULT_LOCALE_DECIMAL_SEPARATOR = exports.getGroupSeparator = exports.getDecimalSeparator = exports.getSeparator = void 0;
const tslib_1 = require("tslib");
const big_js_1 = tslib_1.__importDefault(require("big.js"));
const jsbi_1 = tslib_1.__importDefault(require("jsbi"));
const tiny_invariant_1 = tslib_1.__importDefault(require("tiny-invariant"));
const constants_js_1 = require("./constants.js");
const format_js_1 = require("./format.js");
const fraction_js_1 = require("./fraction.js");
const percent_js_1 = require("./percent.js");
const utils_js_1 = require("./utils.js");
/**
 * Gets the separator of the provided locale.
 *
 * Source: {@link https://stackoverflow.com/questions/1074660/with-a-browser-how-do-i-know-which-decimal-separator-does-the-operating-system}
 *
 * @param separatorType
 * @param locale
 * @returns
 */
const getSeparator = (separatorType, locale) => {
    var _a;
    const numberWithDecimalSeparator = 1000.1;
    return (_a = Intl.NumberFormat(locale)
        .formatToParts(numberWithDecimalSeparator)
        .find((part) => part.type === separatorType)) === null || _a === void 0 ? void 0 : _a.value;
};
exports.getSeparator = getSeparator;
/**
 * Gets the decimal separator of the provided locale.
 *
 * Source: {@link https://stackoverflow.com/questions/1074660/with-a-browser-how-do-i-know-which-decimal-separator-does-the-operating-system}
 *
 * @param locale
 * @returns
 */
const getDecimalSeparator = (locale) => {
    return (0, exports.getSeparator)("decimal", locale);
};
exports.getDecimalSeparator = getDecimalSeparator;
/**
 * Gets the group separator of the provided locale.
 *
 * Source: {@link https://stackoverflow.com/questions/1074660/with-a-browser-how-do-i-know-which-decimal-separator-does-the-operating-system}
 *
 * @param locale
 * @returns
 */
const getGroupSeparator = (locale) => {
    return (0, exports.getSeparator)("group", locale);
};
exports.getGroupSeparator = getGroupSeparator;
/**
 * The decimal separator of the default locale.
 */
exports.DEFAULT_LOCALE_DECIMAL_SEPARATOR = (_a = (0, exports.getDecimalSeparator)()) !== null && _a !== void 0 ? _a : ".";
/**
 * The group separator of the default locale.
 */
exports.DEFAULT_LOCALE_GROUP_SEPARATOR = (_b = (0, exports.getGroupSeparator)()) !== null && _b !== void 0 ? _b : ",";
/**
 * The default decimal separator.
 */
exports.DEFAULT_DECIMAL_SEPARATOR = ".";
/**
 * The default group separator.
 */
exports.DEFAULT_GROUP_SEPARATOR = ",";
/**
 * Parses a token amount from a decimal representation.
 * @param token
 * @param uiAmount
 * @returns
 */
const parseAmountFromString = (token, uiAmount, decimalSeparator = exports.DEFAULT_DECIMAL_SEPARATOR, groupSeparator = exports.DEFAULT_GROUP_SEPARATOR) => {
    const parts = uiAmount.split(decimalSeparator);
    if (parts.length === 0) {
        throw new Error("empty number");
    }
    const [wholeRaw, fractionRaw] = parts;
    const whole = wholeRaw
        ? jsbi_1.default.BigInt(wholeRaw.split(groupSeparator).join(""))
        : constants_js_1.ZERO;
    const fraction = fractionRaw
        ? jsbi_1.default.BigInt(fractionRaw.slice(0, token.decimals) +
            Array(token.decimals).fill("0").slice(fractionRaw.length).join(""))
        : constants_js_1.ZERO;
    const combined = jsbi_1.default.add(jsbi_1.default.multiply(whole, (0, utils_js_1.makeDecimalMultiplier)(token.decimals)), fraction);
    return combined;
};
exports.parseAmountFromString = parseAmountFromString;
/**
 * Thrown when a token amount overflows.
 */
class TokenAmountOverflow extends RangeError {
    constructor(type, amount) {
        super(`Token amount overflows ${type}: ${amount.toString()}`);
    }
}
exports.TokenAmountOverflow = TokenAmountOverflow;
/**
 * Thrown when a token amount underflows.
 */
class TokenAmountUnderflow extends RangeError {
    constructor(amount) {
        super(`Token amount must be greater than zero: ${amount.toString()}`);
    }
}
exports.TokenAmountUnderflow = TokenAmountUnderflow;
/**
 * Validates that a number falls within the range of u64.
 * @param value
 */
function validateU64(value) {
    if (!jsbi_1.default.greaterThanOrEqual(value, constants_js_1.ZERO)) {
        throw new TokenAmountUnderflow(value);
    }
    if (!jsbi_1.default.lessThanOrEqual(value, constants_js_1.MAX_U64)) {
        throw new TokenAmountOverflow("u64", value);
    }
}
exports.validateU64 = validateU64;
/**
 * Validates that a number falls within the range of u256.
 * @param value
 */
function validateU256(value) {
    if (!jsbi_1.default.greaterThanOrEqual(value, constants_js_1.ZERO)) {
        throw new TokenAmountUnderflow(value);
    }
    if (!jsbi_1.default.lessThanOrEqual(value, constants_js_1.MAX_U256)) {
        throw new TokenAmountOverflow("u256", value);
    }
}
exports.validateU256 = validateU256;
const stripTrailingZeroes = (num) => {
    const [head, tail, ...rest] = num.split(".");
    if (rest.length > 0 || !head) {
        console.warn(`Invalid number passed to stripTrailingZeroes: ${num}`);
        return num;
    }
    if (!tail) {
        return num;
    }
    const newTail = tail.replace(/0+$/, "");
    return newTail === "" ? head : `${head}.${newTail}`;
};
exports.stripTrailingZeroes = stripTrailingZeroes;
/**
 * Represents a quantity of tokens.
 */
class TokenAmount extends fraction_js_1.Fraction {
    /**
     * amount _must_ be raw, i.e. in the native representation
     */
    constructor(token, amount, validate) {
        const parsedAmount = (0, utils_js_1.parseBigintIsh)(amount);
        validate === null || validate === void 0 ? void 0 : validate(parsedAmount);
        super(parsedAmount, (0, utils_js_1.makeDecimalMultiplier)(token.decimals));
        this.token = token;
        this.token = token;
    }
    withAmount(amount) {
        return this.new(this.token, amount);
    }
    get raw() {
        return this.numerator;
    }
    toSignificant(significantDigits = 6, format, rounding = constants_js_1.Rounding.ROUND_DOWN) {
        return super.toSignificant(significantDigits, format, rounding);
    }
    toFixed(decimalPlaces = this.token.decimals, format, rounding = constants_js_1.Rounding.ROUND_DOWN) {
        (0, tiny_invariant_1.default)(decimalPlaces <= this.token.decimals, "DECIMALS");
        return super.toFixed(decimalPlaces, format, rounding);
    }
    toExact(format = { groupSeparator: "" }) {
        return (0, format_js_1.formatBig)(new big_js_1.default(this.numerator.toString()).div(this.denominator.toString()), this.token.decimals, format);
    }
    add(other) {
        (0, tiny_invariant_1.default)(this.token.equals(other.token), `add token mismatch: ${this.token.toString()} !== ${other.token.toString()}`);
        return this.withAmount(jsbi_1.default.add(this.raw, other.raw));
    }
    subtract(other) {
        (0, tiny_invariant_1.default)(this.token.equals(other.token), `subtract token mismatch: ${this.token.toString()} !== ${other.token.toString()}`);
        return this.withAmount(jsbi_1.default.subtract(this.raw, other.raw));
    }
    /**
     * Gets this TokenAmount as a percentage of the other TokenAmount.
     * @param other
     * @returns
     */
    percentOf(other) {
        (0, tiny_invariant_1.default)(this.token.equals(other.token), `percentOf token mismatch: ${this.token.toString()} !== ${other.token.toString()}`);
        const frac = this.divide(other);
        return new percent_js_1.Percent(frac.numerator, frac.denominator);
    }
    /**
     * Gets this TokenAmount as a percentage of the other TokenAmount.
     * @param other
     * @returns
     */
    divideBy(other) {
        const frac = this.divide(other);
        return new percent_js_1.Percent(frac.numerator, frac.denominator);
    }
    /**
     * Multiplies this token amount by a fraction.
     * WARNING: this loses precision
     * @param percent
     * @returns
     */
    scale(fraction) {
        return this.withAmount(fraction.asFraction.multiply(this.raw).toFixed(0));
    }
    /**
     * Reduces this token amount by a percent.
     * WARNING: this loses precision
     * @param percent
     * @returns
     */
    reduceBy(percent) {
        return this.scale(percent_js_1.Percent.ONE_HUNDRED.subtract(percent));
    }
    /**
     * Formats the token amount quantity with units.
     *
     * This function is not locale-specific: it hardcodes "en-US"-like behavior.
     *
     * @returns
     */
    formatUnits() {
        return `${(0, exports.stripTrailingZeroes)(this.toExact({
            groupSeparator: exports.DEFAULT_GROUP_SEPARATOR,
            groupSize: 3,
            decimalSeparator: exports.DEFAULT_DECIMAL_SEPARATOR,
        }))} ${this.token.symbol}`;
    }
    /**
     * Formats this number using Intl.NumberFormatOptions
     * @param param0
     * @returns
     */
    format({ numberFormatOptions, locale } = {}) {
        return `${numberFormatOptions !== undefined
            ? this.asNumber.toLocaleString(locale, numberFormatOptions)
            : (0, exports.stripTrailingZeroes)(this.toFixed(this.token.decimals))}`;
    }
    /**
     * Gets the value of this {@link TokenAmount} as a number.
     */
    get asNumber() {
        return parseFloat(this.toExact());
    }
    /**
     * Returns true if the other object is a {@link TokenAmount}.
     *
     * @param other
     * @returns
     */
    static isTokenAmount(other) {
        return (fraction_js_1.Fraction.isFraction(other) &&
            !!(other === null || other === void 0 ? void 0 : other.token));
    }
    // ----------------------------------------------------------------
    // DEPRECATED FUNCTIONS
    // ----------------------------------------------------------------
    /**
     * Gets this TokenAmount as a percentage of the other TokenAmount.
     * @param other
     * @deprecated use {@link percentOf}
     * @returns
     */
    divideByAmount(other) {
        return this.percentOf(other);
    }
    /**
     * Multiplies this token amount by a fraction.
     * WARNING: this loses precision
     * @param percent
     * @deprecated use {@link scale}
     * @returns
     */
    multiplyBy(fraction) {
        return this.scale(fraction);
    }
}
exports.TokenAmount = TokenAmount;
//# sourceMappingURL=tokenAmount.js.map