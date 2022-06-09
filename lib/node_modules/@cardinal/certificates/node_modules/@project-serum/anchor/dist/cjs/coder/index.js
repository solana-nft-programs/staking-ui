"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stateDiscriminator = exports.StateCoder = exports.eventDiscriminator = exports.EventCoder = exports.ACCOUNT_DISCRIMINATOR_SIZE = exports.AccountsCoder = exports.InstructionCoder = exports.accountSize = void 0;
const instruction_js_1 = require("./instruction.js");
const accounts_js_1 = require("./accounts.js");
const event_js_1 = require("./event.js");
const state_js_1 = require("./state.js");
const common_js_1 = require("./common.js");
var common_js_2 = require("./common.js");
Object.defineProperty(exports, "accountSize", { enumerable: true, get: function () { return common_js_2.accountSize; } });
var instruction_js_2 = require("./instruction.js");
Object.defineProperty(exports, "InstructionCoder", { enumerable: true, get: function () { return instruction_js_2.InstructionCoder; } });
var accounts_js_2 = require("./accounts.js");
Object.defineProperty(exports, "AccountsCoder", { enumerable: true, get: function () { return accounts_js_2.AccountsCoder; } });
Object.defineProperty(exports, "ACCOUNT_DISCRIMINATOR_SIZE", { enumerable: true, get: function () { return accounts_js_2.ACCOUNT_DISCRIMINATOR_SIZE; } });
var event_js_2 = require("./event.js");
Object.defineProperty(exports, "EventCoder", { enumerable: true, get: function () { return event_js_2.EventCoder; } });
Object.defineProperty(exports, "eventDiscriminator", { enumerable: true, get: function () { return event_js_2.eventDiscriminator; } });
var state_js_2 = require("./state.js");
Object.defineProperty(exports, "StateCoder", { enumerable: true, get: function () { return state_js_2.StateCoder; } });
Object.defineProperty(exports, "stateDiscriminator", { enumerable: true, get: function () { return state_js_2.stateDiscriminator; } });
/**
 * Coder provides a facade for encoding and decoding all IDL related objects.
 */
class Coder {
    constructor(idl) {
        this.instruction = new instruction_js_1.InstructionCoder(idl);
        this.accounts = new accounts_js_1.AccountsCoder(idl);
        this.events = new event_js_1.EventCoder(idl);
        if (idl.state) {
            this.state = new state_js_1.StateCoder(idl);
        }
    }
    sighash(nameSpace, ixName) {
        return (0, common_js_1.sighash)(nameSpace, ixName);
    }
}
exports.default = Coder;
//# sourceMappingURL=index.js.map