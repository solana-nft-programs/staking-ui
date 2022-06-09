import { default as JSBI } from "jsbi";
import { Rounding } from "./constants.js";
import type { NumberFormat } from "./format.js";
import type { BigintIsh } from "./utils.js";
/**
 * Interface representing a Fraction.
 */
export interface FractionObject {
    /**
     * This boolean checks to see if this is actually a {@link Fraction}.
     */
    readonly isFraction: true;
    /**
     * Fraction numerator.
     */
    readonly numeratorStr: string;
    /**
     * Fraction denominator.
     */
    readonly denominatorStr: string;
}
/**
 * Creates a {@link Fraction} from a {@link FractionObject}.
 * @param param0
 * @returns
 */
export declare const fractionFromObject: ({ numeratorStr, denominatorStr, }: FractionObject) => Fraction;
/**
 * Number with an integer numerator and denominator.
 */
export declare class Fraction implements FractionObject {
    readonly isFraction: true;
    get numeratorStr(): string;
    get denominatorStr(): string;
    readonly numerator: JSBI;
    readonly denominator: JSBI;
    static readonly ZERO: Fraction;
    static readonly ONE: Fraction;
    constructor(numerator: BigintIsh, denominator?: BigintIsh);
    /**
     * Ensures the other object is of this {@link Fraction} type.
     * @param other
     * @returns
     */
    static fromObject(other: FractionObject): Fraction;
    /**
     * JSON representation of the {@link Fraction}.
     */
    toJSON(): FractionObject;
    /**
     * Returns true if the other object is a {@link Fraction}.
     *
     * @param other
     * @returns
     */
    static isFraction(other: unknown): other is Fraction;
    /**
     * Compares this {@link Fraction} to the other {@link Fraction}.
     */
    compareTo(other: Fraction): -1 | 0 | 1;
    /**
     * Parses a {@link Fraction} from a float.
     * @param number Number to parse.
     * @param decimals Number of decimals of precision. (default 10)
     * @returns Fraction
     */
    static fromNumber(number: number, decimals?: number): Fraction;
    /**
     * Performs floor division.
     */
    get quotient(): JSBI;
    /**
     * Remainder after floor division.
     */
    get remainder(): Fraction;
    /**
     * Swaps the numerator and denominator of the {@link Fraction}.
     * @returns
     */
    invert(): Fraction;
    add(other: Fraction | BigintIsh): Fraction;
    subtract(other: Fraction | BigintIsh): Fraction;
    lessThan(other: Fraction | BigintIsh): boolean;
    equalTo(other: Fraction | BigintIsh): boolean;
    greaterThan(other: Fraction | BigintIsh): boolean;
    multiply(other: Fraction | BigintIsh): Fraction;
    /**
     * Divides this {@link Fraction} by another {@link Fraction}.
     */
    divide(other: Fraction | BigintIsh): Fraction;
    /**
     * Converts this {@link Fraction} to a string with the specified significant digits.
     * @param significantDigits
     * @param format
     * @param rounding
     * @returns
     */
    toSignificant(significantDigits: number, format?: NumberFormat, rounding?: Rounding): string;
    toFixed(decimalPlaces: number, format?: NumberFormat, rounding?: Rounding): string;
    /**
     * Helper method for converting any super class back to a fraction
     */
    get asFraction(): Fraction;
    /**
     * Gets the value of this {@link Fraction} as a number.
     */
    get asNumber(): number;
    /**
     * Returns true if this number (the numerator) is equal to zero and the denominator is non-zero.
     * @returns
     */
    isZero(): boolean;
    /**
     * Returns true if this number (the numerator) is not equal to zero.
     * @returns
     */
    isNonZero(): boolean;
}
//# sourceMappingURL=fraction.d.ts.map