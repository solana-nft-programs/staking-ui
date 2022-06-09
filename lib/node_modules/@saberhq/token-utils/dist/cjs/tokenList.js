"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dedupeTokens = exports.makeTokenMap = exports.ORIGIN_CHAINS = void 0;
const token_js_1 = require("./token.js");
/**
 * Known origin chains.
 */
exports.ORIGIN_CHAINS = [
    "bitcoin",
    "ethereum",
    "terra",
    "avalanche",
    "binance",
    "celo",
    "polygon",
    "fantom",
    "polygon",
    "heco",
];
/**
 * Creates a token map from a TokenList.
 * @param tokens
 * @returns
 */
const makeTokenMap = (tokenList) => {
    const ret = {};
    tokenList.tokens.forEach((item) => {
        ret[item.address] = new token_js_1.Token(item);
    });
    return ret;
};
exports.makeTokenMap = makeTokenMap;
/**
 * Dedupes a list of tokens, picking the first instance of the token in a list.
 * @param tokens
 * @returns
 */
const dedupeTokens = (tokens) => {
    const seen = new Set();
    return tokens.filter((token) => {
        const tokenID = `${token.address}_${token.chainId}`;
        if (seen.has(tokenID)) {
            return false;
        }
        else {
            seen.add(tokenID);
            return true;
        }
    });
};
exports.dedupeTokens = dedupeTokens;
//# sourceMappingURL=tokenList.js.map