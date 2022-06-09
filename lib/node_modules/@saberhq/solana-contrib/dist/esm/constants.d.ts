import type { Cluster, ConnectionConfig } from "@solana/web3.js";
/**
 * A network: a Solana cluster or localnet.
 */
export declare type Network = Cluster | "localnet";
/**
 * Formats the network as a string.
 * @param network
 * @returns
 */
export declare const formatNetwork: (network: Network) => string;
export declare type NetworkConfig = Readonly<Omit<ConnectionConfig, "wsEndpoint"> & {
    name: string;
    /**
     * HTTP endpoint to connect to for this network.
     */
    endpoint: string;
    /**
     * Websocket endpoint to connect to for this network.
     */
    endpointWs?: string;
}>;
/**
 * Default configuration for all networks.
 */
export declare const DEFAULT_NETWORK_CONFIG_MAP: {
    readonly "mainnet-beta": {
        readonly name: "Mainnet Beta";
        readonly endpoint: "https://solana-api.projectserum.com/";
    };
    readonly devnet: {
        readonly name: "Devnet";
        readonly endpoint: "https://api.devnet.solana.com/";
    };
    readonly testnet: {
        readonly name: "Testnet";
        readonly endpoint: "https://api.testnet.solana.com/";
    };
    readonly localnet: {
        readonly name: "Localnet";
        readonly endpoint: "http://127.0.0.1:8899";
    };
};
export declare type NetworkConfigMap = {
    [N in Network]: NetworkConfig;
};
//# sourceMappingURL=constants.d.ts.map