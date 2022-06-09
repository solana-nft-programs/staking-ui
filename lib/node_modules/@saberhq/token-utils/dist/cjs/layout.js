"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeMint = exports.deserializeAccount = exports.MintLayout = exports.TokenAccountLayout = exports.Uint64Layout = exports.PublicKeyLayout = exports.structLayout = exports.TypedStructure = exports.TypedLayout = void 0;
const tslib_1 = require("tslib");
const solana_contrib_1 = require("@saberhq/solana-contrib");
const BufferLayout = tslib_1.__importStar(require("@solana/buffer-layout"));
const spl_token_1 = require("@solana/spl-token");
var buffer_layout_1 = require("@solana/buffer-layout");
Object.defineProperty(exports, "TypedLayout", { enumerable: true, get: function () { return buffer_layout_1.Layout; } });
Object.defineProperty(exports, "TypedStructure", { enumerable: true, get: function () { return buffer_layout_1.Structure; } });
/**
 * Typed struct buffer layout
 * @param fields
 * @param property
 * @param decodePrefixes
 * @returns
 */
const structLayout = (fields, property, decodePrefixes) => BufferLayout.struct(fields, property, decodePrefixes);
exports.structLayout = structLayout;
/**
 * Layout for a public key
 */
const PublicKeyLayout = (property = "publicKey") => {
    return BufferLayout.blob(32, property);
};
exports.PublicKeyLayout = PublicKeyLayout;
/**
 * Layout for a 64bit unsigned value
 */
const Uint64Layout = (property = "uint64") => {
    return BufferLayout.blob(8, property);
};
exports.Uint64Layout = Uint64Layout;
/**
 * Layout for a TokenAccount.
 */
exports.TokenAccountLayout = spl_token_1.AccountLayout;
/**
 * Layout for a Mint.
 */
exports.MintLayout = spl_token_1.MintLayout;
/**
 * Deserializes a token account.
 * @param address
 * @param data
 * @returns
 */
const deserializeAccount = (data) => {
    const accountInfo = exports.TokenAccountLayout.decode(data);
    const mint = new solana_contrib_1.PublicKey(accountInfo.mint);
    const owner = new solana_contrib_1.PublicKey(accountInfo.owner);
    const amount = spl_token_1.u64.fromBuffer(accountInfo.amount);
    let delegate;
    let delegatedAmount;
    if (accountInfo.delegateOption === 0) {
        delegate = null;
        delegatedAmount = new spl_token_1.u64(0);
    }
    else {
        delegate = new solana_contrib_1.PublicKey(accountInfo.delegate);
        delegatedAmount = spl_token_1.u64.fromBuffer(accountInfo.delegatedAmount);
    }
    const isInitialized = accountInfo.state !== 0;
    const isFrozen = accountInfo.state === 2;
    let rentExemptReserve;
    let isNative;
    if (accountInfo.isNativeOption === 1) {
        rentExemptReserve = spl_token_1.u64.fromBuffer(accountInfo.isNative);
        isNative = true;
    }
    else {
        rentExemptReserve = null;
        isNative = false;
    }
    let closeAuthority;
    if (accountInfo.closeAuthorityOption === 0) {
        closeAuthority = null;
    }
    else {
        closeAuthority = new solana_contrib_1.PublicKey(accountInfo.closeAuthority);
    }
    return {
        mint,
        owner,
        amount,
        delegate,
        delegatedAmount,
        isInitialized,
        isFrozen,
        rentExemptReserve,
        isNative,
        closeAuthority,
    };
};
exports.deserializeAccount = deserializeAccount;
/**
 * Deserialize a {@link Buffer} into a {@link MintInfo}.
 * @param data
 * @returns
 */
const deserializeMint = (data) => {
    if (data.length !== exports.MintLayout.span) {
        throw new Error("Not a valid Mint");
    }
    const mintInfo = exports.MintLayout.decode(data);
    let mintAuthority;
    if (mintInfo.mintAuthorityOption === 0) {
        mintAuthority = null;
    }
    else {
        mintAuthority = new solana_contrib_1.PublicKey(mintInfo.mintAuthority);
    }
    const supply = spl_token_1.u64.fromBuffer(mintInfo.supply);
    const isInitialized = mintInfo.isInitialized !== 0;
    let freezeAuthority;
    if (mintInfo.freezeAuthorityOption === 0) {
        freezeAuthority = null;
    }
    else {
        freezeAuthority = new solana_contrib_1.PublicKey(mintInfo.freezeAuthority);
    }
    return {
        mintAuthority,
        supply,
        decimals: mintInfo.decimals,
        isInitialized,
        freezeAuthority,
    };
};
exports.deserializeMint = deserializeMint;
//# sourceMappingURL=layout.js.map