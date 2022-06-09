/// <reference types="node" />
import { PublicKey } from "@solana/web3.js";
export declare type Idl = {
    version: string;
    name: string;
    instructions: IdlInstruction[];
    state?: IdlState;
    accounts?: IdlTypeDef[];
    types?: IdlTypeDef[];
    events?: IdlEvent[];
    errors?: IdlErrorCode[];
    constants?: IdlConstant[];
    metadata?: IdlMetadata;
};
export declare type IdlMetadata = any;
export declare type IdlConstant = {
    name: string;
    type: IdlType;
    value: string;
};
export declare type IdlEvent = {
    name: string;
    fields: IdlEventField[];
};
export declare type IdlEventField = {
    name: string;
    type: IdlType;
    index: boolean;
};
export declare type IdlInstruction = {
    name: string;
    accounts: IdlAccountItem[];
    args: IdlField[];
};
export declare type IdlState = {
    struct: IdlTypeDef;
    methods: IdlStateMethod[];
};
export declare type IdlStateMethod = IdlInstruction;
export declare type IdlAccountItem = IdlAccount | IdlAccounts;
export declare type IdlAccount = {
    name: string;
    isMut: boolean;
    isSigner: boolean;
    pda?: IdlPda;
};
export declare type IdlPda = {
    seeds: IdlSeed[];
    programId?: IdlSeed;
};
export declare type IdlSeed = any;
export declare type IdlAccounts = {
    name: string;
    accounts: IdlAccountItem[];
};
export declare type IdlField = {
    name: string;
    type: IdlType;
};
export declare type IdlTypeDef = {
    name: string;
    type: IdlTypeDefTy;
};
export declare type IdlTypeDefTyStruct = {
    kind: "struct";
    fields: IdlTypeDefStruct;
};
export declare type IdlTypeDefTyEnum = {
    kind: "enum";
    variants: IdlEnumVariant[];
};
declare type IdlTypeDefTy = IdlTypeDefTyEnum | IdlTypeDefTyStruct;
declare type IdlTypeDefStruct = Array<IdlField>;
export declare type IdlType = "bool" | "u8" | "i8" | "u16" | "i16" | "u32" | "i32" | "f32" | "u64" | "i64" | "f64" | "u128" | "i128" | "bytes" | "string" | "publicKey" | IdlTypeDefined | IdlTypeOption | IdlTypeCOption | IdlTypeVec | IdlTypeArray;
export declare type IdlTypeDefined = {
    defined: string;
};
export declare type IdlTypeOption = {
    option: IdlType;
};
export declare type IdlTypeCOption = {
    coption: IdlType;
};
export declare type IdlTypeVec = {
    vec: IdlType;
};
export declare type IdlTypeArray = {
    array: [idlType: IdlType, size: number];
};
export declare type IdlEnumVariant = {
    name: string;
    fields?: IdlEnumFields;
};
declare type IdlEnumFields = IdlEnumFieldsNamed | IdlEnumFieldsTuple;
declare type IdlEnumFieldsNamed = IdlField[];
declare type IdlEnumFieldsTuple = IdlType[];
export declare type IdlErrorCode = {
    code: number;
    name: string;
    msg?: string;
};
export declare function idlAddress(programId: PublicKey): Promise<PublicKey>;
export declare function seed(): string;
export interface IdlProgramAccount {
    authority: PublicKey;
    data: Buffer;
}
export declare function decodeIdlAccount(data: Buffer): IdlProgramAccount;
export declare function encodeIdlAccount(acc: IdlProgramAccount): Buffer;
export {};
//# sourceMappingURL=idl.d.ts.map