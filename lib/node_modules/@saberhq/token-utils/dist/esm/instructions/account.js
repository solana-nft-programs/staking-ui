import { TransactionEnvelope } from "@saberhq/solana-contrib";
import { Token as SPLToken, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Keypair, SystemProgram } from "@solana/web3.js";
import { TokenAccountLayout } from "../layout.js";
export const createTokenAccount = async ({ provider, mint, owner = provider.wallet.publicKey, payer = provider.wallet.publicKey, accountSigner = Keypair.generate(), }) => {
    // Allocate memory for the account
    const rentExemptAccountBalance = await SPLToken.getMinBalanceRentForExemptAccount(provider.connection);
    return buildCreateTokenAccountTX({
        provider,
        mint,
        rentExemptAccountBalance,
        owner,
        payer,
        accountSigner,
    });
};
export const buildCreateTokenAccountTX = ({ provider, mint, rentExemptAccountBalance, owner = provider.wallet.publicKey, payer = provider.wallet.publicKey, accountSigner = Keypair.generate(), }) => {
    const tokenAccount = accountSigner.publicKey;
    return {
        key: tokenAccount,
        tx: new TransactionEnvelope(provider, [
            SystemProgram.createAccount({
                fromPubkey: payer,
                newAccountPubkey: accountSigner.publicKey,
                lamports: rentExemptAccountBalance,
                space: TokenAccountLayout.span,
                programId: TOKEN_PROGRAM_ID,
            }),
            SPLToken.createInitAccountInstruction(TOKEN_PROGRAM_ID, mint, tokenAccount, owner),
        ], [accountSigner]),
    };
};
//# sourceMappingURL=account.js.map