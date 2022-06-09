import type { Rounding } from "./constants.js";
import type { NumberFormat } from "./format.js";
import type { FractionObject } from "./fraction.js";
import { Fraction } from "./fraction.js";
import type { BigintIsh } from "./utils.js";
/**
 * Serializable representation of a {@link Percent}.
 */
export interface PercentObject extends FractionObject {
    readonly isPercent: true;
}
export declare class Percent extends Fraction implements PercentObject {
    /**
     * This boolean prevents a fraction from being interpreted as a Percent
     */
    readonly isPercent: true;
    /**
     * Zero percent.
     */
    static readonly ZERO: Percent;
    /**
     * 1%
     */
    static readonly ONE: Percent;
    /**
     * 100% (1/1)
     */
    static readonly ONE_HUNDRED: Percent;
    /**
     * Parses a {@link Percent} from a float.
     * @param number Number to parse. (100% is 1.00)
     * @param decimals Number of decimals of precision. (default 10)
     * @returns Percent
     */
    static fromNumber(number: number, decimals?: number): Percent;
    /**
     * Constructs an {@link Percent} from a {@link PercentObject}.
     * @param other
     * @returns
     */
    static fromObject(other: PercentObject): Percent;
    /**
     * JSON representation of the {@link Percent}.
     */
    toJSON(): PercentObject;
    /**
     * Creates a {@link Percent} from a {@link Fraction}.
     */
    static fromFraction(fraction: Fraction): Percent;
    /**
     * Parses a {@link Percent} from a given number of bps.
     * @returns Percent
     */
    static fromBPS(bps: BigintIsh): Percent;
    add(other: Fraction | BigintIsh): Percent;
    subtract(other: Fraction | BigintIsh): Percent;
    multiply(other: Fraction | BigintIsh): Percent;
    divide(other: Fraction | BigintIsh): Percent;
    /**
     * Swaps the numerator and denominator of the {@link Percent}.
     * @returns
     */
    invert(): Percent;
    toSignificant(significantDigits?: number, format?: NumberFormat, rounding?: Rounding): string;
    toFixed(decimalPlaces?: number, format?: NumberFormat, rounding?: Rounding): string;
    /**
     * Returns true if the other object is a {@link Percent}.
     *
     * @param other
     * @returns
     */
    static isPercent(other: unknown): other is Percent;
}
//# sourceMappingURL=percent.d.ts.map