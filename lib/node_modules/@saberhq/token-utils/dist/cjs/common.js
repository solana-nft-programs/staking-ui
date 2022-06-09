"use strict";
/**
 * This file is a port of serum-common, which was built for web3.js 0.x.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.getTokenAccount = exports.getMintInfo = exports.createAccountRentExempt = exports.createTokenAccountInstrs = exports.createMintAndVault = exports.createMintInstructions = exports.createToken = exports.createMint = exports.SPL_SHARED_MEMORY_ID = exports.DEFAULT_TOKEN_DECIMALS = exports.token = void 0;
const tslib_1 = require("tslib");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const index_js_1 = require("./index.js");
exports.token = tslib_1.__importStar(require("./token.js"));
/**
 * Default number of decimals of a token.
 */
exports.DEFAULT_TOKEN_DECIMALS = 6;
exports.SPL_SHARED_MEMORY_ID = new web3_js_1.PublicKey("shmem4EWT2sPdVGvTZCzXXRAURL9G5vpPxNwSeKhHUL");
async function createMint(provider, authority, decimals) {
    if (authority === undefined) {
        authority = provider.wallet.publicKey;
    }
    const mint = web3_js_1.Keypair.generate();
    const instructions = await createMintInstructions(provider, authority, mint.publicKey, decimals);
    const tx = new web3_js_1.Transaction();
    tx.add(...instructions);
    await provider.send(tx, [mint]);
    return mint.publicKey;
}
exports.createMint = createMint;
/**
 * Creates a Token.
 *
 * @param provider
 * @param authority The mint authority.
 * @param decimals Number of decimals.
 * @returns
 */
async function createToken(provider, authority, decimals = 6) {
    return index_js_1.Token.fromMint(await createMint(provider, authority, decimals), decimals);
}
exports.createToken = createToken;
async function createMintInstructions(provider, authority, mint, decimals = 6) {
    const instructions = [
        web3_js_1.SystemProgram.createAccount({
            fromPubkey: provider.wallet.publicKey,
            newAccountPubkey: mint,
            space: index_js_1.MintLayout.span,
            lamports: await provider.connection.getMinimumBalanceForRentExemption(index_js_1.MintLayout.span),
            programId: spl_token_1.TOKEN_PROGRAM_ID,
        }),
        spl_token_1.Token.createInitMintInstruction(spl_token_1.TOKEN_PROGRAM_ID, mint, decimals, authority, null),
    ];
    return instructions;
}
exports.createMintInstructions = createMintInstructions;
async function createMintAndVault(provider, amount, owner, decimals) {
    if (owner === undefined) {
        owner = provider.wallet.publicKey;
    }
    const mint = web3_js_1.Keypair.generate();
    const vault = web3_js_1.Keypair.generate();
    const tx = new web3_js_1.Transaction();
    tx.add(...(await createMintInstructions(provider, provider.wallet.publicKey, mint.publicKey, decimals)), web3_js_1.SystemProgram.createAccount({
        fromPubkey: provider.wallet.publicKey,
        newAccountPubkey: vault.publicKey,
        space: 165,
        lamports: await provider.connection.getMinimumBalanceForRentExemption(165),
        programId: spl_token_1.TOKEN_PROGRAM_ID,
    }), spl_token_1.Token.createInitAccountInstruction(spl_token_1.TOKEN_PROGRAM_ID, mint.publicKey, vault.publicKey, owner), spl_token_1.Token.createMintToInstruction(spl_token_1.TOKEN_PROGRAM_ID, mint.publicKey, vault.publicKey, provider.wallet.publicKey, [], amount));
    await provider.send(tx, [mint, vault]);
    return [mint.publicKey, vault.publicKey];
}
exports.createMintAndVault = createMintAndVault;
async function createTokenAccountInstrs(provider, newAccountPubkey, mint, owner, lamports) {
    if (lamports === undefined) {
        lamports = await provider.connection.getMinimumBalanceForRentExemption(165);
    }
    return [
        web3_js_1.SystemProgram.createAccount({
            fromPubkey: provider.wallet.publicKey,
            newAccountPubkey,
            space: 165,
            lamports,
            programId: spl_token_1.TOKEN_PROGRAM_ID,
        }),
        spl_token_1.Token.createInitAccountInstruction(spl_token_1.TOKEN_PROGRAM_ID, mint, newAccountPubkey, owner),
    ];
}
exports.createTokenAccountInstrs = createTokenAccountInstrs;
async function createAccountRentExempt(provider, programId, size) {
    const acc = web3_js_1.Keypair.generate();
    const tx = new web3_js_1.Transaction();
    tx.add(web3_js_1.SystemProgram.createAccount({
        fromPubkey: provider.wallet.publicKey,
        newAccountPubkey: acc.publicKey,
        space: size,
        lamports: await provider.connection.getMinimumBalanceForRentExemption(size),
        programId,
    }));
    await provider.send(tx, [acc]);
    return acc;
}
exports.createAccountRentExempt = createAccountRentExempt;
async function getMintInfo(provider, addr) {
    const depositorAccInfo = await provider.getAccountInfo(addr);
    if (depositorAccInfo === null) {
        throw new Error("Failed to find token mint account");
    }
    return (0, index_js_1.deserializeMint)(depositorAccInfo.accountInfo.data);
}
exports.getMintInfo = getMintInfo;
async function getTokenAccount(provider, addr) {
    const depositorAccInfo = await provider.getAccountInfo(addr);
    if (depositorAccInfo === null) {
        throw new Error("Failed to find token account");
    }
    return (0, index_js_1.deserializeAccount)(depositorAccInfo.accountInfo.data);
}
exports.getTokenAccount = getTokenAccount;
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
exports.sleep = sleep;
//# sourceMappingURL=common.js.map