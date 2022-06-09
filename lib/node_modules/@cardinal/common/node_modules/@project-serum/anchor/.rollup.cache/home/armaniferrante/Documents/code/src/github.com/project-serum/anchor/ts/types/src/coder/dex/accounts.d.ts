/// <reference types="node" />
import { Idl, IdlTypeDef } from "../../idl.js";
import { AccountsCoder } from "../index.js";
export declare class DexAccountsCoder<A extends string = string> implements AccountsCoder {
    constructor(idl: Idl);
    encode<T = any>(accountName: A, account: T): Promise<Buffer>;
    decode<T = any>(accountName: A, ix: Buffer): T;
    decodeUnchecked<T = any>(accountName: A, ix: Buffer): T;
    memcmp(accountName: A, appendData?: Buffer): any;
    size(idlAccount: IdlTypeDef): number;
}
//# sourceMappingURL=accounts.d.ts.map