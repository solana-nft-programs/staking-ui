"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCreateTokenAccountTX = exports.createTokenAccount = void 0;
const solana_contrib_1 = require("@saberhq/solana-contrib");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const layout_js_1 = require("../layout.js");
const createTokenAccount = async ({ provider, mint, owner = provider.wallet.publicKey, payer = provider.wallet.publicKey, accountSigner = web3_js_1.Keypair.generate(), }) => {
    // Allocate memory for the account
    const rentExemptAccountBalance = await spl_token_1.Token.getMinBalanceRentForExemptAccount(provider.connection);
    return (0, exports.buildCreateTokenAccountTX)({
        provider,
        mint,
        rentExemptAccountBalance,
        owner,
        payer,
        accountSigner,
    });
};
exports.createTokenAccount = createTokenAccount;
const buildCreateTokenAccountTX = ({ provider, mint, rentExemptAccountBalance, owner = provider.wallet.publicKey, payer = provider.wallet.publicKey, accountSigner = web3_js_1.Keypair.generate(), }) => {
    const tokenAccount = accountSigner.publicKey;
    return {
        key: tokenAccount,
        tx: new solana_contrib_1.TransactionEnvelope(provider, [
            web3_js_1.SystemProgram.createAccount({
                fromPubkey: payer,
                newAccountPubkey: accountSigner.publicKey,
                lamports: rentExemptAccountBalance,
                space: layout_js_1.TokenAccountLayout.span,
                programId: spl_token_1.TOKEN_PROGRAM_ID,
            }),
            spl_token_1.Token.createInitAccountInstruction(spl_token_1.TOKEN_PROGRAM_ID, mint, tokenAccount, owner),
        ], [accountSigner]),
    };
};
exports.buildCreateTokenAccountTX = buildCreateTokenAccountTX;
//# sourceMappingURL=account.js.map