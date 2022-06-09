/// <reference types="node" />
import type { Connection, SendOptions } from "@solana/web3.js";
import type { TransactionRetryOptions } from "./index.js";
/**
 * Sends and spams a raw transaction multiple times.
 * @param connection Connection to send the transaction to. We recommend using a public endpoint such as GenesysGo.
 * @param rawTx
 * @param opts
 */
export declare const sendAndSpamRawTx: (connection: Connection, rawTx: Buffer, sendOptions: SendOptions, { retryTimes, retryInterval, }?: TransactionRetryOptions) => Promise<string>;
//# sourceMappingURL=sendAndSpamRawTx.d.ts.map