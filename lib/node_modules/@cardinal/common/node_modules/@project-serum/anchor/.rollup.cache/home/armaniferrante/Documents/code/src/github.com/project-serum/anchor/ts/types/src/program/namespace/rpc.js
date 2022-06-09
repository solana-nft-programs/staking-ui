import { splitArgsAndCtx } from "../context.js";
import { ProgramError } from "../../error.js";
import * as features from "../../utils/features.js";
export default class RpcFactory {
    static build(idlIx, txFn, idlErrors, provider) {
        const rpc = async (...args) => {
            const tx = txFn(...args);
            const [, ctx] = splitArgsAndCtx(idlIx, [...args]);
            try {
                const txSig = await provider.send(tx, ctx.signers, ctx.options);
                return txSig;
            }
            catch (err) {
                if (features.isSet("debug-logs")) {
                    console.log("Translating error:", err);
                }
                let translatedErr = ProgramError.parse(err, idlErrors);
                if (translatedErr === null) {
                    throw err;
                }
                throw translatedErr;
            }
        };
        return rpc;
    }
}
//# sourceMappingURL=rpc.js.map