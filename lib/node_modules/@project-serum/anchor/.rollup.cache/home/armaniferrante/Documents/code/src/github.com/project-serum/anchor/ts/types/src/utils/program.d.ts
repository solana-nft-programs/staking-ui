/// <reference types="node" />
import BN from 'bn.js';
import { Connection, PublicKey } from "@solana/web3.js";
export declare function verifiedBuild(connection: Connection, programId: PublicKey, limit?: number): Promise<Build | null>;
/**
 * Returns the program data account for this program, containing the
 * metadata for this program, e.g., the upgrade authority.
 */
export declare function fetchData(connection: Connection, programId: PublicKey): Promise<ProgramData>;
export declare function decodeUpgradeableLoaderState(data: Buffer): any;
export declare type ProgramData = {
    slot: BN;
    upgradeAuthorityAddress: PublicKey | null;
};
export declare type Build = any;
//# sourceMappingURL=program.d.ts.map