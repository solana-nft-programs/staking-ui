"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const context_js_1 = require("../context.js");
const error_js_1 = require("../../error.js");
const features = __importStar(require("../../utils/features.js"));
class RpcFactory {
    static build(idlIx, txFn, idlErrors, provider) {
        const rpc = async (...args) => {
            const tx = txFn(...args);
            const [, ctx] = (0, context_js_1.splitArgsAndCtx)(idlIx, [...args]);
            try {
                const txSig = await provider.send(tx, ctx.signers, ctx.options);
                return txSig;
            }
            catch (err) {
                if (features.isSet("debug-logs")) {
                    console.log("Translating error:", err);
                }
                let translatedErr = error_js_1.ProgramError.parse(err, idlErrors);
                if (translatedErr === null) {
                    throw err;
                }
                throw translatedErr;
            }
        };
        return rpc;
    }
}
exports.default = RpcFactory;
//# sourceMappingURL=rpc.js.map