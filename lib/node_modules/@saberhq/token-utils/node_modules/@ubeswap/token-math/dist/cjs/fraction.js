"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fraction = exports.fractionFromObject = void 0;
const tslib_1 = require("tslib");
const big_js_1 = tslib_1.__importDefault(require("big.js"));
const decimal_js_light_1 = tslib_1.__importDefault(require("decimal.js-light"));
const jsbi_1 = tslib_1.__importDefault(require("jsbi"));
const tiny_invariant_1 = tslib_1.__importDefault(require("tiny-invariant"));
const constants_js_1 = require("./constants.js");
const format_js_1 = require("./format.js");
const utils_js_1 = require("./utils.js");
/**
 * Attempts to parse a {@link Fraction}.
 * @param fractionish Fraction or BigintIsh.
 * @returns
 */
const tryParseFraction = (fractionish) => {
    if (Fraction.isFraction(fractionish)) {
        return fractionish;
    }
    try {
        return new Fraction((0, utils_js_1.parseBigintIsh)(fractionish));
    }
    catch (e) {
        if (e instanceof Error) {
            throw new Error(`Could not parse fraction: ${e.message}`);
        }
        throw new Error(`Could not parse fraction`);
    }
};
/**
 * Creates a {@link Fraction} from a {@link FractionObject}.
 * @param param0
 * @returns
 */
const fractionFromObject = ({ numeratorStr, denominatorStr, }) => {
    return new Fraction(numeratorStr, denominatorStr);
};
exports.fractionFromObject = fractionFromObject;
/**
 * Number with an integer numerator and denominator.
 */
