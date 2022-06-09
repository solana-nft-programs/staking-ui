"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAnchorProvider = exports.makeSaberProvider = exports.makeReadonlySaberProvider = exports.buildAnchorProvider = exports.AnchorProviderClass = void 0;
const tslib_1 = require("tslib");
const anchor = tslib_1.__importStar(require("@project-serum/anchor"));
const solana_contrib_1 = require("@saberhq/solana-contrib");
const anchorModule = anchor;
/**
 * Class used to create new {@link AnchorProvider}s.
 */
exports.AnchorProviderClass = "AnchorProvider" in anchorModule
    ? anchorModule.AnchorProvider
    : anchorModule.Provider;
/**
 * Create a new Anchor provider.
 *
 * @param connection
 * @param wallet
 * @param opts
 * @returns
 */
const buildAnchorProvider = (connection, wallet, opts) => {
    return new exports.AnchorProviderClass(connection, wallet, opts);
};
exports.buildAnchorProvider = buildAnchorProvider;
/**
 * Creates a readonly Saber Provider from an Anchor provider.
 * @param anchorProvider The Anchor provider.
 * @returns
 */
const makeReadonlySaberProvider = (anchorProvider) => {
    return new solana_contrib_1.SolanaReadonlyProvider(anchorProvider.connection);
};
exports.makeReadonlySaberProvider = makeReadonlySaberProvider;
/**
 * Creates a Saber Provider from an Anchor provider.
 * @param anchorProvider The Anchor provider.
 * @returns
 */
const makeSaberProvider = (anchorProvider) => {
    return solana_contrib_1.SolanaProvider.init({
        connection: anchorProvider.connection,
        wallet: anchorProvider.wallet,
        opts: anchorProvider.opts,
    });
};
exports.makeSaberProvider = makeSaberProvider;
/**
 * Creates an Anchor Provider from a Saber provider.
 * @param saberProvider
 * @returns
 */
const makeAnchorProvider = (saberProvider) => {
    return (0, exports.buildAnchorProvider)(saberProvider.connection, saberProvider.wallet, saberProvider.opts);
};
exports.makeAnchorProvider = makeAnchorProvider;
//# sourceMappingURL=provider.js.map