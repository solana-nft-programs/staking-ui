import { SendTransactionError } from "@solana/web3.js";
/**
 * Copy of Connection.simulateTransaction that takes a commitment parameter.
 */
export async function simulateTransactionWithCommitment(connection, transaction, commitment = "confirmed") {
    var _a;
    const connectionInner = connection;
    // only populate recent blockhash if it isn't on the tx
    if (!transaction.recentBlockhash) {
        const { blockhash } = await connection.getLatestBlockhash(commitment);
        transaction.recentBlockhash = blockhash;
    }
    const wireTransaction = transaction.serialize({
        requireAllSignatures: false,
    });
    const encodedTransaction = wireTransaction.toString("base64");
    const config = { encoding: "base64", commitment };
    const res = await connectionInner._rpcRequest("simulateTransaction", [
        encodedTransaction,
        config,
    ]);
    if (res.error) {
        throw new SendTransactionError("failed to simulate transaction: " + res.error.message, (_a = res.result.value.logs) !== null && _a !== void 0 ? _a : undefined);
    }
    return res.result;
}
//# sourceMappingURL=simulateTransactionWithCommitment.js.map