class Fraction {
    constructor(numerator, denominator = constants_js_1.ONE) {
        this.isFraction = true;
        this.numerator = (0, utils_js_1.parseBigintIsh)(numerator);
        this.denominator = (0, utils_js_1.parseBigintIsh)(denominator);
    }
    get numeratorStr() {
        return this.numerator.toString();
    }
    get denominatorStr() {
        return this.numerator.toString();
    }
    /**
     * Ensures the other object is of this {@link Fraction} type.
     * @param other
     * @returns
     */
    static fromObject(other) {
        if (other instanceof Fraction) {
            return other;
        }
        return (0, exports.fractionFromObject)(other);
    }
    /**
     * JSON representation of the {@link Fraction}.
     */
    toJSON() {
        return {
            isFraction: true,
            numeratorStr: this.numerator.toString(),
            denominatorStr: this.denominator.toString(),
        };
    }
    /**
     * Returns true if the other object is a {@link Fraction}.
     *
     * @param other
     * @returns
     */
    static isFraction(other) {
        return (typeof other === "object" &&
            other !== null &&
            "numerator" in other &&
            "denominator" in other);
    }
    /**
     * Compares this {@link Fraction} to the other {@link Fraction}.
     */
    compareTo(other) {
        if (this.equalTo(other)) {
            return 0;
        }
        return this.greaterThan(other) ? 1 : -1;
    }
    /**
     * Parses a {@link Fraction} from a float.
     * @param number Number to parse.
     * @param decimals Number of decimals of precision. (default 10)
     * @returns Fraction
     */
    static fromNumber(number, decimals = 10) {
        const multiplier = Math.pow(10, decimals);
        return new Fraction(Math.floor(number * multiplier), multiplier);
    }
    /**
     * Performs floor division.
     */
    get quotient() {
        return jsbi_1.default.divide(this.numerator, this.denominator);
    }
    /**
     * Remainder after floor division.
     */
    get remainder() {
        return new Fraction(jsbi_1.default.remainder(this.numerator, this.denominator), this.denominator);
    }
    /**
     * Swaps the numerator and denominator of the {@link Fraction}.
     * @returns
     */
    invert() {
        return new Fraction(this.denominator, this.numerator);
    }
    add(other) {
        const otherParsed = tryParseFraction(other);
        if (jsbi_1.default.equal(this.denominator, otherParsed.denominator)) {
            return new Fraction(jsbi_1.default.add(this.numerator, otherParsed.numerator), this.denominator);
        }
        return new Fraction(jsbi_1.default.add(jsbi_1.default.multiply(this.numerator, otherParsed.denominator), jsbi_1.default.multiply(otherParsed.numerator, this.denominator)), jsbi_1.default.multiply(this.denominator, otherParsed.denominator));
    }
    subtract(other) {
        const otherParsed = tryParseFraction(other);
        if (jsbi_1.default.equal(this.denominator, otherParsed.denominator)) {
            return new Fraction(jsbi_1.default.subtract(this.numerator, otherParsed.numerator), this.denominator);
        }
        return new Fraction(jsbi_1.default.subtract(jsbi_1.default.multiply(this.numerator, otherParsed.denominator), jsbi_1.default.multiply(otherParsed.numerator, this.denominator)), jsbi_1.default.multiply(this.denominator, otherParsed.denominator));
    }
    lessThan(other) {
        const otherParsed = tryParseFraction(other);
        return jsbi_1.default.lessThan(jsbi_1.default.multiply(this.numerator, otherParsed.denominator), jsbi_1.default.multiply(otherParsed.numerator, this.denominator));
    }
    equalTo(other) {
        const otherParsed = tryParseFraction(other);
        return jsbi_1.default.equal(jsbi_1.default.multiply(this.numerator, otherParsed.denominator), jsbi_1.default.multiply(otherParsed.numerator, this.denominator));
    }
    greaterThan(other) {
        const otherParsed = tryParseFraction(other);
        return jsbi_1.default.greaterThan(jsbi_1.default.multiply(this.numerator, otherParsed.denominator), jsbi_1.default.multiply(otherParsed.numerator, this.denominator));
    }
    multiply(other) {
        const otherParsed = tryParseFraction(other);
        return new Fraction(jsbi_1.default.multiply(this.numerator, otherParsed.numerator), jsbi_1.default.multiply(this.denominator, otherParsed.denominator));
    }
    /**
     * Divides this {@link Fraction} by another {@link Fraction}.
     */
    divide(other) {
        const otherParsed = tryParseFraction(other);
        return new Fraction(jsbi_1.default.multiply(this.numerator, otherParsed.denominator), jsbi_1.default.multiply(this.denominator, otherParsed.numerator));
    }
    /**
     * Converts this {@link Fraction} to a string with the specified significant digits.
     * @param significantDigits
     * @param format
     * @param rounding
     * @returns
     */
    toSignificant(significantDigits, format = { groupSeparator: "" }, rounding = constants_js_1.Rounding.ROUND_HALF_UP) {
        (0, tiny_invariant_1.default)(Number.isInteger(significantDigits), `${significantDigits} is not an integer.`);
        (0, tiny_invariant_1.default)(significantDigits > 0, `${significantDigits} is not positive.`);
        decimal_js_light_1.default.set({
            precision: significantDigits + 1,
            rounding: format_js_1.toSignificantRounding[rounding],
        });
        const quotient = new decimal_js_light_1.default(this.numerator.toString())
            .div(this.denominator.toString())
            .toSignificantDigits(significantDigits);
        return (0, format_js_1.formatDecimal)(quotient, quotient.decimalPlaces(), {
            ...format,
            rounding,
        });
    }
    toFixed(decimalPlaces, format = { groupSeparator: "" }, rounding = constants_js_1.Rounding.ROUND_HALF_UP) {
        (0, tiny_invariant_1.default)(Number.isInteger(decimalPlaces), `${decimalPlaces} is not an integer.`);
        (0, tiny_invariant_1.default)(decimalPlaces >= 0, `${decimalPlaces} is negative.`);
        return (0, format_js_1.formatBig)(new big_js_1.default(this.numerator.toString()).div(this.denominator.toString()), decimalPlaces, { ...format, rounding });
    }
    /**
     * Helper method for converting any super class back to a fraction
     */
    get asFraction() {
        return new Fraction(this.numerator, this.denominator);
    }
    /**
     * Gets the value of this {@link Fraction} as a number.
     */
    get asNumber() {
        if (jsbi_1.default.equal(this.denominator, constants_js_1.ZERO)) {
            return jsbi_1.default.greaterThan(this.numerator, constants_js_1.ZERO)
                ? Number.POSITIVE_INFINITY
                : jsbi_1.default.lessThan(this.numerator, constants_js_1.ZERO)
                    ? Number.NEGATIVE_INFINITY
                    : Number.NaN;
        }
        const result = jsbi_1.default.toNumber(this.numerator) / jsbi_1.default.toNumber(this.denominator);
        if (!Number.isNaN(result)) {
            return result;
        }
        return parseFloat(this.toFixed(10));
    }
    /**
     * Returns true if this number (the numerator) is equal to zero and the denominator is non-zero.
     * @returns
     */
    isZero() {
        return jsbi_1.default.EQ(this.numerator, constants_js_1.ZERO) && jsbi_1.default.NE(this.denominator, constants_js_1.ZERO);
    }
    /**
     * Returns true if this number (the numerator) is not equal to zero.
     * @returns
     */
    isNonZero() {
        return !this.isZero();
    }
}
exports.Fraction = Fraction;
Fraction.ZERO = new Fraction(0);
Fraction.ONE = new Fraction(1);
//# sourceMappingURL=fraction.js.map