import { InstructionCoder } from "./instruction.js";
import { AccountsCoder } from "./accounts.js";
import { EventCoder } from "./event.js";
import { StateCoder } from "./state.js";
import { sighash } from "./common.js";
export { accountSize } from "./common.js";
export { InstructionCoder } from "./instruction.js";
export { AccountsCoder, ACCOUNT_DISCRIMINATOR_SIZE } from "./accounts.js";
export { EventCoder, eventDiscriminator } from "./event.js";
export { StateCoder, stateDiscriminator } from "./state.js";
/**
 * Coder provides a facade for encoding and decoding all IDL related objects.
 */
export default class Coder {
    constructor(idl) {
        this.instruction = new InstructionCoder(idl);
        this.accounts = new AccountsCoder(idl);
        this.events = new EventCoder(idl);
        if (idl.state) {
            this.state = new StateCoder(idl);
        }
    }
    sighash(nameSpace, ixName) {
        return sighash(nameSpace, ixName);
    }
}
//# sourceMappingURL=index.js.map