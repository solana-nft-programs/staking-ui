import { Fraction } from "./fraction.js";
const ONE_HUNDRED = new Fraction(100);
/**
 * Converts a fraction to a percent
 * @param fraction the fraction to convert
 */
function toPercent(fraction) {
    return new Percent(fraction.numerator, fraction.denominator);
}
export class Percent extends Fraction {
    constructor() {
        super(...arguments);
        /**
         * This boolean prevents a fraction from being interpreted as a Percent
         */
        this.isPercent = true;
    }
    /**
     * Parses a {@link Percent} from a float.
     * @param number Number to parse. (100% is 1.00)
     * @param decimals Number of decimals of precision. (default 10)
     * @returns Percent
     */
    static fromNumber(number, decimals = 10) {
        const frac = Fraction.fromNumber(number, decimals);
        return new Percent(frac.numerator, frac.denominator);
    }
    /**
     * Constructs an {@link Percent} from a {@link PercentObject}.
     * @param other
     * @returns
     */
    static fromObject(other) {
        if (other instanceof Percent) {
            return other;
        }
        return toPercent(Fraction.fromObject(other));
    }
    /**
     * JSON representation of the {@link Percent}.
     */
    toJSON() {
        return {
            ...super.toJSON(),
            isPercent: true,
        };
    }
    /**
     * Creates a {@link Percent} from a {@link Fraction}.
     */
    static fromFraction(fraction) {
        return toPercent(fraction);
    }
    /**
     * Parses a {@link Percent} from a given number of bps.
     * @returns Percent
     */
    static fromBPS(bps) {
        return new Percent(bps, 10000);
    }
    add(other) {
        return toPercent(super.add(other));
    }
    subtract(other) {
        return toPercent(super.subtract(other));
    }
    multiply(other) {
        return toPercent(super.multiply(other));
    }
    divide(other) {
        return toPercent(super.divide(other));
    }
    /**
     * Swaps the numerator and denominator of the {@link Percent}.
     * @returns
     */
    invert() {
        return new Percent(this.denominator, this.numerator);
    }
    toSignificant(significantDigits = 5, format, rounding) {
        return super
            .multiply(ONE_HUNDRED)
            .toSignificant(significantDigits, format, rounding);
    }
    toFixed(decimalPlaces = 2, format, rounding) {
        return super.multiply(ONE_HUNDRED).toFixed(decimalPlaces, format, rounding);
    }
    /**
     * Returns true if the other object is a {@link Percent}.
     *
     * @param other
     * @returns
     */
    static isPercent(other) {
        return (Fraction.isFraction(other) &&
            (other === null || other === void 0 ? void 0 : other.isPercent) === true);
    }
}
/**
 * Zero percent.
 */
Percent.ZERO = new Percent(0);
/**
 * 1%
 */
Percent.ONE = new Percent(1, 100);
/**
 * 100% (1/1)
 */
Percent.ONE_HUNDRED = new Percent(1);
//# sourceMappingURL=percent.js.map