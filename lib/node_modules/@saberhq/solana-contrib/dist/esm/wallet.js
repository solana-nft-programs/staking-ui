import { SolanaProvider } from "./provider.js";
/**
 * Wallet based on a Signer.
 */
export class SignerWallet {
    constructor(signer) {
        this.signer = signer;
    }
    get publicKey() {
        return this.signer.publicKey;
    }
    signAllTransactions(transactions) {
        return Promise.resolve(transactions.map((tx) => {
            tx.partialSign(this.signer);
            return tx;
        }));
    }
    signTransaction(transaction) {
        transaction.partialSign(this.signer);
        return Promise.resolve(transaction);
    }
    /**
     * Creates a Provider from this Wallet by adding a Connection.
     * @param connection
     * @returns
     */
    createProvider(connection, sendConnection, opts) {
        return SolanaProvider.load({
            connection,
            sendConnection,
            wallet: this,
            opts,
        });
    }
}
//# sourceMappingURL=wallet.js.map