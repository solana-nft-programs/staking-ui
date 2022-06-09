import { default as JSBI } from "jsbi";
import { Rounding } from "./constants.js";
import type { NumberFormat } from "./format.js";
import { Fraction } from "./fraction.js";
import { Percent } from "./percent.js";
import type { Token } from "./token.js";
import type { BigintIsh } from "./utils.js";
/**
 * Gets the separator of the provided locale.
 *
 * Source: {@link https://stackoverflow.com/questions/1074660/with-a-browser-how-do-i-know-which-decimal-separator-does-the-operating-system}
 *
 * @param separatorType
 * @param locale
 * @returns
 */
export declare const getSeparator: (separatorType: "decimal" | "group", locale?: string) => string | undefined;
/**
 * Gets the decimal separator of the provided locale.
 *
 * Source: {@link https://stackoverflow.com/questions/1074660/with-a-browser-how-do-i-know-which-decimal-separator-does-the-operating-system}
 *
 * @param locale
 * @returns
 */
export declare const getDecimalSeparator: (locale?: string) => string | undefined;
/**
 * Gets the group separator of the provided locale.
 *
 * Source: {@link https://stackoverflow.com/questions/1074660/with-a-browser-how-do-i-know-which-decimal-separator-does-the-operating-system}
 *
 * @param locale
 * @returns
 */
export declare const getGroupSeparator: (locale?: string) => string | undefined;
/**
 * The decimal separator of the default locale.
 */
export declare const DEFAULT_LOCALE_DECIMAL_SEPARATOR: string;
/**
 * The group separator of the default locale.
 */
export declare const DEFAULT_LOCALE_GROUP_SEPARATOR: string;
/**
 * The default decimal separator.
 */
export declare const DEFAULT_DECIMAL_SEPARATOR = ".";
/**
 * The default group separator.
 */
export declare const DEFAULT_GROUP_SEPARATOR = ",";
/**
 * Parses a token amount from a decimal representation.
 * @param token
 * @param uiAmount
 * @returns
 */
export declare const parseAmountFromString: <Tk extends Token<Tk>>(token: Tk, uiAmount: string, decimalSeparator?: string, groupSeparator?: string) => JSBI;
/**
 * Thrown when a token amount overflows.
 */
export declare class TokenAmountOverflow extends RangeError {
    constructor(type: string, amount: JSBI);
}
/**
 * Thrown when a token amount underflows.
 */
export declare class TokenAmountUnderflow extends RangeError {
    constructor(amount: JSBI);
}
/**
 * Validates that a number falls within the range of u64.
 * @param value
 */
export declare function validateU64(value: JSBI): void;
/**
 * Validates that a number falls within the range of u256.
 * @param value
 */
export declare function validateU256(value: JSBI): void;
/**
 * Uint formatting options.
 */
export interface IFormatUint {
    /**
     * If specified, format this according to `toLocaleString`
     */
    numberFormatOptions?: Intl.NumberFormatOptions;
    /**
     * Locale of the number
     */
    locale?: string;
}
export declare const stripTrailingZeroes: (num: string) => string;
/**
 * Represents a quantity of tokens.
 */
export declare abstract class TokenAmount<T extends Token<T>> extends Fraction {
    readonly token: T;
    /**
     * amount _must_ be raw, i.e. in the native representation
     */
    constructor(token: T, amount: BigintIsh, validate?: (value: JSBI) => void);
    /**
     * Create a new TokenAmount.
     * @param token
     * @param amount
     */
    abstract new(token: T, amount: BigintIsh): this;
    withAmount(amount: BigintIsh): this;
    get raw(): JSBI;
    toSignificant(significantDigits?: number, format?: NumberFormat, rounding?: Rounding): string;
    toFixed(decimalPlaces?: number, format?: NumberFormat, rounding?: Rounding): string;
    toExact(format?: NumberFormat): string;
    add(other: this): this;
    subtract(other: this): this;
    /**
     * Gets this TokenAmount as a percentage of the other TokenAmount.
     * @param other
     * @returns
     */
    percentOf(other: this): Percent;
    /**
     * Gets this TokenAmount as a percentage of the other TokenAmount.
     * @param other
     * @returns
     */
    divideBy(other: Fraction): Percent;
    /**
     * Multiplies this token amount by a fraction.
     * WARNING: this loses precision
     * @param percent
     * @returns
     */
    scale(fraction: Fraction): this;
    /**
     * Reduces this token amount by a percent.
     * WARNING: this loses precision
     * @param percent
     * @returns
     */
    reduceBy(percent: Percent): this;
    /**
     * Formats the token amount quantity with units.
     *
     * This function is not locale-specific: it hardcodes "en-US"-like behavior.
     *
     * @returns
     */
    formatUnits(): string;
    /**
     * Formats this number using Intl.NumberFormatOptions
     * @param param0
     * @returns
     */
    format({ numberFormatOptions, locale }?: IFormatUint): string;
    /**
     * Gets the value of this {@link TokenAmount} as a number.
     */
    get asNumber(): number;
    /**
     * Returns true if the other object is a {@link TokenAmount}.
     *
     * @param other
     * @returns
     */
    static isTokenAmount<T extends Token<T>, A extends TokenAmount<T>>(other: unknown): other is A;
    /**
     * Gets this TokenAmount as a percentage of the other TokenAmount.
     * @param other
     * @deprecated use {@link percentOf}
     * @returns
     */
    divideByAmount(other: this): Percent;
    /**
     * Multiplies this token amount by a fraction.
     * WARNING: this loses precision
     * @param percent
     * @deprecated use {@link scale}
     * @returns
     */
    multiplyBy(fraction: Fraction): this;
}
//# sourceMappingURL=tokenAmount.d.ts.map