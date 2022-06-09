import { PublicKey } from "@saberhq/solana-contrib";
import * as BufferLayout from "@solana/buffer-layout";
import { AccountLayout, MintLayout as TokenMintLayout, u64, } from "@solana/spl-token";
export { Layout as TypedLayout, Structure as TypedStructure, } from "@solana/buffer-layout";
/**
 * Typed struct buffer layout
 * @param fields
 * @param property
 * @param decodePrefixes
 * @returns
 */
export const structLayout = (fields, property, decodePrefixes) => BufferLayout.struct(fields, property, decodePrefixes);
/**
 * Layout for a public key
 */
export const PublicKeyLayout = (property = "publicKey") => {
    return BufferLayout.blob(32, property);
};
/**
 * Layout for a 64bit unsigned value
 */
export const Uint64Layout = (property = "uint64") => {
    return BufferLayout.blob(8, property);
};
/**
 * Layout for a TokenAccount.
 */
export const TokenAccountLayout = AccountLayout;
/**
 * Layout for a Mint.
 */
export const MintLayout = TokenMintLayout;
/**
 * Deserializes a token account.
 * @param address
 * @param data
 * @returns
 */
export const deserializeAccount = (data) => {
    const accountInfo = TokenAccountLayout.decode(data);
    const mint = new PublicKey(accountInfo.mint);
    const owner = new PublicKey(accountInfo.owner);
    const amount = u64.fromBuffer(accountInfo.amount);
    let delegate;
    let delegatedAmount;
    if (accountInfo.delegateOption === 0) {
        delegate = null;
        delegatedAmount = new u64(0);
    }
    else {
        delegate = new PublicKey(accountInfo.delegate);
        delegatedAmount = u64.fromBuffer(accountInfo.delegatedAmount);
    }
    const isInitialized = accountInfo.state !== 0;
    const isFrozen = accountInfo.state === 2;
    let rentExemptReserve;
    let isNative;
    if (accountInfo.isNativeOption === 1) {
        rentExemptReserve = u64.fromBuffer(accountInfo.isNative);
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
        closeAuthority = new PublicKey(accountInfo.closeAuthority);
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
/**
 * Deserialize a {@link Buffer} into a {@link MintInfo}.
 * @param data
 * @returns
 */
export const deserializeMint = (data) => {
    if (data.length !== MintLayout.span) {
        throw new Error("Not a valid Mint");
    }
    const mintInfo = MintLayout.decode(data);
    let mintAuthority;
    if (mintInfo.mintAuthorityOption === 0) {
        mintAuthority = null;
    }
    else {
        mintAuthority = new PublicKey(mintInfo.mintAuthority);
    }
    const supply = u64.fromBuffer(mintInfo.supply);
    const isInitialized = mintInfo.isInitialized !== 0;
    let freezeAuthority;
    if (mintInfo.freezeAuthorityOption === 0) {
        freezeAuthority = null;
    }
    else {
        freezeAuthority = new PublicKey(mintInfo.freezeAuthority);
    }
    return {
        mintAuthority,
        supply,
        decimals: mintInfo.decimals,
        isInitialized,
        freezeAuthority,
    };
};
//# sourceMappingURL=layout.js.map