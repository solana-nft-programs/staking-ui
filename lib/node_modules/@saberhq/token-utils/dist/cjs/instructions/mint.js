"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMintToInstruction = exports.createInitMintTX = exports.createInitMintInstructions = void 0;
const solana_contrib_1 = require("@saberhq/solana-contrib");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const layout_js_1 = require("../layout.js");
/**
 * Creates instructions for initializing a mint.
 * @param param0
 * @returns
 */
const createInitMintInstructions = async ({ provider, mintKP, decimals, mintAuthority = provider.wallet.publicKey, freezeAuthority = null, }) => {
    return (0, exports.createInitMintTX)({
        provider,
        mintKP,
        decimals,
        rentExemptMintBalance: await spl_token_1.Token.getMinBalanceRentForExemptMint(provider.connection),
        mintAuthority,
        freezeAuthority,
    });
};
exports.createInitMintInstructions = createInitMintInstructions;
/**
 * Creates instructions for initializing a mint.
 * @param param0
 * @returns
 */
const createInitMintTX = ({ provider, mintKP, decimals, rentExemptMintBalance, mintAuthority = provider.wallet.publicKey, freezeAuthority = null, }) => {
    const from = provider.wallet.publicKey;
    return new solana_contrib_1.TransactionEnvelope(provider, [
        web3_js_1.SystemProgram.createAccount({
            fromPubkey: from,
            newAccountPubkey: mintKP.publicKey,
            space: layout_js_1.MintLayout.span,
            lamports: rentExemptMintBalance,
            programId: spl_token_1.TOKEN_PROGRAM_ID,
        }),
        spl_token_1.Token.createInitMintInstruction(spl_token_1.TOKEN_PROGRAM_ID, mintKP.publicKey, decimals, mintAuthority, freezeAuthority),
    ], [mintKP]);
};
exports.createInitMintTX = createInitMintTX;
const createMintToInstruction = ({ provider, mint, mintAuthorityKP, to, amount, }) => {
    return new solana_contrib_1.TransactionEnvelope(provider, [
        spl_token_1.Token.createMintToInstruction(spl_token_1.TOKEN_PROGRAM_ID, mint, to, mintAuthorityKP.publicKey, [], amount),
    ], [mintAuthorityKP]);
};
exports.createMintToInstruction = createMintToInstruction;
//# sourceMappingURL=mint.js.map