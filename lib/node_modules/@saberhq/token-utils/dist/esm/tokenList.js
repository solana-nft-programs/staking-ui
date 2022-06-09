import { Token } from "./token.js";
/**
 * Known origin chains.
 */
export const ORIGIN_CHAINS = [
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
export const makeTokenMap = (tokenList) => {
    const ret = {};
    tokenList.tokens.forEach((item) => {
        ret[item.address] = new Token(item);
    });
    return ret;
};
/**
 * Dedupes a list of tokens, picking the first instance of the token in a list.
 * @param tokens
 * @returns
 */
export const dedupeTokens = (tokens) => {
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
//# sourceMappingURL=tokenList.js.map