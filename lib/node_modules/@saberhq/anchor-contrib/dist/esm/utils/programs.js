import { Program } from "@project-serum/anchor";
import mapValues from "lodash.mapvalues";
import { makeAnchorProvider } from "./provider.js";
/**
 * Builds a program from its IDL.
 *
 * @param idl
 * @param address
 * @param provider
 * @returns
 */
export const newProgram = (idl, address, provider) => {
    return new Program(idl, address.toString(), makeAnchorProvider(provider));
};
/**
 * Builds a map of programs from their IDLs and addresses.
 *
 * @param provider
 * @param programs
 * @returns
 */
export const newProgramMap = (provider, idls, addresses) => {
    return mapValues(idls, (idl, k) => newProgram(idl, addresses[k], provider));
};
//# sourceMappingURL=programs.js.map