/// <reference types="node" />
import type { AccountsCoder } from "@project-serum/anchor";
import type { IdlTypeDef } from "@project-serum/anchor/dist/esm/idl.js";
import type { ProgramAccountParser, PublicKey } from "@saberhq/solana-contrib";
/**
 * Account information.
 */
export interface AnchorAccount<T> extends ProgramAccountParser<T> {
    /**
     * {@link IdlTypeDef}.
     */
    idl: IdlTypeDef;
    /**
     * Size of the account in bytes
     */
    size: number;
    /**
     * The discriminator.
     */
    discriminator: Buffer;
    /**
     * Encodes the value.
     */
    encode: (value: T) => Promise<Buffer>;
}
/**
 * {@link ProgramAccountParser}s associated with an IDL.
 */
export declare type AnchorAccountMap<M> = {
    [K in keyof M]: AnchorAccount<M[K]>;
};
/**
 * Generates the metadata of accounts.
 *
 * This is intended to be called once at initialization.
 */
export declare const generateAnchorAccounts: <M>(programID: PublicKey, accounts: IdlTypeDef[], coder: AccountsCoder) => AnchorAccountMap<M>;
//# sourceMappingURL=accounts.d.ts.map