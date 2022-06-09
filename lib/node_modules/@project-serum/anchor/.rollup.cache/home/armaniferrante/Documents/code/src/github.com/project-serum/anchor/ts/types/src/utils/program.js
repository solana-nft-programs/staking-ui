import fetch from 'cross-fetch';
import * as borsh from "@project-serum/borsh";
export async function verifiedBuild(connection, programId, limit = 5) {
    const programData = await fetchData(connection, programId);
    const url = `https://anchor.projectserum.com/api/v0/program/${programId.toString()}/latest?limit=${limit}`;
    let latestBuilds = await (await fetch(url)).json();
    // Filter out all non successful builds.
    latestBuilds = latestBuilds.filter(b => !b.aborted && b.state === "Built" && b.verified === "Verified");
    if (latestBuilds.length === 0) {
        return null;
    }
    // Get the latest build.
    const build = latestBuilds[0];
    // Has the program been upgraded since the last build?
    if (programData.slot.toNumber() !== build.verified_slot) {
        return null;
    }
    // Success.
    return build;
}
/**
 * Returns the program data account for this program, containing the
 * metadata for this program, e.g., the upgrade authority.
 */
export async function fetchData(connection, programId) {
    const accountInfo = await connection.getAccountInfo(programId);
    if (accountInfo === null) {
        throw new Error("program account not found");
    }
    const { program } = decodeUpgradeableLoaderState(accountInfo.data);
    const programdataAccountInfo = await connection.getAccountInfo(program.programdataAddress);
    if (programdataAccountInfo === null) {
        throw new Error("program data account not found");
    }
    const { programData } = decodeUpgradeableLoaderState(programdataAccountInfo.data);
    return programData;
}
const UPGRADEABLE_LOADER_STATE_LAYOUT = borsh.rustEnum([
    borsh.struct([], "uninitialized"),
    borsh.struct([borsh.option(borsh.publicKey(), "authorityAddress")], "buffer"),
    borsh.struct([borsh.publicKey("programdataAddress")], "program"),
    borsh.struct([
        borsh.u64("slot"),
        borsh.option(borsh.publicKey(), "upgradeAuthorityAddress"),
    ], "programData"),
], undefined, borsh.u32());
export function decodeUpgradeableLoaderState(data) {
    return UPGRADEABLE_LOADER_STATE_LAYOUT.decode(data);
}
//# sourceMappingURL=program.js.map