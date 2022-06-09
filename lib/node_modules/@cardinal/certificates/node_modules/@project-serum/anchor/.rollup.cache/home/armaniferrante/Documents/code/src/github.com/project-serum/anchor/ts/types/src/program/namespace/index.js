import camelCase from "camelcase";
import StateFactory from "./state.js";
import InstructionFactory from "./instruction.js";
import TransactionFactory from "./transaction.js";
import RpcFactory from "./rpc.js";
import AccountFactory from "./account.js";
import SimulateFactory from "./simulate.js";
import { parseIdlErrors } from "../common.js";
// Re-exports.
export { StateClient } from "./state.js";
export { AccountClient } from "./account.js";
export default class NamespaceFactory {
    /**
     * Generates all namespaces for a given program.
     */
    static build(idl, coder, programId, provider) {
        const rpc = {};
        const instruction = {};
        const transaction = {};
        const simulate = {};
        const idlErrors = parseIdlErrors(idl);
        const state = StateFactory.build(idl, coder, programId, provider);
        idl.instructions.forEach((idlIx) => {
            const ixItem = InstructionFactory.build(idlIx, (ixName, ix) => coder.instruction.encode(ixName, ix), programId);
            const txItem = TransactionFactory.build(idlIx, ixItem);
            const rpcItem = RpcFactory.build(idlIx, txItem, idlErrors, provider);
            const simulateItem = SimulateFactory.build(idlIx, txItem, idlErrors, provider, coder, programId, idl);
            const name = camelCase(idlIx.name);
            instruction[name] = ixItem;
            transaction[name] = txItem;
            rpc[name] = rpcItem;
            simulate[name] = simulateItem;
        });
        const account = idl.accounts
            ? AccountFactory.build(idl, coder, programId, provider)
            : {};
        return [
            rpc,
            instruction,
            transaction,
            account,
            simulate,
            state,
        ];
    }
}
//# sourceMappingURL=index.js.map