import { DexInstructionCoder } from "./instruction.js";
import { DexStateCoder } from "./state.js";
import { DexAccountsCoder } from "./accounts.js";
import { DexEventsCoder } from "./events.js";
export class DexCoder {
    constructor(idl) {
        this.instruction = new DexInstructionCoder(idl);
        this.accounts = new DexAccountsCoder(idl);
        this.events = new DexEventsCoder(idl);
        this.state = new DexStateCoder(idl);
    }
}
//# sourceMappingURL=index.js.map