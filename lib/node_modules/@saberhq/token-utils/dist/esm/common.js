/**
 * This file is a port of serum-common, which was built for web3.js 0.x.
 */
import { Token as SPLToken, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Keypair, PublicKey, SystemProgram, Transaction, } from "@solana/web3.js";
import { deserializeAccount, deserializeMint, MintLayout, Token, } from "./index.js";
export * as token from "./token.js";
/**
 * Default number of decimals of a token.
 */
export const DEFAULT_TOKEN_DECIMALS = 6;
export const SPL_SHARED_MEMORY_ID = new PublicKey("shmem4EWT2sPdVGvTZCzXXRAURL9G5vpPxNwSeKhHUL");
export async function createMint(provider, authority, decimals) {
    if (authority === undefined) {
        authority = provider.wallet.publicKey;
    }
    const mint = Keypair.generate();
    const instructions = await createMintInstructions(provider, authority, mint.publicKey, decimals);
    const tx = new Transaction();
    tx.add(...instructions);
    await provider.send(tx, [mint]);
    return mint.publicKey;
}
/**
 * Creates a Token.
 *
 * @param provider
 * @param authority The mint authority.
 * @param decimals Number of decimals.
 * @returns
 */
export async function createToken(provider, authority, decimals = 6) {
    return Token.fromMint(await createMint(provider, authority, decimals), decimals);
}
export async function createMintInstructions(provider, authority, mint, decimals = 6) {
    const instructions = [
        SystemProgram.createAccount({
            fromPubkey: provider.wallet.publicKey,
            newAccountPubkey: mint,
            space: MintLayout.span,
            lamports: await provider.connection.getMinimumBalanceForRentExemption(MintLayout.span),
            programId: TOKEN_PROGRAM_ID,
        }),
        SPLToken.createInitMintInstruction(TOKEN_PROGRAM_ID, mint, decimals, authority, null),
    ];
    return instructions;
}
export async function createMintAndVault(provider, amount, owner, decimals) {
    if (owner === undefined) {
        owner = provider.wallet.publicKey;
    }
    const mint = Keypair.generate();
    const vault = Keypair.generate();
    const tx = new Transaction();
    tx.add(...(await createMintInstructions(provider, provider.wallet.publicKey, mint.publicKey, decimals)), SystemProgram.createAccount({
        fromPubkey: provider.wallet.publicKey,
        newAccountPubkey: vault.publicKey,
        space: 165,
        lamports: await provider.connection.getMinimumBalanceForRentExemption(165),
        programId: TOKEN_PROGRAM_ID,
    }), SPLToken.createInitAccountInstruction(TOKEN_PROGRAM_ID, mint.publicKey, vault.publicKey, owner), SPLToken.createMintToInstruction(TOKEN_PROGRAM_ID, mint.publicKey, vault.publicKey, provider.wallet.publicKey, [], amount));
    await provider.send(tx, [mint, vault]);
    return [mint.publicKey, vault.publicKey];
}
export async function createTokenAccountInstrs(provider, newAccountPubkey, mint, owner, lamports) {
    if (lamports === undefined) {
        lamports = await provider.connection.getMinimumBalanceForRentExemption(165);
    }
    return [
        SystemProgram.createAccount({
            fromPubkey: provider.wallet.publicKey,
            newAccountPubkey,
            space: 165,
            lamports,
            programId: TOKEN_PROGRAM_ID,
        }),
        SPLToken.createInitAccountInstruction(TOKEN_PROGRAM_ID, mint, newAccountPubkey, owner),
    ];
}
export async function createAccountRentExempt(provider, programId, size) {
    const acc = Keypair.generate();
    const tx = new Transaction();
    tx.add(SystemProgram.createAccount({
        fromPubkey: provider.wallet.publicKey,
        newAccountPubkey: acc.publicKey,
        space: size,
        lamports: await provider.connection.getMinimumBalanceForRentExemption(size),
        programId,
    }));
    await provider.send(tx, [acc]);
    return acc;
}
export async function getMintInfo(provider, addr) {
    const depositorAccInfo = await provider.getAccountInfo(addr);
    if (depositorAccInfo === null) {
        throw new Error("Failed to find token mint account");
    }
    return deserializeMint(depositorAccInfo.accountInfo.data);
}
export async function getTokenAccount(provider, addr) {
    const depositorAccInfo = await provider.getAccountInfo(addr);
    if (depositorAccInfo === null) {
        throw new Error("Failed to find token account");
    }
    return deserializeAccount(depositorAccInfo.accountInfo.data);
}
export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
//# sourceMappingURL=common.js.map