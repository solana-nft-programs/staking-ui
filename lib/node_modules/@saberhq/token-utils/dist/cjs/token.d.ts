import type { Network } from "@saberhq/solana-contrib";
import { PublicKey } from "@saberhq/solana-contrib";
import type { Connection } from "@solana/web3.js";
import type { Token as UToken } from "@ubeswap/token-math";
import type { TokenInfo } from "./tokenList.js";
/**
 * Magic value representing the raw, underlying Solana native asset.
 */
export declare const RAW_SOL_MINT: PublicKey;
/**
 * Token information.
 */
export declare class Token implements UToken<Token> {
    readonly info: TokenInfo;
    /**
     * The network that the Token is on.
     */
    readonly network: Network;
    private _mintAccount;
    constructor(info: TokenInfo);
    /**
     * The mint PublicKey of the token.
     *
     * Avoid using this value to print it to a string, as base58
     * strings are relatively slow to create since they require the use
     * of hash functions.
     */
    get mintAccount(): PublicKey;
    /**
     * If true, this token represents unwrapped, native, "raw" SOL.
     */
    get isRawSOL(): boolean;
    /**
     * The Base58 string representation of the mint address.
     */
    get address(): string;
    /**
     * The chain ID of the token.
     */
    get chainId(): number;
    /**
     * Number of decimals of the token.
     */
    get decimals(): number;
    /**
     * The name of the token.
     */
    get name(): string;
    /**
     * The symbol of the token.
     */
    get symbol(): string;
    /**
     * The token's icon to render.
     */
    get icon(): string | undefined;
    equals(other: Token): boolean;
    toString(): string;
    toJSON(): unknown;
    /**
     * Returns true if the given tag is present.
     * @param tag The tag to check.
     * @returns
     */
    hasTag(tag: string): boolean;
    /**
     * Loads a token from a Mint.
     * @param mint
     * @param opts
     * @returns
     */
    static fromMint: (mint: PublicKey | string, decimals: number, opts?: Partial<Omit<TokenInfo, "address" | "decimals">>) => Token;
    /**
     * Loads a token from a Connection.
     *
     * @param connection
     * @param mint
     * @param info
     */
    static load: (connection: Connection, mint: PublicKey, info?: Partial<Omit<TokenInfo, "address">>) => Promise<Token | null>;
}
/**
 * Checks if two tokens are equal.
 * @param a
 * @param b
 * @returns
 */
export declare const tokensEqual: (a: Token | undefined, b: Token | undefined) => boolean;
/**
 * Map of network to Token
 */
export declare type TokenMap = {
    [c in Network]: Token;
};
/**
 * Creates a Token for all networks.
 */
export declare const makeTokenForAllNetworks: (token: Omit<TokenInfo, "chainId">) => TokenMap;
export declare enum ChainId {
    MainnetBeta = 101,
    Testnet = 102,
    Devnet = 103,
    Localnet = 104
}
export declare const NETWORK_TO_CHAIN_ID: {
    "mainnet-beta": ChainId;
    devnet: ChainId;
    testnet: ChainId;
    localnet: number;
};
export declare const CHAIN_ID_TO_NETWORK: {
    [E in ChainId]: Network;
};
/**
 * Gets the chain id associated with a network.
 * @param network
 * @returns
 */
export declare const networkToChainId: (network: Network) => ChainId;
/**
 * Gets the Network associated with a chain id.
 * @param network
 * @returns
 */
export declare const chainIdToNetwork: (env: ChainId) => Network;
/**
 * Raw Solana token.
 *
 * This is a magic value. This is not a real token.
 */
export declare const RAW_SOL: TokenMap;
/**
 * Wrapped Solana token.
 */
export declare const WRAPPED_SOL: TokenMap;
//# sourceMappingURL=token.d.ts.map