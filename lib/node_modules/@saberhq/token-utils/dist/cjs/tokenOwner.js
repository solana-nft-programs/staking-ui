"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenOwner = void 0;
const index_js_1 = require("./index.js");
/**
 * Wrapper around a token account owner to create token instructions.
 */
class TokenOwner {
    constructor(owner) {
        this.owner = owner;
    }
    /**
     * Gets the user's ATA.
     * @param mint
     * @returns
     */
    async getATA(mint) {
        return await (0, index_js_1.getATAAddress)({ mint, owner: this.owner });
    }
    /**
     * Gets the user's ATA.
     * @param mint
     * @returns
     */
    getATASync(mint) {
        return (0, index_js_1.getATAAddressSync)({ mint, owner: this.owner });
    }
    /**
     * Transfers tokens to a token account.
     * @param amount Amount of tokens to transfer.
     * @param to Token account to transfer to.
     * @returns The transaction instruction.
     */
    async transfer(amount, to) {
        return index_js_1.SPLToken.createTransferInstruction(index_js_1.TOKEN_PROGRAM_ID, await this.getATA(amount.token.mintAccount), to, this.owner, [], amount.toU64());
    }
    /**
     * Transfers tokens to a token account, checked..
     * @param amount Amount of tokens to transfer.
     * @param to Token account to transfer to.
     * @returns The transaction instruction.
     */
    async transferChecked(amount, to) {
        return index_js_1.SPLToken.createTransferCheckedInstruction(index_js_1.TOKEN_PROGRAM_ID, await this.getATA(amount.token.mintAccount), amount.token.mintAccount, to, this.owner, [], amount.toU64(), amount.token.decimals);
    }
    /**
     * Mints tokens to a token account.
     * @param amount Amount of tokens to transfer.
     * @param to Token account to transfer to.
     * @returns The transaction instruction.
     */
    mintTo(amount, to) {
        return index_js_1.SPLToken.createMintToInstruction(index_js_1.TOKEN_PROGRAM_ID, amount.token.mintAccount, to, this.owner, [], amount.toU64());
    }
    /**
     * Creates an associated token account instruction.
     * @param mint Mint of the ATA.
     * @param payer Payer to create the ATA. Defaults to the owner.
     * @returns The transaction instruction.
     */
    async createATA(mint, payer = this.owner) {
        return index_js_1.SPLToken.createAssociatedTokenAccountInstruction(index_js_1.ASSOCIATED_TOKEN_PROGRAM_ID, index_js_1.TOKEN_PROGRAM_ID, mint, await this.getATA(mint), this.owner, payer);
    }
}
exports.TokenOwner = TokenOwner;
//# sourceMappingURL=tokenOwner.js.map