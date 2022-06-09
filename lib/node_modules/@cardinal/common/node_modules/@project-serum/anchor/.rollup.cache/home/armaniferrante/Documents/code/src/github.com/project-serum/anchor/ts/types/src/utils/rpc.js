import { Buffer } from "buffer";
import assert from "assert";
import { PublicKey, Transaction, TransactionInstruction, } from "@solana/web3.js";
import { chunks } from "../utils/common.js";
import { translateAddress } from "../program/common.js";
import { getProvider } from "../provider.js";
/**
 * Sends a transaction to a program with the given accounts and instruction
 * data.
 */
export async function invoke(programId, accounts, data, provider) {
    programId = translateAddress(programId);
    if (!provider) {
        provider = getProvider();
    }
    const tx = new Transaction();
    tx.add(new TransactionInstruction({
        programId,
        keys: accounts !== null && accounts !== void 0 ? accounts : [],
        data,
    }));
    return await provider.send(tx);
}
const GET_MULTIPLE_ACCOUNTS_LIMIT = 99;
export async function getMultipleAccounts(connection, publicKeys, commitment) {
    if (publicKeys.length <= GET_MULTIPLE_ACCOUNTS_LIMIT) {
        return await getMultipleAccountsCore(connection, publicKeys, commitment);
    }
    else {
        const batches = chunks(publicKeys, GET_MULTIPLE_ACCOUNTS_LIMIT);
        const results = await Promise.all(batches.map((batch) => getMultipleAccountsCore(connection, batch, commitment)));
        return results.flat();
    }
}
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
    assert(typeof res.result !== "undefined");
    const accounts = [];
    for (const account of res.result.value) {
        let value = null;
        if (account === null) {
            accounts.push(null);
            continue;
        }
        if (res.result.value) {
            const { executable, owner, lamports, data } = account;
            assert(data[1] === "base64");
            value = {
                executable,
                owner: new PublicKey(owner),
                lamports,
                data: Buffer.from(data[0], "base64"),
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