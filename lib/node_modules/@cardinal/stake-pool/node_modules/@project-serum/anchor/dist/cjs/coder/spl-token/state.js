"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplTokenStateCoder = void 0;
class SplTokenStateCoder {
    constructor(_idl) { }
    encode(_name, _account) {
        throw new Error("SPL token does not have state");
    }
    decode(_ix) {
        throw new Error("SPL token does not have state");
    }
}
exports.SplTokenStateCoder = SplTokenStateCoder;
//# sourceMappingURL=state.js.map