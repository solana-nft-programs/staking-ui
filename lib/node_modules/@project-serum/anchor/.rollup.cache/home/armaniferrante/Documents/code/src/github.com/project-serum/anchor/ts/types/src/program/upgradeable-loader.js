import * as borsh from "@project-serum/borsh";
const UPGRADEABLE_LOADER_STATE_LAYOUT = borsh.rustEnum([
    borsh.struct([], "uninitialized"),
    borsh.struct([
        borsh.option(borsh.publicKey(), "authorityAddress"),
    ], "buffer"),
    borsh.struct([
        borsh.publicKey("programdataAddress")
    ], "program"),
    borsh.struct([
        borsh.u64("slot"),
        borsh.option(borsh.publicKey(), "upgradeAuthorityAddress")
    ], "programData")
]);
export function decodeUpgradeableLoaderState(data) {
    return UPGRADEABLE_LOADER_STATE_LAYOUT.decode(data);
}
//# sourceMappingURL=upgradeable-loader.js.map