"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplTokenInstructionCoder = void 0;
const BufferLayout = __importStar(require("buffer-layout"));
const camelcase_1 = __importDefault(require("camelcase"));
const web3_js_1 = require("@solana/web3.js");
class SplTokenInstructionCoder {
    constructor(_) { }
    encode(ixName, ix) {
        switch ((0, camelcase_1.default)(ixName)) {
            case "initializeMint": {
                return encodeInitializeMint(ix);
            }
            case "initializeAccount": {
                return encodeInitializeAccount(ix);
            }
            case "initializeMultisig": {
                return encodeInitializeMultisig(ix);
            }
            case "transfer": {
                return encodeTransfer(ix);
            }
            case "approve": {
                return encodeApprove(ix);
            }
            case "revoke": {
                return encodeRevoke(ix);
            }
            case "setAuthority": {
                return encodeSetAuthority(ix);
            }
            case "mintTo": {
                return encodeMintTo(ix);
            }
            case "burn": {
                return encodeBurn(ix);
            }
            case "closeAccount": {
                return encodeCloseAccount(ix);
            }
            case "freezeAccount": {
                return encodeFreezeAccount(ix);
            }
            case "thawAccount": {
                return encodeThawAccount(ix);
            }
            case "transferChecked": {
                return encodeTransferChecked(ix);
            }
            case "approvedChecked": {
                return encodeApproveChecked(ix);
            }
            case "mintToChecked": {
                return encodeMintToChecked(ix);
            }
            case "burnChecked": {
                return encodeBurnChecked(ix);
            }
            case "intializeAccount2": {
                return encodeInitializeAccount2(ix);
            }
            case "syncNative": {
                return encodeSyncNative(ix);
            }
            case "initializeAccount3": {
                return encodeInitializeAccount3(ix);
            }
            case "initializeMultisig2": {
                return encodeInitializeMultisig2(ix);
            }
            case "initializeMint2": {
                return encodeInitializeMint2(ix);
            }
            default: {
                throw new Error(`Invalid instruction: ${ixName}`);
            }
        }
    }
    encodeState(_ixName, _ix) {
        throw new Error("SPL token does not have state");
    }
}
exports.SplTokenInstructionCoder = SplTokenInstructionCoder;
function encodeInitializeMint({ decimals, mintAuthority, freezeAuthority, }) {
    return encodeData({
        initializeMint: {
            decimals,
            mintAuthority: mintAuthority.toBuffer(),
            freezeAuthorityOption: !!freezeAuthority,
            freezeAuthority: (freezeAuthority || web3_js_1.PublicKey.default).toBuffer(),
        },
    });
}
function encodeInitializeAccount(_ix) {
    return encodeData({
        initializeAccount: {},
    });
}
function encodeInitializeMultisig({ m }) {
    return encodeData({
        initializeMultisig: {
            m,
        },
    });
}
function encodeTransfer({ amount }) {
    return encodeData({
        transfer: { amount },
    });
}
function encodeApprove({ amount }) {
    return encodeData({
        approve: { amount },
    });
}
function encodeRevoke(_ix) {
    return encodeData({
        revoke: {},
    });
}
function encodeSetAuthority({ authorityType, newAuthority }) {
    return encodeData({
        setAuthority: { authorityType, newAuthority },
    });
}
function encodeMintTo({ amount }) {
    return encodeData({
        mintTo: { amount },
    });
}
function encodeBurn({ amount }) {
    return encodeData({
        burn: { amount },
    });
}
function encodeCloseAccount(_) {
    return encodeData({
        closeAccount: {},
    });
}
function encodeFreezeAccount(_) {
    return encodeData({
        freezeAccount: {},
    });
}
function encodeThawAccount(_) {
    return encodeData({
        thawAccount: {},
    });
}
function encodeTransferChecked({ amount, decimals }) {
    return encodeData({
        transferChecked: { amount, decimals },
    });
}
function encodeApproveChecked({ amount, decimals }) {
    return encodeData({
        approveChecked: { amount, decimals },
    });
}
function encodeMintToChecked({ amount, decimals }) {
    return encodeData({
        mintToChecked: { amount, decimals },
    });
}
function encodeBurnChecked({ amount, decimals }) {
    return encodeData({
        burnChecked: { amount, decimals },
    });
}
function encodeInitializeAccount2({ authority }) {
    return encodeData({
        initilaizeAccount2: { authority },
    });
}
function encodeSyncNative(_) {
    return encodeData({
        syncNative: {},
    });
}
function encodeInitializeAccount3({ authority }) {
    return encodeData({
        initializeAccount3: { authority },
    });
}
function encodeInitializeMultisig2({ m }) {
    return encodeData({
        initializeMultisig2: { m },
    });
}
function encodeInitializeMint2({ decimals, mintAuthority, freezeAuthority, }) {
    return encodeData({
        encodeInitializeMint2: { decimals, mintAuthority, freezeAuthority },
    });
}
const LAYOUT = BufferLayout.union(BufferLayout.u8("instruction"));
LAYOUT.addVariant(0, BufferLayout.struct([
    BufferLayout.u8("decimals"),
    BufferLayout.blob(32, "mintAuthority"),
    BufferLayout.u8("freezeAuthorityOption"),
    publicKey("freezeAuthority"),
]), "initializeMint");
LAYOUT.addVariant(1, BufferLayout.struct([]), "initializeAccount");
LAYOUT.addVariant(2, BufferLayout.struct([BufferLayout.u8("m")]), "initializeMultisig");
LAYOUT.addVariant(3, BufferLayout.struct([BufferLayout.nu64("amount")]), "transfer");
LAYOUT.addVariant(4, BufferLayout.struct([BufferLayout.nu64("amount")]), "approve");
LAYOUT.addVariant(5, BufferLayout.struct([]), "revoke");
LAYOUT.addVariant(6, BufferLayout.struct([
    BufferLayout.u8("authorityType"),
    BufferLayout.u8("newAuthorityOption"),
    publicKey("newAuthority"),
]), "setAuthority");
LAYOUT.addVariant(7, BufferLayout.struct([BufferLayout.nu64("amount")]), "mintTo");
LAYOUT.addVariant(8, BufferLayout.struct([BufferLayout.nu64("amount")]), "burn");
LAYOUT.addVariant(9, BufferLayout.struct([]), "closeAccount");
LAYOUT.addVariant(10, BufferLayout.struct([]), "freezeAccount");
LAYOUT.addVariant(11, BufferLayout.struct([]), "thawAccount");
LAYOUT.addVariant(12, BufferLayout.struct([
    BufferLayout.nu64("amount"),
    BufferLayout.u8("decimals"),
]), "transferChecked");
LAYOUT.addVariant(13, BufferLayout.struct([
    BufferLayout.nu64("amount"),
    BufferLayout.u8("decimals"),
]), "approvedChecked");
LAYOUT.addVariant(14, BufferLayout.struct([
    BufferLayout.nu64("amount"),
    BufferLayout.u8("decimals"),
]), "mintToChecked");
LAYOUT.addVariant(15, BufferLayout.struct([
    BufferLayout.nu64("amount"),
    BufferLayout.u8("decimals"),
]), "burnedChecked");
LAYOUT.addVariant(16, BufferLayout.struct([publicKey("authority")]), "InitializeAccount2");
LAYOUT.addVariant(17, BufferLayout.struct([]), "syncNative");
LAYOUT.addVariant(18, BufferLayout.struct([publicKey("authority")]), "initializeAccount3");
LAYOUT.addVariant(19, BufferLayout.struct([BufferLayout.u8("m")]), "initializeMultisig2");
LAYOUT.addVariant(20, BufferLayout.struct([
    BufferLayout.u8("decimals"),
    publicKey("mintAuthority"),
    BufferLayout.u8("freezeAuthorityOption"),
    publicKey("freezeAuthority"),
]), "initializeMint2");
function publicKey(property) {
    return BufferLayout.blob(32, property);
}
function encodeData(instruction) {
    let b = Buffer.alloc(instructionMaxSpan);
    let span = LAYOUT.encode(instruction, b);
    return b.slice(0, span);
}
const instructionMaxSpan = Math.max(
// @ts-ignore
...Object.values(LAYOUT.registry).map((r) => r.span));
//# sourceMappingURL=instruction.js.map