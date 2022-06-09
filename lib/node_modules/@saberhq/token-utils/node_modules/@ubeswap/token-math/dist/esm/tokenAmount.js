var _a, _b;
import { default as Big } from "big.js";
import { default as JSBI } from "jsbi";
import { default as invariant } from "tiny-invariant";
import { MAX_U64, MAX_U256, Rounding, ZERO } from "./constants.js";
import { formatBig } from "./format.js";
import { Fraction } from "./fraction.js";
import { Percent } from "./percent.js";
import { makeDecimalMultiplier, parseBigintIsh } from "./utils.js";
/**
 * Gets the separator of the provided locale.
 *
 * Source: {@link https://stackoverflow.com/questions/1074660/with-a-browser-how-do-i-know-which-decimal-separator-does-the-operating-system}
 *
 * @param separatorType
 * @param locale
 * @returns
 */
export const getSeparator = (separatorType, locale) => {
    var _a;
    const numberWithDecimalSeparator = 1000.1;
    return (_a = Intl.NumberFormat(locale)
        .formatToParts(numberWithDecimalSeparator)
        .find((part) => part.type === separatorType)) === null || _a === void 0 ? void 0 : _a.value;
};
/**
 * Gets the decimal separator of the provided locale.
 *
 * Source: {@link https://stackoverflow.com/questions/1074660/with-a-browser-how-do-i-know-which-decimal-separator-does-the-operating-system}
 *
 * @param locale
 * @returns
 */
export const getDecimalSeparator = (locale) => {
    return getSeparator("decimal", locale);
};
/**
 * Gets the group separator of the provided locale.
 *
 * Source: {@link https://stackoverflow.com/questions/1074660/with-a-browser-how-do-i-know-which-decimal-separator-does-the-operating-system}
 *
 * @param locale
 * @returns
 */
export const getGroupSeparator = (locale) => {
    return getSeparator("group", locale);
};
/**
 * The decimal separator of the default locale.
 */
export const DEFAULT_LOCALE_DECIMAL_SEPARATOR = (_a = getDecimalSeparator()) !== null && _a !== void 0 ? _a : ".";
/**
 * The group separator of the default locale.
 */
export const DEFAULT_LOCALE_GROUP_SEPARATOR = (_b = getGroupSeparator()) !== null && _b !== void 0 ? _b : ",";
/**
 * The default decimal separator.
 */
export const DEFAULT_DECIMAL_SEPARATOR = ".";
/**
 * The default group separator.
 */
export const DEFAULT_GROUP_SEPARATOR = ",";
/**
 * Parses a token amount from a decimal representation.
 * @param token
 * @param uiAmount
 * @returns
 */
export const parseAmountFromString = (token, uiAmount, decimalSeparator = DEFAULT_DECIMAL_SEPARATOR, groupSeparator = DEFAULT_GROUP_SEPARATOR) => {
    const parts = uiAmount.split(decimalSeparator);
    if (parts.length === 0) {
        throw new Error("empty number");
    }
    const [wholeRaw, fractionRaw] = parts;
    const whole = wholeRaw
        ? JSBI.BigInt(wholeRaw.split(groupSeparator).join(""))
        : ZERO;
    const fraction = fractionRaw
        ? JSBI.BigInt(fractionRaw.slice(0, token.decimals) +
            Array(token.decimals).fill("0").slice(fractionRaw.length).join(""))
        : ZERO;
    const combined = JSBI.add(JSBI.multiply(whole, makeDecimalMultiplier(token.decimals)), fraction);
    return combined;
};
/**
 * Thrown when a token amount overflows.
 */
export class TokenAmountOverflow extends RangeError {
    constructor(type, amount) {
        super(`Token amount overflows ${type}: ${amount.toString()}`);
    }
}
/**
 * Thrown when a token amount underflows.
 */
export class TokenAmountUnderflow extends RangeError {
    constructor(amount) {
        super(`Token amount must be greater than zero: ${amount.toString()}`);
    }
}
/**
 * Validates that a number falls within the range of u64.
 * @param value
 */
export function validateU64(value) {
    if (!JSBI.greaterThanOrEqual(value, ZERO)) {
        throw new TokenAmountUnderflow(value);
    }
    if (!JSBI.lessThanOrEqual(value, MAX_U64)) {
        throw new TokenAmountOverflow("u64", value);
    }
}
/**
 * Validates that a number falls within the range of u256.
 * @param value
 */
export function validateU256(value) {
    if (!JSBI.greaterThanOrEqual(value, ZERO)) {
        throw new TokenAmountUnderflow(value);
    }
    if (!JSBI.lessThanOrEqual(value, MAX_U256)) {
        throw new TokenAmountOverflow("u256", value);
    }
}
export const stripTrailingZeroes = (num) => {
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
/**
 * Represents a quantity of tokens.
 */
export class TokenAmount extends Fraction {
    /**
     * amount _must_ be raw, i.e. in the native representation
     */
    constructor(token, amount, validate) {
        const parsedAmount = parseBigintIsh(amount);
        validate === null || validate === void 0 ? void 0 : validate(parsedAmount);
        super(parsedAmount, makeDecimalMultiplier(token.decimals));
        this.token = token;
        this.token = token;
    }
    withAmount(amount) {
        return this.new(this.token, amount);
    }
    get raw() {
        return this.numerator;
    }
    toSignificant(significantDigits = 6, format, rounding = Rounding.ROUND_DOWN) {
        return super.toSignificant(significantDigits, format, rounding);
    }
    toFixed(decimalPlaces = this.token.decimals, format, rounding = Rounding.ROUND_DOWN) {
        invariant(decimalPlaces <= this.token.decimals, "DECIMALS");
        return super.toFixed(decimalPlaces, format, rounding);
    }
    toExact(format = { groupSeparator: "" }) {
        return formatBig(new Big(this.numerator.toString()).div(this.denominator.toString()), this.token.decimals, format);
    }
    add(other) {
        invariant(this.token.equals(other.token), `add token mismatch: ${this.token.toString()} !== ${other.token.toString()}`);
        return this.withAmount(JSBI.add(this.raw, other.raw));
    }
    subtract(other) {
        invariant(this.token.equals(other.token), `subtract token mismatch: ${this.token.toString()} !== ${other.token.toString()}`);
        return this.withAmount(JSBI.subtract(this.raw, other.raw));
    }
    /**
     * Gets this TokenAmount as a percentage of the other TokenAmount.
     * @param other
     * @returns
     */
    percentOf(other) {
        invariant(this.token.equals(other.token), `percentOf token mismatch: ${this.token.toString()} !== ${other.token.toString()}`);
        const frac = this.divide(other);
        return new Percent(frac.numerator, frac.denominator);
    }
    /**
     * Gets this TokenAmount as a percentage of the other TokenAmount.
     * @param other
     * @returns
     */
    divideBy(other) {
        const frac = this.divide(other);
        return new Percent(frac.numerator, frac.denominator);
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
        return this.scale(Percent.ONE_HUNDRED.subtract(percent));
    }
    /**
     * Formats the token amount quantity with units.
     *
     * This function is not locale-specific: it hardcodes "en-US"-like behavior.
     *
     * @returns
     */
    formatUnits() {
        return `${stripTrailingZeroes(this.toExact({
            groupSeparator: DEFAULT_GROUP_SEPARATOR,
            groupSize: 3,
            decimalSeparator: DEFAULT_DECIMAL_SEPARATOR,
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
            : stripTrailingZeroes(this.toFixed(this.token.decimals))}`;
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
        return (Fraction.isFraction(other) &&
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
//# sourceMappingURL=tokenAmount.js.map