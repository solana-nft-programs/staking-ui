import { u64 } from "@solana/spl-token";
import type { BigintIsh, FractionObject } from "@ubeswap/token-math";
import { TokenAmount as UTokenAmount } from "@ubeswap/token-math";
import type { Token } from "./token.js";
export type { IFormatUint } from "@ubeswap/token-math";
export interface TokenAmountObject extends FractionObject {
    /**
     * Discriminator to show this is a token amount.
     */
    _isTA: true;
    /**
     * Mint of the token.
     */
    mint: string;
    /**
     * Amount of tokens in string representation.
     */
    uiAmount: string;
}
export declare class TokenAmount extends UTokenAmount<Token> {
    constructor(token: Token, amount: BigintIsh);
    new(token: Token, amount: BigintIsh): this;
    /**
     * Parses a token amount from a decimal representation.
     * @param token
     * @param uiAmount
     * @returns
     */
    static parse(token: Token, uiAmount: string): TokenAmount;
    /**
     * Divides this TokenAmount by a raw integer.
     * @param other
     * @returns
     */
    divideByInteger(other: BigintIsh): TokenAmount;
    /**
     * String representation of this token amount.
     */
    toString(): string;
    /**
     * JSON representation of the token amount.
     */
    toJSON(): TokenAmountObject;
    /**
     * Converts this to the raw u64 used by the SPL library
     * @returns
     */
    toU64(): u64;
}
//# sourceMappingURL=tokenAmount.d.ts.map