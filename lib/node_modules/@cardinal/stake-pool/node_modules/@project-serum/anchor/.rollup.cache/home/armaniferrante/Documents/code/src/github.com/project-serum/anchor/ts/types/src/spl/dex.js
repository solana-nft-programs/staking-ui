import { PublicKey } from "@solana/web3.js";
import { Program } from "../program/index.js";
import { DexCoder } from "../coder/dex/index.js";
const DEX_PROGRAM_ID = new PublicKey(
// TODO
"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
export function program(provider) {
    return new Program(IDL, DEX_PROGRAM_ID, provider, new DexCoder(IDL));
}
// TODO
export const IDL = {
    version: "0.1.0",
    name: "spl_token",
    instructions: [],
    accounts: [],
};
//# sourceMappingURL=dex.js.map