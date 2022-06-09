import type { Provider } from "@saberhq/solana-contrib";
import { TransactionEnvelope } from "@saberhq/solana-contrib";
import type { u64 } from "@solana/spl-token";
import type { PublicKey, Signer } from "@solana/web3.js";
/**
 * Creates instructions for initializing a mint.
 * @param param0
 * @returns
 */
export declare const createInitMintInstructions: ({ provider, mintKP, decimals, mintAuthority, freezeAuthority, }: {
    provider: Provider;
    mintKP: Signer;
    decimals: number;
    mintAuthority?: PublicKey | undefined;
    freezeAuthority?: PublicKey | null | undefined;
}) => Promise<TransactionEnvelope>;
/**
 * Creates instructions for initializing a mint.
 * @param param0
 * @returns
 */
export declare const createInitMintTX: ({ provider, mintKP, decimals, rentExemptMintBalance, mintAuthority, freezeAuthority, }: {
    provider: Provider;
    mintKP: Signer;
    decimals: number;
    rentExemptMintBalance: number;
    mintAuthority?: PublicKey | undefined;
    freezeAuthority?: PublicKey | null | undefined;
}) => TransactionEnvelope;
export declare const createMintToInstruction: ({ provider, mint, mintAuthorityKP, to, amount, }: {
    provider: Provider;
    mint: PublicKey;
    mintAuthorityKP: Signer;
    to: PublicKey;
    amount: u64;
}) => TransactionEnvelope;
//# sourceMappingURL=mint.d.ts.map