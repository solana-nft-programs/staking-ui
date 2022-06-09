"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenAugmentedProvider = void 0;
const solana_contrib_1 = require("@saberhq/solana-contrib");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const ata_js_1 = require("./ata.js");
const common_js_1 = require("./common.js");
const index_js_1 = require("./index.js");
const ata_js_2 = require("./instructions/ata.js");
const layout_js_1 = require("./layout.js");
const token_js_1 = require("./token.js");
/**
 * Augmented provider with token utilities.
 */
class TokenAugmentedProvider extends solana_contrib_1.SolanaAugmentedProvider {
    constructor(provider) {
        super(provider);
    }
    /**
     * Creates a transaction to create a {@link Token}.
     */
    async createTokenTX({ mintKP = web3_js_1.Keypair.generate(), authority = this.walletKey, decimals = common_js_1.DEFAULT_TOKEN_DECIMALS, } = {}) {
        const instructions = await (0, common_js_1.createMintInstructions)(this.provider, authority, mintKP.publicKey, decimals);
        return {
            token: token_js_1.Token.fromMint(mintKP.publicKey, decimals),
            tx: this.newTX(instructions, [mintKP]),
        };
    }
    /**
     * Transfers tokens from the provider's ATA to a `TokenAccount`.
     */
    async transferTo({ amount, source, destination, }) {
        const txEnv = this.newTX();
        if (!source) {
            const sourceATA = await this.getOrCreateATA({
                mint: amount.token.mintAccount,
            });
            txEnv.append(sourceATA.instruction);
            source = sourceATA.address;
        }
        txEnv.append(index_js_1.SPLToken.createTransferInstruction(spl_token_1.TOKEN_PROGRAM_ID, source, destination, this.walletKey, [], amount.toU64()));
        return txEnv;
    }
    /**
     * Transfers tokens to a recipient's ATA.
     */
    async transfer({ amount, source, to, }) {
        const toATA = await this.getOrCreateATA({
            mint: amount.token.mintAccount,
            owner: to,
        });
        const txEnv = await this.transferTo({
            amount,
            source,
            destination: toATA.address,
        });
        txEnv.prepend(toATA.instruction);
        return txEnv;
    }
    /**
     * Creates a {@link Token}.
     */
    async createToken({ mintKP = web3_js_1.Keypair.generate(), authority = this.walletKey, decimals = common_js_1.DEFAULT_TOKEN_DECIMALS, } = {}) {
        const { token, tx } = await this.createTokenTX({
            mintKP,
            authority,
            decimals,
        });
        await tx.confirm();
        return token;
    }
    /**
     * Gets an ATA address.
     * @returns
     */
    async getATAAddress({ mint, owner = this.walletKey, }) {
        return await (0, ata_js_1.getATAAddress)({ mint, owner });
    }
    /**
     * Gets an ATA address.
     * @returns
     */
    async getATAAddresses({ mints, owner = this.walletKey, }) {
        return await (0, ata_js_1.getATAAddresses)({ mints, owner });
    }
    /**
     * Gets an ATA, creating it if it doesn't exist.
     * @returns
     */
    async getOrCreateATA({ mint, owner = this.walletKey, }) {
        return await (0, ata_js_2.getOrCreateATA)({ provider: this.provider, mint, owner });
    }
    /**
     * Get or create multiple ATAs.
     * @returns
     */
    async getOrCreateATAs({ mints, owner = this.walletKey, }) {
        return await (0, ata_js_2.getOrCreateATAs)({ provider: this.provider, mints, owner });
    }
    /**
     * Loads a token from the blockchain, only if the decimals are not provided.
     * @param mint
     * @returns
     */
    async loadToken(mint, info = {}) {
        return token_js_1.Token.load(this.provider.connection, mint, info);
    }
    /**
     * Mints tokens to a token account.
     * @param mint
     * @returns
     */
    mintToAccount({ amount, destination, }) {
        return this.newTX([
            index_js_1.SPLToken.createMintToInstruction(spl_token_1.TOKEN_PROGRAM_ID, amount.token.mintAccount, destination, this.walletKey, [], amount.toU64()),
        ]);
    }
    /**
     * Mints tokens to the ATA of the `to` account.
     * @param amount The amount of tokens to mint.
     * @param to The owner of the ATA that may be created.
     * @returns
     */
    async mintTo({ amount, to = this.walletKey, }) {
        const toATA = await this.getOrCreateATA({
            mint: amount.token.mintAccount,
            owner: to,
        });
        const txEnv = this.mintToAccount({
            amount,
            destination: toATA.address,
        });
        txEnv.prepend(toATA.instruction);
        return txEnv;
    }
    /**
     * Fetches a mint.
     * @param address
     * @returns
     */
    async fetchMint(address) {
        const accountInfo = await this.getAccountInfo(address);
        if (accountInfo === null) {
            return null;
        }
        return (0, layout_js_1.deserializeMint)(accountInfo.accountInfo.data);
    }
    /**
     * Fetches a token account.
     * @param address
     * @returns
     */
    async fetchTokenAccount(address) {
        const tokenAccountInfo = await this.getAccountInfo(address);
        if (tokenAccountInfo === null) {
            return null;
        }
        return (0, layout_js_1.deserializeAccount)(tokenAccountInfo.accountInfo.data);
    }
    /**
     * Fetches an ATA.
     * @param mint
     * @param owner
     * @returns
     */
    async fetchATA(mint, owner = this.walletKey) {
        const taAddress = await (0, ata_js_1.getATAAddress)({ mint, owner });
        return await this.fetchTokenAccount(taAddress);
    }
}
exports.TokenAugmentedProvider = TokenAugmentedProvider;
//# sourceMappingURL=tokenProvider.js.map