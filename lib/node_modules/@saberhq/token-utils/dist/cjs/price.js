"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Price = void 0;
const token_math_1 = require("@ubeswap/token-math");
/**
 * A price of one token relative to another.
 */
class Price extends token_math_1.Price {
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
exports.Price = Price;
//# sourceMappingURL=price.js.map