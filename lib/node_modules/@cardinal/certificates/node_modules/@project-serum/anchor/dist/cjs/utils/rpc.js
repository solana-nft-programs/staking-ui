"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMultipleAccounts = exports.invoke = void 0;
const buffer_1 = require("buffer");
const assert_1 = __importDefault(require("assert"));
const web3_js_1 = require("@solana/web3.js");
const common_js_1 = require("../utils/common.js");
const common_js_2 = require("../program/common.js");
const provider_js_1 = require("../provider.js");
/**
 * Sends a transaction to a program with the given accounts and instruction
 * data.
 */
async function invoke(programId, accounts, data, provider) {
    programId = (0, common_js_2.translateAddress)(programId);
    if (!provider) {
        provider = (0, provider_js_1.getProvider)();
    }
    const tx = new web3_js_1.Transaction();
    tx.add(new web3_js_1.TransactionInstruction({
        programId,
        keys: accounts !== null && accounts !== void 0 ? accounts : [],
        data,
    }));
    return await provider.send(tx);
}
exports.invoke = invoke;
const GET_MULTIPLE_ACCOUNTS_LIMIT = 99;
async function getMultipleAccounts(connection, publicKeys, commitment) {
    if (publicKeys.length <= GET_MULTIPLE_ACCOUNTS_LIMIT) {
        return await getMultipleAccountsCore(connection, publicKeys, commitment);
    }
    else {
        const batches = (0, common_js_1.chunks)(publicKeys, GET_MULTIPLE_ACCOUNTS_LIMIT);
        const results = await Promise.all(batches.map((batch) => getMultipleAccountsCore(connection, batch, commitment)));
        return results.flat();
    }
}
exports.getMultipleAccounts = getMultipleAccounts;
async function getMultipleAccountsCore(connection, publicKeys, commitmentOverride) {
    const commitment = commitmentOverride !== null && commitmentOverride !== void 0 ? commitmentOverride : connection.commitment;
    const args = [publicKeys.map((k) => k.toBase58())];
    if (commitment) {
        args.push({ commitment });
    }
    // @ts-ignore
    const res = await connection._rpcRequest("getMultipleAccounts", args);
    if (res.error) {
        throw new Error("failed to get info about accounts " +
            publicKeys.map((k) => k.toBase58()).join(", ") +
            ": " +
            res.error.message);
    }
    (0, assert_1.default)(typeof res.result !== "undefined");
    const accounts = [];
    for (const account of res.result.value) {
        let value = null;
        if (account === null) {
            accounts.push(null);
            continue;
        }
        if (res.result.value) {
            const { executable, owner, lamports, data } = account;
            (0, assert_1.default)(data[1] === "base64");
            value = {
                executable,
                owner: new web3_js_1.PublicKey(owner),
                lamports,
                data: buffer_1.Buffer.from(data[0], "base64"),
            };
        }
        if (value === null) {
            throw new Error("Invalid response");
        }
        accounts.push(value);
    }
    return accounts.map((account, idx) => {
        if (account === null) {
            return null;
        }
        return {
            publicKey: publicKeys[idx],
            account,
        };
    });
}
//# sourceMappingURL=rpc.js.map