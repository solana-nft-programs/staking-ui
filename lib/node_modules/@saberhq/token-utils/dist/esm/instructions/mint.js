import { TransactionEnvelope } from "@saberhq/solana-contrib";
import { Token as SPLToken, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { SystemProgram } from "@solana/web3.js";
import { MintLayout } from "../layout.js";
/**
 * Creates instructions for initializing a mint.
 * @param param0
 * @returns
 */
export const createInitMintInstructions = async ({ provider, mintKP, decimals, mintAuthority = provider.wallet.publicKey, freezeAuthority = null, }) => {
    return createInitMintTX({
        provider,
        mintKP,
        decimals,
        rentExemptMintBalance: await SPLToken.getMinBalanceRentForExemptMint(provider.connection),
        mintAuthority,
        freezeAuthority,
    });
};
/**
 * Creates instructions for initializing a mint.
 * @param param0
 * @returns
 */
export const createInitMintTX = ({ provider, mintKP, decimals, rentExemptMintBalance, mintAuthority = provider.wallet.publicKey, freezeAuthority = null, }) => {
    const from = provider.wallet.publicKey;
    return new TransactionEnvelope(provider, [
        SystemProgram.createAccount({
            fromPubkey: from,
            newAccountPubkey: mintKP.publicKey,
            space: MintLayout.span,
            lamports: rentExemptMintBalance,
            programId: TOKEN_PROGRAM_ID,
        }),
        SPLToken.createInitMintInstruction(TOKEN_PROGRAM_ID, mintKP.publicKey, decimals, mintAuthority, freezeAuthority),
    ], [mintKP]);
};
export const createMintToInstruction = ({ provider, mint, mintAuthorityKP, to, amount, }) => {
    return new TransactionEnvelope(provider, [
        SPLToken.createMintToInstruction(TOKEN_PROGRAM_ID, mint, to, mintAuthorityKP.publicKey, [], amount),
    ], [mintAuthorityKP]);
};
//# sourceMappingURL=mint.js.map