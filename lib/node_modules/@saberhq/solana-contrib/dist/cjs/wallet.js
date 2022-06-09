"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignerWallet = void 0;
const provider_js_1 = require("./provider.js");
/**
 * Wallet based on a Signer.
 */
class SignerWallet {
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
        return provider_js_1.SolanaProvider.load({
            connection,
            sendConnection,
            wallet: this,
            opts,
        });
    }
}
exports.SignerWallet = SignerWallet;
//# sourceMappingURL=wallet.js.map