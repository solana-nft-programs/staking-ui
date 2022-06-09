import type { Rounding } from "./constants.js";
import type { NumberFormat } from "./format.js";
import { Fraction } from "./fraction.js";
import type { Token } from "./token.js";
import type { TokenAmount } from "./tokenAmount.js";
import type { BigintIsh } from "./utils.js";
export declare abstract class Price<T extends Token<T>> extends Fraction {
    readonly baseCurrency: T;
    readonly quoteCurrency: T;
    readonly scalar: Fraction;
    /**
     * Constructs a Price.
     *
     * denominator and numerator _must_ be raw, i.e. in the native representation
     *
     * @param denominator Units of base currency. E.g. 1 BTC would be 1_00000000
     * @param numerator Units of quote currency. E.g. $30k at 6 decimals would be 30_000_000000
     */
    constructor(baseCurrency: T, quoteCurrency: T, denominator: BigintIsh, numerator: BigintIsh);
    /**
     * Create a new Price.
     * @param token
     * @param amount
     */
    abstract new(baseCurrency: T, quoteCurrency: T, denominator: BigintIsh, numerator: BigintIsh): this;
    get raw(): Fraction;
    get adjusted(): Fraction;
    invert(): this;
    multiply(other: this): this;
    quote<B extends TokenAmount<T>>(tokenAmount: B): B;
    toSignificant(significantDigits?: number, format?: NumberFormat, rounding?: Rounding): string;
    toFixed(decimalPlaces?: number, format?: NumberFormat, rounding?: Rounding): string;
    /**
     * Returns the price in terms of the quote currency.
     * @param format
     * @param rounding
     * @returns
     */
    toFixedQuote(format?: NumberFormat, rounding?: Rounding): string;
    get asNumber(): number;
}
//# sourceMappingURL=price.d.ts.map