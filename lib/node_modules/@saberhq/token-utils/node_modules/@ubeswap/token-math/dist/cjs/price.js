"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Price = void 0;
const tslib_1 = require("tslib");
const tiny_invariant_1 = tslib_1.__importDefault(require("tiny-invariant"));
const fraction_js_1 = require("./fraction.js");
const utils_js_1 = require("./utils.js");
class Price extends fraction_js_1.Fraction {
    /**
     * Constructs a Price.
     *
     * denominator and numerator _must_ be raw, i.e. in the native representation
     *
     * @param denominator Units of base currency. E.g. 1 BTC would be 1_00000000
     * @param numerator Units of quote currency. E.g. $30k at 6 decimals would be 30_000_000000
     */
    constructor(baseCurrency, quoteCurrency, denominator, numerator) {
        super((0, utils_js_1.parseBigintIsh)(numerator), (0, utils_js_1.parseBigintIsh)(denominator));
        this.baseCurrency = baseCurrency;
        this.quoteCurrency = quoteCurrency;
        this.scalar = new fraction_js_1.Fraction((0, utils_js_1.makeDecimalMultiplier)(baseCurrency.decimals), (0, utils_js_1.makeDecimalMultiplier)(quoteCurrency.decimals));
    }
    get raw() {
        return new fraction_js_1.Fraction(this.numerator, this.denominator);
    }
    get adjusted() {
        return super.multiply(this.scalar);
    }
    invert() {
        return this.new(this.quoteCurrency, this.baseCurrency, this.numerator, this.denominator);
    }
    multiply(other) {
        (0, tiny_invariant_1.default)(this.quoteCurrency.equals(other.baseCurrency), `multiply token mismatch: ${this.quoteCurrency.toString()} !== ${other.baseCurrency.toString()}`);
        const fraction = super.multiply(other);
        return this.new(this.baseCurrency, other.quoteCurrency, fraction.denominator, fraction.numerator);
    }
    // performs floor division on overflow
    quote(tokenAmount) {
        (0, tiny_invariant_1.default)(tokenAmount.token.equals(this.baseCurrency), `quote token mismatch: ${tokenAmount.token.toString()} !== ${this.baseCurrency.toString()}`);
        return tokenAmount.new(this.quoteCurrency, super.multiply(tokenAmount.raw).quotient);
    }
    toSignificant(significantDigits = 6, format, rounding) {
        return this.adjusted.toSignificant(significantDigits, format, rounding);
    }
    toFixed(decimalPlaces = 4, format, rounding) {
        return this.adjusted.toFixed(decimalPlaces, format, rounding);
    }
    /**
     * Returns the price in terms of the quote currency.
     * @param format
     * @param rounding
     * @returns
     */
    toFixedQuote(format = { groupSeparator: "" }, rounding) {
        return this.toFixed(this.quoteCurrency.decimals, format, rounding);
    }
    get asNumber() {
        return this.adjusted.asNumber;
    }
}
exports.Price = Price;
//# sourceMappingURL=price.js.map