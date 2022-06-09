import { u64 } from "@solana/spl-token";
import { parseAmountFromString, parseBigintIsh, TokenAmount as UTokenAmount, validateU64, } from "@ubeswap/token-math";
import BN from "bn.js";
export class TokenAmount extends UTokenAmount {
    // amount _must_ be raw, i.e. in the native representation
    constructor(token, amount) {
        super(token, amount, validateU64);
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
        const prev = parseAmountFromString(token, uiAmount, ".", ",");
        return new TokenAmount(token, prev);
    }
    /**
     * Divides this TokenAmount by a raw integer.
     * @param other
     * @returns
     */
    divideByInteger(other) {
        return new TokenAmount(this.token, this.toU64().div(new BN(parseBigintIsh(other).toString())));
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
        return new u64(this.raw.toString());
    }
}
//# sourceMappingURL=tokenAmount.js.map