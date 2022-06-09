"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WRAPPED_SOL = exports.RAW_SOL = exports.chainIdToNetwork = exports.networkToChainId = exports.CHAIN_ID_TO_NETWORK = exports.NETWORK_TO_CHAIN_ID = exports.ChainId = exports.makeTokenForAllNetworks = exports.tokensEqual = exports.Token = exports.RAW_SOL_MINT = void 0;
const solana_contrib_1 = require("@saberhq/solana-contrib");
const spl_token_1 = require("@solana/spl-token");
const layout_js_1 = require("./layout.js");
/**
 * Magic value representing the raw, underlying Solana native asset.
 */
exports.RAW_SOL_MINT = new solana_contrib_1.PublicKey("RawSo11111111111111111111111111111111111112");
/**
 * Token information.
 */
class Token {
    constructor(info) {
        var _b;
        this.info = info;
        this._mintAccount = null;
        this.network = (_b = (0, exports.chainIdToNetwork)(info.chainId)) !== null && _b !== void 0 ? _b : "localnet";
    }
    /**
     * The mint PublicKey of the token.
     *
     * Avoid using this value to print it to a string, as base58
     * strings are relatively slow to create since they require the use
     * of hash functions.
     */
    get mintAccount() {
        if (this._mintAccount) {
            return this._mintAccount;
        }
        this._mintAccount = new solana_contrib_1.PublicKey(this.info.address);
        return this._mintAccount;
    }
    /**
     * If true, this token represents unwrapped, native, "raw" SOL.
     */
    get isRawSOL() {
        return this.mintAccount.equals(exports.RAW_SOL_MINT);
    }
    /**
     * The Base58 string representation of the mint address.
     */
    get address() {
        return this.info.address;
    }
    /**
     * The chain ID of the token.
     */
    get chainId() {
        return this.info.chainId;
    }
    /**
     * Number of decimals of the token.
     */
    get decimals() {
        return this.info.decimals;
    }
    /**
     * The name of the token.
     */
    get name() {
        return this.info.name;
    }
    /**
     * The symbol of the token.
     */
    get symbol() {
        return this.info.symbol;
    }
    /**
     * The token's icon to render.
     */
    get icon() {
        return this.info.logoURI;
    }
    equals(other) {
        return (0, exports.tokensEqual)(this, other);
    }
    toString() {
        return `Token[mint=${this.address}, decimals=${this.decimals}, network=${this.network}]`;
    }
    toJSON() {
        return this.info;
    }
    /**
     * Returns true if the given tag is present.
     * @param tag The tag to check.
     * @returns
     */
    hasTag(tag) {
        var _b;
        return !!((_b = this.info.tags) === null || _b === void 0 ? void 0 : _b.includes(tag));
    }
}
exports.Token = Token;
_a = Token;
/**
 * Loads a token from a Mint.
 * @param mint
 * @param opts
 * @returns
 */
Token.fromMint = (mint, decimals, opts = {}) => {
    var _b, _c, _d;
    return new Token({
        ...opts,
        // required
        address: mint.toString(),
        decimals,
        // optional
        name: (_b = opts.name) !== null && _b !== void 0 ? _b : `Token ${mint.toString().slice(0, 4)}`,
        symbol: (_c = opts.symbol) !== null && _c !== void 0 ? _c : mint.toString().slice(0, 5),
        chainId: (_d = opts.chainId) !== null && _d !== void 0 ? _d : ChainId.Localnet,
    });
};
/**
 * Loads a token from a Connection.
 *
 * @param connection
 * @param mint
 * @param info
 */
Token.load = async (connection, mint, info = {}) => {
    if (typeof info.decimals === "number") {
        return Token.fromMint(mint, info.decimals, info);
    }
    const mintAccountInfo = await connection.getAccountInfo(mint);
    if (!mintAccountInfo) {
        return null;
    }
    const mintInfo = (0, layout_js_1.deserializeMint)(mintAccountInfo.data);
    return Token.fromMint(mint, mintInfo.decimals, info);
};
/**
 * Checks if two tokens are equal.
 * @param a
 * @param b
 * @returns
 */
const tokensEqual = (a, b) => a !== undefined &&
    b !== undefined &&
    a.address === b.address &&
    a.network === b.network;
exports.tokensEqual = tokensEqual;
const rawSol = {
    address: exports.RAW_SOL_MINT.toString(),
    name: "Solana",
    symbol: "SOL",
    decimals: 9,
    logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
};
const wrappedSol = {
    address: spl_token_1.NATIVE_MINT.toString(),
    name: "Wrapped SOL",
    symbol: "SOL",
    decimals: 9,
    logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
};
/**
 * Creates a Token for all networks.
 */
const makeTokenForAllNetworks = (token) => ({
    "mainnet-beta": new Token({ ...token, chainId: ChainId.MainnetBeta }),
    devnet: new Token({ ...token, chainId: ChainId.Devnet }),
    testnet: new Token({ ...token, chainId: ChainId.Testnet }),
    localnet: new Token({ ...token, chainId: ChainId.Localnet }),
});
exports.makeTokenForAllNetworks = makeTokenForAllNetworks;
// comes from @solana/spl-token-registry, except we've added localnet
var ChainId;
(function (ChainId) {
    ChainId[ChainId["MainnetBeta"] = 101] = "MainnetBeta";
    ChainId[ChainId["Testnet"] = 102] = "Testnet";
    ChainId[ChainId["Devnet"] = 103] = "Devnet";
    ChainId[ChainId["Localnet"] = 104] = "Localnet";
})(ChainId = exports.ChainId || (exports.ChainId = {}));
exports.NETWORK_TO_CHAIN_ID = {
    "mainnet-beta": ChainId.MainnetBeta,
    devnet: ChainId.Devnet,
    testnet: ChainId.Testnet,
    localnet: 104,
};
exports.CHAIN_ID_TO_NETWORK = Object.entries(exports.NETWORK_TO_CHAIN_ID).reduce((acc, [network, env]) => ({ ...acc, [env]: network }), {});
/**
 * Gets the chain id associated with a network.
 * @param network
 * @returns
 */
const networkToChainId = (network) => exports.NETWORK_TO_CHAIN_ID[network];
exports.networkToChainId = networkToChainId;
/**
 * Gets the Network associated with a chain id.
 * @param network
 * @returns
 */
const chainIdToNetwork = (env) => exports.CHAIN_ID_TO_NETWORK[env];
exports.chainIdToNetwork = chainIdToNetwork;
/**
 * Raw Solana token.
 *
 * This is a magic value. This is not a real token.
 */
exports.RAW_SOL = (0, exports.makeTokenForAllNetworks)(rawSol);
/**
 * Wrapped Solana token.
 */
exports.WRAPPED_SOL = (0, exports.makeTokenForAllNetworks)(wrappedSol);
//# sourceMappingURL=token.js.map