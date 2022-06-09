import NodeWallet from "./nodewallet";
export { default as BN } from "bn.js";
export * as web3 from "@solana/web3.js";
export { default as Provider, getProvider, setProvider } from "./provider.js";
export * from "./error.js";
export { Instruction } from "./coder/borsh/instruction.js";
export { Idl } from "./idl.js";
export * from "./coder/index.js";
export * as utils from "./utils/index.js";
export * from "./program/index.js";
export * from "./spl/index.js";
export declare const workspace: any;
export declare class Wallet extends NodeWallet {
}
//# sourceMappingURL=index.d.ts.map