import type { Idl } from "@project-serum/anchor";
import type { Provider as SaberProvider, ReadonlyProvider as ReadonlySaberProvider } from "@saberhq/solana-contrib";
import type { PublicKey } from "@solana/web3.js";
/**
 * Builds a program from its IDL.
 *
 * @param idl
 * @param address
 * @param provider
 * @returns
 */
export declare const newProgram: <P>(idl: Idl, address: PublicKey, provider: SaberProvider | ReadonlySaberProvider) => P;
/**
 * Builds a map of programs from their IDLs and addresses.
 *
 * @param provider
 * @param programs
 * @returns
 */
export declare const newProgramMap: <P>(provider: SaberProvider | ReadonlySaberProvider, idls: { [K in keyof P]: Idl; }, addresses: { [K_1 in keyof P]: PublicKey; }) => { [K_2 in keyof P]: P[K_2]; };
//# sourceMappingURL=programs.d.ts.map