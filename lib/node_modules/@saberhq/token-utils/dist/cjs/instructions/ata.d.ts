import type { Provider } from "@saberhq/solana-contrib";
import type { TransactionInstruction } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
declare type GetOrCreateATAResult = {
    /**
     * ATA key
     */
    address: PublicKey;
    /**
     * Instruction to create the account if it doesn't exist.
     */
    instruction: TransactionInstruction | null;
};
declare type GetOrCreateATAsResult<K extends string> = {
    /**
     * All accounts
     */
    accounts: {
        [mint in K]: PublicKey;
    };
    /**
     * Instructions to create accounts that don't exist.
     */
    instructions: readonly TransactionInstruction[];
    /**
     * Instructions, keyed.
     */
    createAccountInstructions: {
        [mint in K]: TransactionInstruction | null;
    };
};
/**
 * Gets an associated token account, returning a create instruction if it doesn't exist.
 * @param param0
 * @returns
 */
export declare const getOrCreateATA: ({ provider, mint, owner, payer, }: {
    provider: Provider;
    mint: PublicKey;
    owner?: PublicKey | undefined;
    payer?: PublicKey | undefined;
}) => Promise<GetOrCreateATAResult>;
/**
 * Gets ATAs and creates them if they don't exist.
 * @param param0
 * @returns
 */
export declare const getOrCreateATAs: <K extends string>({ provider, mints, owner, }: {
    provider: Provider;
    mints: { [mint in K]: PublicKey; };
    owner?: PublicKey | undefined;
}) => Promise<GetOrCreateATAsResult<K>>;
/**
 * Instruction for creating an ATA.
 * @returns
 */
export declare const createATAInstruction: ({ address, mint, owner, payer, }: {
    address: PublicKey;
    mint: PublicKey;
    owner: PublicKey;
    payer: PublicKey;
}) => TransactionInstruction;
export {};
//# sourceMappingURL=ata.d.ts.map