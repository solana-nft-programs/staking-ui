/// <reference types="node" />
import { Idl } from "../../idl.js";
import { InstructionCoder } from "../index.js";
export declare class DexInstructionCoder implements InstructionCoder {
    constructor(idl: Idl);
    encode(ixName: string, ix: any): Buffer;
    encodeState(ixName: string, ix: any): Buffer;
}
//# sourceMappingURL=instruction.d.ts.map