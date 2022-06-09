"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createATAInstruction = exports.getOrCreateATAs = exports.getOrCreateATA = void 0;
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const ata_js_1 = require("../ata.js");
/**
 * Gets an associated token account, returning a create instruction if it doesn't exist.
 * @param param0
 * @returns
 */
const getOrCreateATA = async ({ provider, mint, owner = provider.wallet.publicKey, payer = provider.wallet.publicKey, }) => {
    const address = (0, ata_js_1.getATAAddressSync)({ mint, owner });
    if (await provider.getAccountInfo(address)) {
        return { address, instruction: null };
    }
    else {
        return {
            address,
            instruction: (0, exports.createATAInstruction)({
                mint,
                address,
                owner,
                payer,
            }),
        };
    }
};
exports.getOrCreateATA = getOrCreateATA;
/**
 * Gets ATAs and creates them if they don't exist.
 * @param param0
 * @returns
 */
const getOrCreateATAs = async ({ provider, mints, owner = provider.wallet.publicKey, }) => {
    const result = await Promise.all(Object.entries(mints).map(async ([name, mint]) => {
        const mintKey = new web3_js_1.PublicKey(mint);
        const result = await (0, exports.getOrCreateATA)({
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
exports.getOrCreateATAs = getOrCreateATAs;
/**
 * Instruction for creating an ATA.
 * @returns
 */
const createATAInstruction = ({ address, mint, owner, payer, }) => spl_token_1.Token.createAssociatedTokenAccountInstruction(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, mint, address, owner, payer);
exports.createATAInstruction = createATAInstruction;
//# sourceMappingURL=ata.js.map