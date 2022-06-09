import { ASSOCIATED_TOKEN_PROGRAM_ID, getATAAddress, getATAAddressSync, SPLToken, TOKEN_PROGRAM_ID, } from "./index.js";
/**
 * Wrapper around a token account owner to create token instructions.
 */
export class TokenOwner {
    constructor(owner) {
        this.owner = owner;
    }
    /**
     * Gets the user's ATA.
     * @param mint
     * @returns
     */
    async getATA(mint) {
        return await getATAAddress({ mint, owner: this.owner });
    }
    /**
     * Gets the user's ATA.
     * @param mint
     * @returns
     */
    getATASync(mint) {
        return getATAAddressSync({ mint, owner: this.owner });
    }
    /**
     * Transfers tokens to a token account.
     * @param amount Amount of tokens to transfer.
     * @param to Token account to transfer to.
     * @returns The transaction instruction.
     */
    async transfer(amount, to) {
        return SPLToken.createTransferInstruction(TOKEN_PROGRAM_ID, await this.getATA(amount.token.mintAccount), to, this.owner, [], amount.toU64());
    }
    /**
     * Transfers tokens to a token account, checked..
     * @param amount Amount of tokens to transfer.
     * @param to Token account to transfer to.
     * @returns The transaction instruction.
     */
    async transferChecked(amount, to) {
        return SPLToken.createTransferCheckedInstruction(TOKEN_PROGRAM_ID, await this.getATA(amount.token.mintAccount), amount.token.mintAccount, to, this.owner, [], amount.toU64(), amount.token.decimals);
    }
    /**
     * Mints tokens to a token account.
     * @param amount Amount of tokens to transfer.
     * @param to Token account to transfer to.
     * @returns The transaction instruction.
     */
    mintTo(amount, to) {
        return SPLToken.createMintToInstruction(TOKEN_PROGRAM_ID, amount.token.mintAccount, to, this.owner, [], amount.toU64());
    }
    /**
     * Creates an associated token account instruction.
     * @param mint Mint of the ATA.
     * @param payer Payer to create the ATA. Defaults to the owner.
     * @returns The transaction instruction.
     */
    async createATA(mint, payer = this.owner) {
        return SPLToken.createAssociatedTokenAccountInstruction(ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, mint, await this.getATA(mint), this.owner, payer);
    }
}
//# sourceMappingURL=tokenOwner.js.map