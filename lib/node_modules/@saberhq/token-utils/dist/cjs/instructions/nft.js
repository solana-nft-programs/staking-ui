"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mintNFT = void 0;
const spl_token_1 = require("@solana/spl-token");
const ata_js_1 = require("./ata.js");
const mint_js_1 = require("./mint.js");
const mintNFT = async (provider, mintKP, owner = provider.wallet.publicKey) => {
    // Temporary mint authority
    const tempMintAuthority = provider.wallet.publicKey;
    // Mint for the NFT
    const tx = await (0, mint_js_1.createInitMintInstructions)({
        provider,
        mintKP,
        decimals: 0,
        mintAuthority: tempMintAuthority,
    });
    // Token account for the NFT
    const { address, instruction } = await (0, ata_js_1.getOrCreateATA)({
        provider,
        mint: mintKP.publicKey,
        owner: owner,
        payer: provider.wallet.publicKey,
    });
    if (instruction) {
        tx.instructions.push(instruction);
    }
    // Mint to owner's ATA
    tx.instructions.push(spl_token_1.Token.createMintToInstruction(spl_token_1.TOKEN_PROGRAM_ID, mintKP.publicKey, address, tempMintAuthority, [], new spl_token_1.u64(1)));
    // Set mint authority of the NFT to NULL
    tx.instructions.push(spl_token_1.Token.createSetAuthorityInstruction(spl_token_1.TOKEN_PROGRAM_ID, mintKP.publicKey, null, "MintTokens", tempMintAuthority, []));
    return tx;
};
exports.mintNFT = mintNFT;
//# sourceMappingURL=nft.js.map