"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplTokenAccountsCoder = void 0;
const BufferLayout = __importStar(require("buffer-layout"));
const buffer_layout_js_1 = require("./buffer-layout.js");
const common_1 = require("../common");
class SplTokenAccountsCoder {
    constructor(idl) {
        this.idl = idl;
    }
    async encode(accountName, account) {
        switch (accountName) {
            case "token": {
                const buffer = Buffer.alloc(165);
                const len = TOKEN_ACCOUNT_LAYOUT.encode(account, buffer);
                return buffer.slice(0, len);
            }
            case "mint": {
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
            case "token": {
                return decodeTokenAccount(ix);
            }
            case "mint": {
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
            case "token": {
                return {
                    dataSize: 165,
                };
            }
            case "mint": {
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
        return (_a = (0, common_1.accountSize)(this.idl, idlAccount)) !== null && _a !== void 0 ? _a : 0;
    }
}
exports.SplTokenAccountsCoder = SplTokenAccountsCoder;
function decodeMintAccount(ix) {
    return MINT_ACCOUNT_LAYOUT.decode(ix);
}
function decodeTokenAccount(ix) {
    return TOKEN_ACCOUNT_LAYOUT.decode(ix);
}
const MINT_ACCOUNT_LAYOUT = BufferLayout.struct([
    (0, buffer_layout_js_1.coption)((0, buffer_layout_js_1.publicKey)(), "mintAuthority"),
    (0, buffer_layout_js_1.uint64)("supply"),
    BufferLayout.u8("decimals"),
    (0, buffer_layout_js_1.bool)("isInitialized"),
    (0, buffer_layout_js_1.coption)((0, buffer_layout_js_1.publicKey)(), "freezeAuthority"),
]);
const TOKEN_ACCOUNT_LAYOUT = BufferLayout.struct([
    (0, buffer_layout_js_1.publicKey)("mint"),
    (0, buffer_layout_js_1.publicKey)("authority"),
    (0, buffer_layout_js_1.uint64)("amount"),
    (0, buffer_layout_js_1.coption)((0, buffer_layout_js_1.publicKey)(), "delegate"),
    BufferLayout.u8("state"),
    (0, buffer_layout_js_1.coption)((0, buffer_layout_js_1.uint64)(), "isNative"),
    (0, buffer_layout_js_1.uint64)("delegatedAmount"),
    (0, buffer_layout_js_1.coption)((0, buffer_layout_js_1.publicKey)(), "closeAuthority"),
]);
//# sourceMappingURL=accounts.js.map