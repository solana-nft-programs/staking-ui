import type { ConfirmOptions, Connection, PublicKey, Signer, Transaction } from "@solana/web3.js";
import type { Provider, Wallet } from "./interfaces.js";
/**
 * Wallet based on a Signer.
 */
export declare class SignerWallet implements Wallet {
    readonly signer: Signer;
    constructor(signer: Signer);
    get publicKey(): PublicKey;
    signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>;
    signTransaction(transaction: Transaction): Promise<Transaction>;
    /**
     * Creates a Provider from this Wallet by adding a Connection.
     * @param connection
     * @returns
     */
    createProvider(connection: Connection, sendConnection?: Connection, opts?: ConfirmOptions): Provider;
}
//# sourceMappingURL=wallet.d.ts.map