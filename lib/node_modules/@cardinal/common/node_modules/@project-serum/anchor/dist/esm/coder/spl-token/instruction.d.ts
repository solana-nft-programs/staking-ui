/// <reference types="node" />
import { InstructionCoder } from "../index.js";
import { Idl } from "../../idl.js";
export declare class SplTokenInstructionCoder implements InstructionCoder {
    constructor(_: Idl);
    encode(ixName: string, ix: any): Buffer;
    encodeState(_ixName: string, _ix: any): Buffer;
}
//# sourceMappingURL=instruction.d.ts.map