import * as BufferLayout from "buffer-layout";
import { publicKey, uint64, coption, bool } from "./buffer-layout.js";
import { accountSize } from "../common";
export class SplTokenAccountsCoder {
    constructor(idl) {
        this.idl = idl;
    }
    async encode(accountName, account) {
        switch (accountName) {
            case "Token": {
                const buffer = Buffer.alloc(165);
                const len = TOKEN_ACCOUNT_LAYOUT.encode(account, buffer);
                return buffer.slice(0, len);
            }
            case "Mint": {
                const buffer = Buffer.alloc(82);
                const len = MINT_ACCOUNT_LAYOUT.encode(account, buffer);
                return buffer.slice(0, len);
            }
            default: {
                throw new Error(`Invalid account name: ${accountName}`);
            }
        }
    }
    decode(accountName, ix) {
        return this.decodeUnchecked(accountName, ix);
    }
    decodeUnchecked(accountName, ix) {
        switch (accountName) {
            case "Token": {
                return decodeTokenAccount(ix);
            }
            case "Mint": {
                return decodeMintAccount(ix);
            }
            default: {
                throw new Error(`Invalid account name: ${accountName}`);
            }
        }
    }
    // TODO: this won't use the appendData.
    memcmp(accountName, _appendData) {
        switch (accountName) {
            case "Token": {
                return {
                    dataSize: 165,
                };
            }
            case "Mint": {
                return {
                    dataSize: 82,
                };
            }
            default: {
                throw new Error(`Invalid account name: ${accountName}`);
            }
        }
    }
    size(idlAccount) {
        var _a;
        return (_a = accountSize(this.idl, idlAccount)) !== null && _a !== void 0 ? _a : 0;
    }
}
function decodeMintAccount(ix) {
    return MINT_ACCOUNT_LAYOUT.decode(ix);
}
function decodeTokenAccount(ix) {
    return TOKEN_ACCOUNT_LAYOUT.decode(ix);
}
const MINT_ACCOUNT_LAYOUT = BufferLayout.struct([
    coption(publicKey(), "mintAuthority"),
    uint64("supply"),
    BufferLayout.u8("decimals"),
    bool("isInitialized"),
    coption(publicKey(), "freezeAuthority"),
]);
const TOKEN_ACCOUNT_LAYOUT = BufferLayout.struct([
    publicKey("mint"),
    publicKey("authority"),
    uint64("amount"),
    coption(publicKey(), "delegate"),
    BufferLayout.u8("state"),
    coption(uint64(), "isNative"),
    uint64("delegatedAmount"),
    coption(publicKey(), "closeAuthority"),
]);
//# sourceMappingURL=accounts.js.map