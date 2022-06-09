import type { Provider } from "@saberhq/solana-contrib";
import { TransactionEnvelope } from "@saberhq/solana-contrib";
import type { PublicKey, Signer } from "@solana/web3.js";
export declare const createTokenAccount: ({ provider, mint, owner, payer, accountSigner, }: {
    provider: Provider;
    mint: PublicKey;
    owner?: PublicKey | undefined;
    payer?: PublicKey | undefined;
    /**
     * The keypair of the account to be created.
     */
    accountSigner?: Signer | undefined;
}) => Promise<{
    key: PublicKey;
    tx: TransactionEnvelope;
}>;
export declare const buildCreateTokenAccountTX: ({ provider, mint, rentExemptAccountBalance, owner, payer, accountSigner, }: {
    provider: Provider;
    mint: PublicKey;
    /**
     * SOL needed for a rent exempt token account.
     */
    rentExemptAccountBalance: number;
    owner?: PublicKey | undefined;
    payer?: PublicKey | undefined;
    /**
     * The keypair of the account to be created.
     */
    accountSigner?: Signer | undefined;
}) => {
    key: PublicKey;
    tx: TransactionEnvelope;
};
//# sourceMappingURL=account.d.ts.map