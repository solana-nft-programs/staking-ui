var _a;
import { PublicKey } from "@saberhq/solana-contrib";
import { NATIVE_MINT } from "@solana/spl-token";
import { deserializeMint } from "./layout.js";
/**
 * Magic value representing the raw, underlying Solana native asset.
 */
export const RAW_SOL_MINT = new PublicKey("RawSo11111111111111111111111111111111111112");
/**
 * Token information.
 */
export class Token {
    constructor(info) {
        var _b;
        this.info = info;
        this._mintAccount = null;
        this.network = (_b = chainIdToNetwork(info.chainId)) !== null && _b !== void 0 ? _b : "localnet";
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
        this._mintAccount = new PublicKey(this.info.address);
        return this._mintAccount;
    }
    /**
     * If true, this token represents unwrapped, native, "raw" SOL.
     */
    get isRawSOL() {
        return this.mintAccount.equals(RAW_SOL_MINT);
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
        return tokensEqual(this, other);
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
    const mintInfo = deserializeMint(mintAccountInfo.data);
    return Token.fromMint(mint, mintInfo.decimals, info);
};
/**
 * Checks if two tokens are equal.
 * @param a
 * @param b
 * @returns
 */
export const tokensEqual = (a, b) => a !== undefined &&
    b !== undefined &&
    a.address === b.address &&
    a.network === b.network;
const rawSol = {
    address: RAW_SOL_MINT.toString(),
    name: "Solana",
    symbol: "SOL",
    decimals: 9,
    logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
};
const wrappedSol = {
    address: NATIVE_MINT.toString(),
    name: "Wrapped SOL",
    symbol: "SOL",
    decimals: 9,
    logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
};
/**
 * Creates a Token for all networks.
 */
export const makeTokenForAllNetworks = (token) => ({
    "mainnet-beta": new Token({ ...token, chainId: ChainId.MainnetBeta }),
    devnet: new Token({ ...token, chainId: ChainId.Devnet }),
    testnet: new Token({ ...token, chainId: ChainId.Testnet }),
    localnet: new Token({ ...token, chainId: ChainId.Localnet }),
});
// comes from @solana/spl-token-registry, except we've added localnet
export var ChainId;
(function (ChainId) {
    ChainId[ChainId["MainnetBeta"] = 101] = "MainnetBeta";
    ChainId[ChainId["Testnet"] = 102] = "Testnet";
    ChainId[ChainId["Devnet"] = 103] = "Devnet";
    ChainId[ChainId["Localnet"] = 104] = "Localnet";
})(ChainId || (ChainId = {}));
export const NETWORK_TO_CHAIN_ID = {
    "mainnet-beta": ChainId.MainnetBeta,
    devnet: ChainId.Devnet,
    testnet: ChainId.Testnet,
    localnet: 104,
};
export const CHAIN_ID_TO_NETWORK = Object.entries(NETWORK_TO_CHAIN_ID).reduce((acc, [network, env]) => ({ ...acc, [env]: network }), {});
/**
 * Gets the chain id associated with a network.
 * @param network
 * @returns
 */
export const networkToChainId = (network) => NETWORK_TO_CHAIN_ID[network];
/**
 * Gets the Network associated with a chain id.
 * @param network
 * @returns
 */
export const chainIdToNetwork = (env) => CHAIN_ID_TO_NETWORK[env];
/**
 * Raw Solana token.
 *
 * This is a magic value. This is not a real token.
 */
export const RAW_SOL = makeTokenForAllNetworks(rawSol);
/**
 * Wrapped Solana token.
 */
export const WRAPPED_SOL = makeTokenForAllNetworks(wrappedSol);
//# sourceMappingURL=token.js.map