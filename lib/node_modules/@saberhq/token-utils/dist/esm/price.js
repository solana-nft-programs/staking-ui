import { Price as UPrice } from "@ubeswap/token-math";
/**
 * A price of one token relative to another.
 */
export class Price extends UPrice {
    /**
     * Constructs a price.
     * @param baseCurrency
     * @param quoteCurrency
     * @param denominator
     * @param numerator
     */
    constructor(baseCurrency, quoteCurrency, denominator, numerator) {
        super(baseCurrency, quoteCurrency, denominator, numerator);
    }
    new(baseCurrency, quoteCurrency, denominator, numerator) {
        return new Price(baseCurrency, quoteCurrency, denominator, numerator);
    }
    static fromUPrice(price) {
        return new Price(price.baseCurrency, price.quoteCurrency, price.denominator, price.numerator);
    }
}
//# sourceMappingURL=price.js.map