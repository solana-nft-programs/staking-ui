import type { AugmentedProvider, Provider, PublicKey, TransactionEnvelope } from "@saberhq/solana-contrib";
import { SolanaAugmentedProvider } from "@saberhq/solana-contrib";
import type { MintInfo } from "@solana/spl-token";
import type { Signer } from "@solana/web3.js";
import type { TokenAmount, TokenInfo } from "./index.js";
import type { TokenAccountData } from "./layout.js";
import { Token } from "./token.js";
/**
 * Augmented provider with token utilities.
 */
export declare class TokenAugmentedProvider extends SolanaAugmentedProvider implements AugmentedProvider {
    constructor(provider: Provider);
    /**
     * Creates a transaction to create a {@link Token}.
     */
    createTokenTX({ mintKP, authority, decimals, }?: {
        mintKP?: Signer;
        authority?: PublicKey;
        decimals?: number;
    }): Promise<{
        token: Token;
        tx: TransactionEnvelope;
    }>;
    /**
     * Transfers tokens from the provider's ATA to a `TokenAccount`.
     */
    transferTo({ amount, source, destination, }: {
        amount: TokenAmount;
        source?: PublicKey;
        destination: PublicKey;
    }): Promise<TransactionEnvelope>;
    /**
     * Transfers tokens to a recipient's ATA.
     */
    transfer({ amount, source, to, }: {
        amount: TokenAmount;
        source?: PublicKey;
        /**
         * Recipient of the tokens. This should not be a token account.
         */
        to: PublicKey;
    }): Promise<TransactionEnvelope>;
    /**
     * Creates a {@link Token}.
     */
    createToken({ mintKP, authority, decimals, }?: {
        mintKP?: Signer;
        authority?: PublicKey;
        decimals?: number;
    }): Promise<Token>;
    /**
     * Gets an ATA address.
     * @returns
     */
    getATAAddress({ mint, owner, }: {
        mint: PublicKey;
        owner?: PublicKey;
    }): Promise<PublicKey>;
    /**
     * Gets an ATA address.
     * @returns
     */
    getATAAddresses<K extends string>({ mints, owner, }: {
        mints: {
            [mint in K]: PublicKey;
        };
        owner?: PublicKey;
    }): Promise<{
        accounts: import("./ata.js").ATAMap<K>;
    }>;
    /**
     * Gets an ATA, creating it if it doesn't exist.
     * @returns
     */
    getOrCreateATA({ mint, owner, }: {
        mint: PublicKey;
        owner?: PublicKey;
    }): Promise<{
        address: PublicKey;
        instruction: import("@solana/web3.js").TransactionInstruction | null;
    }>;
    /**
     * Get or create multiple ATAs.
     * @returns
     */
    getOrCreateATAs<K extends string>({ mints, owner, }: {
        mints: {
            [mint in K]: PublicKey;
        };
        owner?: PublicKey;
    }): Promise<{
        accounts: { [mint in K]: PublicKey; };
        instructions: readonly import("@solana/web3.js").TransactionInstruction[];
        createAccountInstructions: { [mint_1 in K]: import("@solana/web3.js").TransactionInstruction | null; };
    }>;
    /**
     * Loads a token from the blockchain, only if the decimals are not provided.
     * @param mint
     * @returns
     */
    loadToken(mint: PublicKey, info?: Partial<Omit<TokenInfo, "address">>): Promise<Token | null>;
    /**
     * Mints tokens to a token account.
     * @param mint
     * @returns
     */
    mintToAccount({ amount, destination, }: {
        amount: TokenAmount;
        destination: PublicKey;
    }): TransactionEnvelope;
    /**
     * Mints tokens to the ATA of the `to` account.
     * @param amount The amount of tokens to mint.
     * @param to The owner of the ATA that may be created.
     * @returns
     */
    mintTo({ amount, to, }: {
        amount: TokenAmount;
        to?: PublicKey;
    }): Promise<TransactionEnvelope>;
    /**
     * Fetches a mint.
     * @param address
     * @returns
     */
    fetchMint(address: PublicKey): Promise<MintInfo | null>;
    /**
     * Fetches a token account.
     * @param address
     * @returns
     */
    fetchTokenAccount(address: PublicKey): Promise<TokenAccountData | null>;
    /**
     * Fetches an ATA.
     * @param mint
     * @param owner
     * @returns
     */
    fetchATA(mint: PublicKey, owner?: PublicKey): Promise<TokenAccountData | null>;
}
//# sourceMappingURL=tokenProvider.d.ts.map