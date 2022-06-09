import type { PublicKey } from "@saberhq/solana-contrib";
import type { TransactionInstruction } from "@solana/web3.js";
import type { TokenAmount } from "./tokenAmount.js";
/**
 * Wrapper around a token account owner to create token instructions.
 */
export declare class TokenOwner {
    readonly owner: PublicKey;
    constructor(owner: PublicKey);
    /**
     * Gets the user's ATA.
     * @param mint
     * @returns
     */
    getATA(mint: PublicKey): Promise<PublicKey>;
    /**
     * Gets the user's ATA.
     * @param mint
     * @returns
     */
    getATASync(mint: PublicKey): PublicKey;
    /**
     * Transfers tokens to a token account.
     * @param amount Amount of tokens to transfer.
     * @param to Token account to transfer to.
     * @returns The transaction instruction.
     */
    transfer(amount: TokenAmount, to: PublicKey): Promise<TransactionInstruction>;
    /**
     * Transfers tokens to a token account, checked..
     * @param amount Amount of tokens to transfer.
     * @param to Token account to transfer to.
     * @returns The transaction instruction.
     */
    transferChecked(amount: TokenAmount, to: PublicKey): Promise<TransactionInstruction>;
    /**
     * Mints tokens to a token account.
     * @param amount Amount of tokens to transfer.
     * @param to Token account to transfer to.
     * @returns The transaction instruction.
     */
    mintTo(amount: TokenAmount, to: PublicKey): TransactionInstruction;
    /**
     * Creates an associated token account instruction.
     * @param mint Mint of the ATA.
     * @param payer Payer to create the ATA. Defaults to the owner.
     * @returns The transaction instruction.
     */
    createATA(mint: PublicKey, payer?: PublicKey): Promise<TransactionInstruction>;
}
//# sourceMappingURL=tokenOwner.d.ts.map