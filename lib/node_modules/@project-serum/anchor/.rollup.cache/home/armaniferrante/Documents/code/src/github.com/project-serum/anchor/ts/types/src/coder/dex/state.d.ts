/// <reference types="node" />
import { Idl } from "../../idl.js";
export declare class DexStateCoder {
    constructor(_idl: Idl);
    encode<T = any>(_name: string, _account: T): Promise<Buffer>;
    decode<T = any>(_ix: Buffer): T;
}
//# sourceMappingURL=state.d.ts.map