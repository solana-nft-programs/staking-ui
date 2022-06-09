import type { Commitment, Connection, RpcResponseAndContext, SimulatedTransactionResponse, Transaction } from "@solana/web3.js";
/**
 * Copy of Connection.simulateTransaction that takes a commitment parameter.
 */
export declare function simulateTransactionWithCommitment(connection: Connection, transaction: Transaction, commitment?: Commitment): Promise<RpcResponseAndContext<SimulatedTransactionResponse>>;
//# sourceMappingURL=simulateTransactionWithCommitment.d.ts.map