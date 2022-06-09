"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenAmount = void 0;
const tslib_1 = require("tslib");
const spl_token_1 = require("@solana/spl-token");
const token_math_1 = require("@ubeswap/token-math");
const bn_js_1 = tslib_1.__importDefault(require("bn.js"));
class TokenAmount extends token_math_1.TokenAmount {
    // amount _must_ be raw, i.e. in the native representation
    constructor(token, amount) {
        super(token, amount, token_math_1.validateU64);
    }
    new(token, amount) {
        // unsafe but nobody will be extending this anyway probably
        return new TokenAmount(token, amount);
    }
    /**
     * Parses a token amount from a decimal representation.
     * @param token
     * @param uiAmount
     * @returns
     */
    static parse(token, uiAmount) {
        const prev = (0, token_math_1.parseAmountFromString)(token, uiAmount, ".", ",");
        return new TokenAmount(token, prev);
    }
    /**
     * Divides this TokenAmount by a raw integer.
     * @param other
     * @returns
     */
    divideByInteger(other) {
        return new TokenAmount(this.token, this.toU64().div(new bn_js_1.default((0, token_math_1.parseBigintIsh)(other).toString())));
    }
    /**
     * String representation of this token amount.
     */
    toString() {
        return `TokenAmount[Token=(${this.token.toString()}), amount=${this.toExact()}`;
    }
    /**
     * JSON representation of the token amount.
     */
    toJSON() {
        return {
            ...super.toJSON(),
            _isTA: true,
            mint: this.token.address,
            uiAmount: this.toExact(),
        };
    }
    /**
     * Converts this to the raw u64 used by the SPL library
     * @returns
     */
    toU64() {
        return new spl_token_1.u64(this.raw.toString());
    }
}
exports.TokenAmount = TokenAmount;
//# sourceMappingURL=tokenAmount.js.map