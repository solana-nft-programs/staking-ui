import * as anchor from "@project-serum/anchor";
import { SolanaProvider, SolanaReadonlyProvider, } from "@saberhq/solana-contrib";
const anchorModule = anchor;
/**
 * Class used to create new {@link AnchorProvider}s.
 */
export const AnchorProviderClass = "AnchorProvider" in anchorModule
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
export const buildAnchorProvider = (connection, wallet, opts) => {
    return new AnchorProviderClass(connection, wallet, opts);
};
/**
 * Creates a readonly Saber Provider from an Anchor provider.
 * @param anchorProvider The Anchor provider.
 * @returns
 */
export const makeReadonlySaberProvider = (anchorProvider) => {
    return new SolanaReadonlyProvider(anchorProvider.connection);
};
/**
 * Creates a Saber Provider from an Anchor provider.
 * @param anchorProvider The Anchor provider.
 * @returns
 */
export const makeSaberProvider = (anchorProvider) => {
    return SolanaProvider.init({
        connection: anchorProvider.connection,
        wallet: anchorProvider.wallet,
        opts: anchorProvider.opts,
    });
};
/**
 * Creates an Anchor Provider from a Saber provider.
 * @param saberProvider
 * @returns
 */
export const makeAnchorProvider = (saberProvider) => {
    return buildAnchorProvider(saberProvider.connection, saberProvider.wallet, saberProvider.opts);
};
//# sourceMappingURL=provider.js.map