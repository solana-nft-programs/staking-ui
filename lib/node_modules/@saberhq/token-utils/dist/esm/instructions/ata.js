import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID, } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { getATAAddressSync } from "../ata.js";
/**
 * Gets an associated token account, returning a create instruction if it doesn't exist.
 * @param param0
 * @returns
 */
export const getOrCreateATA = async ({ provider, mint, owner = provider.wallet.publicKey, payer = provider.wallet.publicKey, }) => {
    const address = getATAAddressSync({ mint, owner });
    if (await provider.getAccountInfo(address)) {
        return { address, instruction: null };
    }
    else {
        return {
            address,
            instruction: createATAInstruction({
                mint,
                address,
                owner,
                payer,
            }),
        };
    }
};
/**
 * Gets ATAs and creates them if they don't exist.
 * @param param0
 * @returns
 */
export const getOrCreateATAs = async ({ provider, mints, owner = provider.wallet.publicKey, }) => {
    const result = await Promise.all(Object.entries(mints).map(async ([name, mint]) => {
        const mintKey = new PublicKey(mint);
        const result = await getOrCreateATA({
            provider,
            mint: mintKey,
            owner: owner,
            payer: provider.wallet.publicKey,
        });
        return {
            address: result.address,
            instruction: result.instruction,
            name,
            mintKey,
        };
    }));
    const deduped = result.reduce((acc, { address, name, instruction }) => {
        return {
            accounts: {
                ...acc.accounts,
                [name]: address,
            },
            createAccountInstructions: {
                ...acc.createAccountInstructions,
                [name]: instruction,
            },
            instructions: instruction
                ? {
                    ...acc.instructions,
                    [address.toString()]: instruction,
                }
                : acc.instructions,
        };
    }, { accounts: {}, instructions: {}, createAccountInstructions: {} });
    return {
        accounts: deduped.accounts,
        createAccountInstructions: deduped.createAccountInstructions,
        instructions: Object.values(deduped.instructions),
    };
};
/**
 * Instruction for creating an ATA.
 * @returns
 */
export const createATAInstruction = ({ address, mint, owner, payer, }) => Token.createAssociatedTokenAccountInstruction(ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, mint, address, owner, payer);
//# sourceMappingURL=ata.js.map