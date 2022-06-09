import type { BigintIsh } from "@ubeswap/token-math";
import { Price as UPrice } from "@ubeswap/token-math";
import type { Token } from "./token.js";
/**
 * A price of one token relative to another.
 */
export declare class Price extends UPrice<Token> {
    /**
     * Constructs a price.
     * @param baseCurrency
     * @param quoteCurrency
     * @param denominator
     * @param numerator
     */
    constructor(baseCurrency: Token, quoteCurrency: Token, denominator: BigintIsh, numerator: BigintIsh);
    new(baseCurrency: Token, quoteCurrency: Token, denominator: BigintIsh, numerator: BigintIsh): this;
    static fromUPrice(price: UPrice<Token>): Price;
}
//# sourceMappingURL=price.d.ts.map