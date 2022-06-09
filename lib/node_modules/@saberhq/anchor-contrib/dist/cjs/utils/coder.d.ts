/// <reference types="node" />
import type { Accounts, Idl } from "@project-serum/anchor";
import { BorshCoder, EventParser } from "@project-serum/anchor";
import type { InstructionDisplay } from "@project-serum/anchor/dist/esm/coder/borsh/instruction.js";
import type { IdlAccountItem, IdlTypeDef } from "@project-serum/anchor/dist/esm/idl.js";
import type { Provider as SaberProvider } from "@saberhq/solana-contrib";
import type { GetProgramAccountsFilter, PublicKey } from "@solana/web3.js";
import { TransactionInstruction } from "@solana/web3.js";
import type { ErrorMap } from "../errors.js";
import type { AccountParsers } from "../generateAccountParsers.js";
import type { AnchorAccountMap } from "./accounts.js";
/**
 * Formatted instruction with its name.
 */
export declare type InstructionParsed = InstructionDisplay & {
    name: string;
};
declare type CoderAnchorTypes = {
    AccountMap: Record<string, object>;
    Events: Record<string, unknown>;
    IDL: Idl;
    Instructions: Record<string, {
        accounts: IdlAccountItem[];
        args: unknown[];
        namedArgs: Record<string, unknown>;
    }>;
    Program: unknown;
};
declare type IDLAccountName<IDL extends Idl> = NonNullable<IDL["accounts"]>[number]["name"];
/**
 * Coder wrapper.
 *
 * Allows interacting with a program without a provider.
 */
export declare class SuperCoder<T extends CoderAnchorTypes> {
    /**
     * Program address.
     */
    readonly address: PublicKey;
    /**
     * Program IDL.
     */
    readonly idl: T["IDL"];
    /**
     * Underlying Coder.
     */
    readonly coder: BorshCoder;
    /**
     * Parses events.
     */
    readonly eventParser: EventParser;
    /**
     * All accounts.
     */
    readonly accounts: AnchorAccountMap<T["AccountMap"]>;
    /**
     * Parses accounts.
     * @deprecated use {@link SuperCoder#accounts}
     */
    readonly accountParsers: AccountParsers<T["AccountMap"]>;
    /**
     * All account {@link IdlTypeDef}s.
     * @deprecated use {@link SuperCoder#accounts}
     */
    readonly accountTypeDefs: {
        [K in IDLAccountName<T["IDL"]>]: IdlTypeDef;
    };
    /**
     * Mapping of error name to error details.
     */
    readonly errorMap: ErrorMap<T["IDL"]>;
    /**
     * Mapping of hex discriminator to the account name.
     */
    readonly discriminators: {
        [hexDiscriminator: string]: string;
    };
    /**
     * Mapping of hex discriminator to the account name.
     * @deprecated use {@link SuperCoder#accounts}
     */
    readonly discriminatorsByAccount: {
        [K in NonNullable<T["IDL"]["accounts"]>[number]["name"]]: Buffer;
    };
    /**
     * Constructor.
     * @param address
     * @param idl
     */
    constructor(
    /**
     * Program address.
     */
    address: PublicKey, 
    /**
     * Program IDL.
     */
    idl: T["IDL"]);
    /**
     * Creates a {@link GetProgramAccountsFilter} for the given account.
     */
    makeGPAFilter(account: NonNullable<T["IDL"]["accounts"]>[number]["name"], ...filters: GetProgramAccountsFilter[]): GetProgramAccountsFilter[];
    /**
     * Parses events in the program log.
     * @param logs
     * @returns
     */
    parseProgramLogEvents<E extends T["Events"][keyof T["Events"]] = T["Events"][keyof T["Events"]]>(logs?: string[]): readonly E[];
    /**
     * Encodes a {@link TransactionInstruction}.
     * @returns
     */
    encodeIX<K extends keyof T["Instructions"] & string = keyof T["Instructions"] & string, I extends T["Instructions"][K] = T["Instructions"][K]>(name: K, args: I["namedArgs"], accounts: Accounts<I["accounts"][number]>): TransactionInstruction;
    /**
     * Parses a {@link TransactionInstruction}.
     * @returns
     */
    parseInstruction(txInstruction: TransactionInstruction): InstructionParsed;
    /**
     * Gets a {@link Program} from a provider.
     * @param provider
     * @returns
     */
    getProgram(provider: SaberProvider): T["Program"];
}
/**
 * Builds a map of coders from their IDLs and addresses.
 *
 * @param provider
 * @param programs
 * @returns
 */
export declare const buildCoderMap: <P extends { [K in keyof P]: CoderAnchorTypes; }>(idls: { [K_1 in keyof P]: Idl; }, addresses: { [K_2 in keyof P]: PublicKey; }) => { [K_3 in keyof P]: SuperCoder<P[K_3]>; };
export {};
//# sourceMappingURL=coder.d.ts.map