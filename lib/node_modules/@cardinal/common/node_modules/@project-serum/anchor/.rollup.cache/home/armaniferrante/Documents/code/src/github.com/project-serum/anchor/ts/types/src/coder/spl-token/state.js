export class SplTokenStateCoder {
    constructor(_idl) { }
    encode(_name, _account) {
        throw new Error("SPL token does not have state");
    }
    decode(_ix) {
        throw new Error("SPL token does not have state");
    }
}
//# sourceMappingURL=state.js.map