/// <reference types="node" />
import type { AccountsCoder, Idl } from "@project-serum/anchor";
/**
 * Parsers associated with an IDL.
 */
export declare type AccountParsers<M> = {
    [K in keyof M]: (data: Buffer) => M[K];
};
/**
 * Creates parsers for accounts.
 *
 * This is intended to be called once at initialization.
 *
 * @param idl The IDL.
 */
export declare const generateAccountParsers: <M extends Record<string, object>>(idl: Idl) => AccountParsers<M>;
/**
 * Creates parsers for accounts.
 *
 * This is intended to be called once at initialization.
 *
 * @param idl The IDL.
 */
export declare const generateAccountParsersFromCoder: <M>(accountNames: string[] | undefined, coder: AccountsCoder) => AccountParsers<M>;
//# sourceMappingURL=generateAccountParsers.d.ts.map